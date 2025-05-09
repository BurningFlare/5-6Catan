import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="h-screen bg-[#153542] text-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4 flex items-center justify-center">
        <div className="flex items-center justify-center gap-16 h-full max-w-7xl w-full">
          {/* Game Board Preview (placeholder) */}
          <div className="flex-1 max-w-[50%] h-full flex items-center justify-center -ml-12">
            <div className="aspect-square w-full max-w-xl bg-[#00BFAE]/10 rounded-lg border-2 border-[#00BFAE]/20 backdrop-blur-sm">
              {/* This is where we'll add the Catan board visualization */}
            </div>
          </div>

          {/* Right Section with Text and Button */}
          <div className="flex-1 flex flex-col justify-center items-start max-w-[40%] space-y-6">
            {/* Hero Section */}
            <div>
              <h2 className="text-4xl font-bold mb-3 text-[#E9C46A]">Expand Your Catan Experience</h2>
              <p className="text-lg text-[#F4A261]">
                Play Catan with 5-6 players online. Build, trade, and compete in the most popular board game, now with more players!
              </p>
            </div>

            {/* Play Button */}
            <Button 
              size="lg" 
              className="bg-[#E76F51] hover:bg-[#E76F51]/90 text-white px-10 py-5 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link to="/lobby">Play Now</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#153542]/90 border-t border-[#00BFAE]/20 py-3">
        <div className="container mx-auto px-4 text-center text-[#F4A261] text-sm">
          <p>© 2024 5-6 Player Catan. This is a fan-made project.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home 