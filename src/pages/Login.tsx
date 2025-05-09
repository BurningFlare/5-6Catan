import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Header from '@/components/Header'
import { useNavigate } from 'react-router-dom'

const provider = new GoogleAuthProvider()

const Login = () => {
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider)
      navigate('/lobby')
    } catch (error) {
      alert('Google sign-in failed!')
    }
  }

  return (
    <div className="min-h-screen bg-[#153542] text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-[#00BFAE]/10 rounded-2xl p-10 shadow-xl flex flex-col items-center gap-8">
          <h2 className="text-3xl font-bold text-[#E9C46A]">Sign in to 5-6 Player Catan</h2>
          <Button
            onClick={handleGoogleSignIn}
            className="bg-white text-[#153542] hover:bg-[#E9C46A] hover:text-[#153542] font-bold px-8 py-4 text-lg rounded-full flex items-center gap-3 shadow-md"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_17_40)">
                <path d="M23.766 12.276c0-.818-.074-1.604-.213-2.356H12.24v4.482h6.48c-.28 1.482-1.12 2.74-2.38 3.588v2.98h3.84c2.24-2.062 3.526-5.102 3.526-8.694z" fill="#4285F4"/>
                <path d="M12.24 24c3.24 0 5.96-1.074 7.946-2.92l-3.84-2.98c-1.064.714-2.42 1.14-4.106 1.14-3.156 0-5.832-2.13-6.792-4.99H1.494v3.12C3.472 21.876 7.56 24 12.24 24z" fill="#34A853"/>
                <path d="M5.448 14.25A7.23 7.23 0 0 1 4.8 12c0-.78.134-1.536.372-2.25V6.63H1.494A11.97 11.97 0 0 0 0 12c0 1.934.464 3.764 1.494 5.37l3.954-3.12z" fill="#FBBC05"/>
                <path d="M12.24 4.782c1.77 0 2.98.76 3.664 1.398l2.74-2.74C17.96 1.872 15.24.75 12.24.75 7.56.75 3.472 2.874 1.494 6.63l3.954 3.12c.96-2.86 3.636-4.968 6.792-4.968z" fill="#EA4335"/>
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            Sign in with Google
          </Button>
        </div>
      </main>
    </div>
  )
}

export default Login 