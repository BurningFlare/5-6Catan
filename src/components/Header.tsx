import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'

const Header = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return () => unsubscribe()
  }, [])

  return (
    <header className="bg-[#00BFAE]/30 backdrop-blur-sm border-b border-[#00BFAE]/20">
      <nav className="container mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#E76F51]">5-6 Player Catan</h1>
        <div className="flex items-center gap-6">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild className="ml-2">
            <Link to="/lobby">Lobby</Link>
          </Button>
          {user ? (
            <div className="flex items-center gap-3 ml-6">
              {user.photoURL && (
                <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full border-2 border-[#00BFAE]" />
              )}
              <span className="text-[#E9C46A] font-semibold text-sm">{user.displayName || user.email}</span>
              <Button variant="secondary" size="sm" onClick={() => signOut(auth)} className="ml-2">Sign out</Button>
            </div>
          ) : (
            <Button variant="secondary" asChild className="ml-6">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header 