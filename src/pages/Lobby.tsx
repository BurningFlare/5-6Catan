import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import type { GameLobby, GameMode, GameMap, GameSpeed } from '@/types/lobby'
import { useNavigate } from 'react-router-dom'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore'

const GAME_MODES: GameMode[] = ['Base', 'Knights and Cities', 'Seafarers']
const GAME_MAPS: GameMap[] = ['Base', 'USA', 'Europe', 'Random']
const GAME_SPEEDS: GameSpeed[] = ['Slow', 'Normal', 'Fast']

// Remove initialLobbies and all mock data

const LobbyPage = () => {
  const [lobbies, setLobbies] = useState<GameLobby[]>([])
  const [selectedLobby, setSelectedLobby] = useState<GameLobby | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    mode: GAME_MODES[0],
    map: GAME_MAPS[0],
    speed: GAME_SPEEDS[1],
  })
  const navigate = useNavigate()

  // Real-time Firestore listener
  useEffect(() => {
    const q = query(collection(db, 'lobbies'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      setLobbies(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as GameLobby[]
      )
    })
    return () => unsub()
  }, [])

  const handleCreateLobby = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = auth.currentUser
    const hostName = user?.displayName || user?.email || 'Unknown Host'
    const playerInfo = user ? {
      uid: user.uid,
      name: user.displayName || user.email || 'Unknown',
      avatar: user.photoURL || '',
    } : null
    try {
      const docRef = await addDoc(collection(db, 'lobbies'), {
        name: form.name,
        mode: form.mode,
        map: form.map,
        speed: form.speed,
        playerCount: 1,
        maxPlayers: 6,
        host: hostName,
        players: playerInfo ? [playerInfo] : [],
        createdAt: serverTimestamp(),
      })
      setShowModal(false)
      setForm({ name: '', mode: GAME_MODES[0], map: GAME_MAPS[0], speed: GAME_SPEEDS[1] })
      navigate(`/lobby/${docRef.id}`)
    } catch (err) {
      alert('Failed to create lobby!')
    }
  }

  const handleJoinLobby = () => {
    if (selectedLobby) {
      navigate(`/lobby/${selectedLobby.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#153542] text-white flex flex-col bg-[url('/hexagon-pattern.png')] bg-repeat">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex gap-10 h-[calc(100vh-8rem)]">
          {/* Left side - Game List */}
          <div className="flex-[2] bg-[#00BFAE]/5 rounded-2xl backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="p-6 bg-[#00BFAE]/20">
              <h2 className="text-3xl font-bold text-[#E9C46A] flex items-center gap-2">
                <span className="text-2xl">🎲</span> Available Games
              </h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-5rem)] catan-scrollbar">
              {lobbies.length === 0 ? (
                <div className="text-center text-[#F4A261] py-12 text-lg">No lobbies available.</div>
              ) : (
                lobbies.map((lobby) => (
                  <button
                    key={lobby.id}
                    onClick={() => setSelectedLobby(lobby)}
                    className={`w-full p-6 flex flex-col gap-4 hover:bg-[#00BFAE]/10 transition-all duration-200 group cursor-pointer
                      ${selectedLobby?.id === lobby.id ? 'bg-[#00BFAE]/15' : 'bg-transparent'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-medium text-[#F4A261] group-hover:text-[#E9C46A] transition-colors">
                        {lobby.name}
                      </span>
                      <span className="text-sm text-[#E76F51] font-medium ml-4">
                        {(lobby.players?.length || 0)}/{lobby.maxPlayers} Players
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-[#F4A261]/70">
                      <span className="flex items-center gap-1">
                        🎲 {lobby.mode}
                      </span>
                      <span className="flex items-center gap-1">
                        🗺️ {lobby.map}
                      </span>
                      <span className="flex items-center gap-1">
                        ⚡ {lobby.speed}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right side - Selected Game Info and Create Lobby Button */}
          <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 flex flex-col">
              {selectedLobby ? (
                <div className="bg-[#00BFAE]/5 rounded-2xl backdrop-blur-md p-8 shadow-2xl">
                  <h3 className="text-3xl font-bold text-[#E9C46A] mb-2 flex items-center gap-2">
                    <span>🎮</span> {selectedLobby.name}
                  </h3>
                  <p className="text-[#F4A261]/70 mb-6">Hosted by {selectedLobby.host}</p>
                  <div className="space-y-6">
                    <div className="space-y-4 bg-[#00BFAE]/10 rounded-xl p-6">
                      <p className="flex justify-between items-center">
                        <span className="text-[#F4A261] flex items-center gap-2">
                          <span className="text-lg">🎲</span> Game Mode
                        </span>
                        <span className="text-white font-medium">{selectedLobby.mode}</span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="text-[#F4A261] flex items-center gap-2">
                          <span className="text-lg">🗺️</span> Map
                        </span>
                        <span className="text-white font-medium">{selectedLobby.map}</span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="text-[#F4A261] flex items-center gap-2">
                          <span className="text-lg">⚡</span> Speed
                        </span>
                        <span className="text-white font-medium">{selectedLobby.speed}</span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="text-[#F4A261] flex items-center gap-2">
                          <span className="text-lg">👥</span> Players
                        </span>
                        <span className="text-white font-medium">
                          {selectedLobby.playerCount}/{selectedLobby.maxPlayers}
                        </span>
                      </p>
                    </div>
                    <Button 
                      className="w-full bg-[#E76F51] hover:bg-[#E76F51]/90 text-white py-8 text-xl rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] font-bold"
                      onClick={handleJoinLobby}
                    >
                      Join Game 🎮
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#00BFAE]/5 rounded-2xl backdrop-blur-md p-8 text-center text-[#F4A261] shadow-2xl flex-1 flex flex-col items-center justify-center">
                  <span className="text-6xl mb-4 block">🎲</span>
                  <p className="text-xl">Select a game to see more details</p>
                </div>
              )}
            </div>
            {/* Create Lobby Button */}
            <div className="mt-8 flex justify-center">
              <Button
                className="bg-[#E76F51] hover:bg-[#E9C46A] text-[#153542] font-bold px-8 py-4 text-lg rounded-full shadow-md"
                onClick={() => setShowModal(true)}
              >
                + Create Lobby
              </Button>
            </div>
          </div>
        </div>
        {/* Modal Overlay */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <form
              onSubmit={handleCreateLobby}
              className="bg-[#153542] rounded-2xl p-8 shadow-2xl flex flex-col gap-6 min-w-[320px] w-full max-w-md border-2 border-[#00BFAE]"
            >
              <h2 className="text-2xl font-bold text-[#E9C46A] mb-2 text-center">Create a Lobby</h2>
              <label className="flex flex-col gap-1">
                <span className="text-[#F4A261] font-semibold">Lobby Name</span>
                <input
                  className="rounded px-3 py-2 bg-[#153542] text-white border border-[#00BFAE]/40 focus:outline-none focus:ring-2 focus:ring-[#00BFAE] placeholder:text-[#F4A261]/60"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  maxLength={32}
                  placeholder="Enter lobby name"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[#F4A261] font-semibold">Game Mode</span>
                <select
                  className="rounded px-3 py-2 bg-[#153542] text-white border border-[#00BFAE]/40 focus:outline-none focus:ring-2 focus:ring-[#00BFAE]"
                  value={form.mode}
                  onChange={e => setForm(f => ({ ...f, mode: e.target.value as GameMode }))}
                >
                  {GAME_MODES.map(mode => (
                    <option key={mode} value={mode} className="bg-[#153542] text-white">{mode}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[#F4A261] font-semibold">Map</span>
                <select
                  className="rounded px-3 py-2 bg-[#153542] text-white border border-[#00BFAE]/40 focus:outline-none focus:ring-2 focus:ring-[#00BFAE]"
                  value={form.map}
                  onChange={e => setForm(f => ({ ...f, map: e.target.value as GameMap }))}
                >
                  {GAME_MAPS.map(map => (
                    <option key={map} value={map} className="bg-[#153542] text-white">{map}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[#F4A261] font-semibold">Speed</span>
                <select
                  className="rounded px-3 py-2 bg-[#153542] text-white border border-[#00BFAE]/40 focus:outline-none focus:ring-2 focus:ring-[#00BFAE]"
                  value={form.speed}
                  onChange={e => setForm(f => ({ ...f, speed: e.target.value as GameSpeed }))}
                >
                  {GAME_SPEEDS.map(speed => (
                    <option key={speed} value={speed} className="bg-[#153542] text-white">{speed}</option>
                  ))}
                </select>
              </label>
              <div className="flex gap-4 mt-2">
                <Button
                  type="button"
                  className="flex-1 bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 rounded-full"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white font-bold py-2 rounded-full"
                >
                  Create Lobby
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default LobbyPage 