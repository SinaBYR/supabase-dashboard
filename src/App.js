import { useEffect, useState } from 'react';
import './App.css';
import { Account } from './components/Account';
import { Auth } from './components/Auth';
import { supabase } from './supabase/supabaseClient';

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

  }, [])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {session ? <Account key={session.user.id} session={session}/> : <Auth />}
    </div>
  )
}

export default App;