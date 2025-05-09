export type GameMode = 'Base' | 'Knights and Cities' | 'Seafarers'
export type GameMap = 'Base' | 'USA' | 'Europe' | 'Random'
export type GameSpeed = 'Slow' | 'Normal' | 'Fast'

export interface GameLobby {
  id: string
  name: string
  mode: GameMode
  map: GameMap
  speed: GameSpeed
  playerCount: number
  maxPlayers: number
  host: string
  createdAt: Date
  players?: any[]
} 