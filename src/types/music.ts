export type Song = {
  comment_count: number
  display_name: string
  genre: string | null
  id: number
  modified_name: string
  original_name: string
  song_url: string | null
  user_id: string
}

export type SongUpdates = {
  modified_name: string
  genre: string | null
}

export type SongComment = {
  comment: string
  created_at: string
  id: number
  song_id: number
  user_id: string
  users: {
    name: string
  } | null
}
