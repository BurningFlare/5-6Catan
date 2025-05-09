import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import type { GameLobby } from '@/types/lobby'
import { db, auth } from '@/lib/firebase'
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore'

// Mock player data (replace with real player list later)


const LobbyRoom = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lobby, setLobby] = useState<GameLobby | null>(null)
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState<any[]>([])
  const [hostLeft, setHostLeft] = useState(false)
  const user = auth.currentUser
  const userInfo = user ? {
    uid: user.uid,
    name: user.displayName || user.email || 'Unknown',
    avatar: user.photoURL || '',
  } : null

  // Real-time lobby listener
  useEffect(() => {
    if (!id) return
    const ref = doc(db, 'lobbies', id)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setLobby({ id: snap.id, ...data } as GameLobby)
        setPlayers(Array.isArray(data.players) ? data.players : [])
        console.log('Players in lobby:', data.players)
      } else {
        setLobby(null)
        setHostLeft(true)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [id])

  // Join lobby on mount
  useEffect(() => {
    if (!id || !userInfo) return
    const ref = doc(db, 'lobbies', id)
    if (!players.find(p => p.uid === userInfo.uid)) {
      updateDoc(ref, {
        players: arrayUnion(userInfo),
      })
    }
  // eslint-disable-next-line
  }, [id, userInfo?.uid, players])

  // Leave lobby on unmount
  useEffect(() => {
    if (!id || !userInfo) return
    const ref = doc(db, 'lobbies', id)
    return () => {
      if (lobby && lobby.host === userInfo.name) {
        // If host, delete the lobby
        deleteDoc(ref)
      } else {
        // Otherwise, just remove from players
        updateDoc(ref, {
          players: arrayRemove(userInfo),
        })
      }
    }
  // eslint-disable-next-line
  }, [id, userInfo?.uid, lobby?.host])

  useEffect(() => {
    if (!loading && !lobby && !hostLeft) navigate('/lobby')
  }, [lobby, loading, navigate, hostLeft])

  if (loading) return (
    <div className="min-h-screen bg-[#153542] text-white flex flex-col items-center justify-center">
      <Header />
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#00BFAE] border-b-4 border-[#E9C46A] mx-auto" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#153542] text-white flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="bg-[#00BFAE]/10 rounded-2xl p-8 shadow-xl w-full max-w-2xl flex flex-col gap-8">
          {hostLeft ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-[#153542] rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-6 min-w-[320px] w-full max-w-md border-2 border-[#00BFAE]">
                <span className="text-5xl mb-2">😢</span>
                <h2 className="text-2xl font-bold text-[#E9C46A] mb-2 text-center">Host left the lobby</h2>
                <Button className="bg-[#E76F51] hover:bg-[#E76F51]/90 text-white font-bold py-2 rounded-full px-8" onClick={() => navigate('/lobby')}>Back to Lobby List</Button>
              </div>
            </div>
          ) : null}
          {lobby && (
            <>
              <div>
                <h2 className="text-3xl font-bold text-[#E9C46A] mb-2 flex items-center gap-2">
                  <span>🎮</span> {lobby.name}
                </h2>
                <p className="text-[#F4A261]/70 mb-4">Hosted by {lobby.host}</p>
                <div className="grid grid-cols-2 gap-4 bg-[#00BFAE]/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[#F4A261]">
                    <span className="text-lg">🎲</span> Game Mode:
                    <span className="text-white font-medium ml-1">{lobby.mode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#F4A261]">
                    <span className="text-lg">🗺️</span> Map:
                    <span className="text-white font-medium ml-1">{lobby.map}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#F4A261]">
                    <span className="text-lg">⚡</span> Speed:
                    <span className="text-white font-medium ml-1">{lobby.speed}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#F4A261]">
                    <span className="text-lg">👥</span> Players:
                    <span className="text-white font-medium ml-1">{players.length}/{lobby.maxPlayers}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#E9C46A] mb-4">Players in Lobby</h3>
                {(!Array.isArray(players) || players.length === 0) ? (
                  <div className="text-[#F4A261] text-center py-4">No players in lobby yet...</div>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {players.map(player => (
                      <li key={player.uid} className="flex items-center gap-3 bg-[#153542] rounded-lg px-4 py-2">
                        <span className="w-8 h-8 rounded-full bg-[#00BFAE] flex items-center justify-center text-lg font-bold text-[#153542]">
                          {player.avatar ? <img src={player.avatar} alt={player.name} className="w-8 h-8 rounded-full" /> : player.name[0]}
                        </span>
                        <span className="text-white font-medium">{player.name}</span>
                        {player.name === lobby.host && <span className="ml-2 text-[#E9C46A] text-xs font-bold">Host</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button className="w-full bg-[#E76F51] hover:bg-[#E76F51]/90 text-white py-4 text-lg rounded-xl shadow-lg font-bold mt-2" onClick={() => navigate('/lobby')}>Leave Lobby</Button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default LobbyRoom 