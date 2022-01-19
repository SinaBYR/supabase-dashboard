import { useState } from "react"
import { supabase } from '../supabase/supabaseClient'
import { Modal } from "./Modal"

export function Auth() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isModalActive, setIsModalActive] = useState(false)

    const handleLogin = async () => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signIn({email})
            if(error) throw error
            setIsModalActive(true)
            // alert('Check out')
        } catch(err) {
            setError(err.error_description || err.message)
            setIsModalActive(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="row flex flex-center">
          {isModalActive &&
          <Modal
            deactivate={() => setIsModalActive(false)}
            message={error ? error : "Check your email for the login link!"}
          />}

          <div className="col-6 form-widget">
            <h1 className="header">Supabase + React</h1>
            <p className="description">Sign in via magic link with your email below</p>
            <div>
              <input
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleLogin(email)
                }}
                className={'button block'}
                disabled={loading}
              >
                {loading ? <span>Loading</span> : <span>Send magic link</span>}
              </button>
            </div>
          </div>
        </div>
      )
}