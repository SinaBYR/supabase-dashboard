import { useEffect, useState } from "react"
import { supabase } from "../supabase/supabaseClient"

export function Avatar({ url, size, onUpload, onError }) {
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(url) {
            downloadImage(url)
        }
    }, [url])

    const downloadImage = async (path) => {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path)
            if(error) {
                throw error
            }

            const url = URL.createObjectURL(data)
            setAvatarUrl(url)
        } catch(err) {
            console.log('Error downloading image: ', err.message)
        }
    }

    console.log(avatarUrl)

    const uploadAvatar = async (e) => {
        try {
            setLoading(true)
            if(!e.target.files[0] || !e.target.files.length) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]
            const fileExtension = file.name.split('.').pop()
            const fileName = Math.random() + '.' + fileExtension
            const filePath = fileName

            const { error } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if(error) {
                throw error
            }

            onUpload(filePath)
        } catch(err) {
            onError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="avatar image"
                    style={{ height: size, width: size }}/>
            ) : (
                <div className="avatar no-image" style={{ height: size, width: size }} />
            )}
            <div style={{ width: size }}>
                <label className="button primary block" htmlFor="single">{loading ? 'Uploading ...' : 'Upload'}</label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={loading}/>
            </div>
        </div>
    )
}