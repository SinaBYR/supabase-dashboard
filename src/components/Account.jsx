import { useEffect, useState } from "react"
import { supabase } from "../supabase/supabaseClient"
import { Avatar } from "./Avatar"
import { Modal } from "./Modal"

export function Account({ session }) {
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [error, setError] = useState(null)
    const [isModalActive, setIsModalActive] = useState(false)

    useEffect(() => {
        getProfile()
    }, [session])

    const getProfile = async () => {
        try {
            setLoading(true)
            const user = supabase.auth.user()

            const { data, error, status } = await supabase
                .from('profiles')
                .select('username, website, avatar_url')
                .eq('id', user.id)
                .single()

            if(error && status !== 406) {
                throw error
            }

            if(data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }
        } catch(err) {
            setError(err.message)
            setIsModalActive(true)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async ({ username, website, avatarUrl }) => {
        try {
            setLoading(true)
            const user = supabase.auth.user()
            const updates = {
                id: user.id,
                username,
                website,
                avatar_url: avatarUrl,
                updated_at: new Date()
            }

            const { error } = await supabase
                .from('profiles')
                .upsert(updates, {returning: 'minimal'})

            if(error) {
                throw error
            }
        } catch(err) {
            setError(err.message)
            setIsModalActive(true)
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="form-widget">
        {isModalActive &&
            <Modal deactivate={() => setIsModalActive(false)} message={error}/>}

        <Avatar
            url={avatarUrl}
            size={150}
            onError={(message) => {
                setError(message)
                setIsModalActive(true)
            }}
            onUpload={(url) => {
                setAvatarUrl(url)
                updateProfile({ username, website, avatar_url: url })
            }}/>
        <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={session.user.email} disabled />
        </div>
        <div>
            <label htmlFor="username">Name</label>
            <input
                id="username"
                type="text"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                />
        </div>
        <div>
            <label htmlFor="website">Website</label>
            <input
                id="website"
                type="website"
                value={website || ''}
                onChange={(e) => setWebsite(e.target.value)}
                />
        </div>

        <div>
            <button
                className="button block primary"
                onClick={() => updateProfile({ username, website, avatarUrl })}
                disabled={loading}
                >
            {loading ? 'Loading ...' : 'Update'}
            </button>
        </div>

        <div>
            <button className="button block" onClick={() => supabase.auth.signOut()}>
            Sign Out
            </button>
        </div>
    </div>
    )
}