import type { PostgrestError } from '@supabase/supabase-js'
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      songs: {
        Row: {
          comment_count: number | null
          display_name: string
          genre: string | null
          id: number
          modified_name: string
          original_name: string
          user_id: string
        }
        Insert: {
          comment_count?: number | null
          display_name: string
          genre?: string | null
          id?: number
          modified_name: string
          original_name: string
          user_id?: string
        }
        Update: {
          comment_count?: number | null
          display_name?: string
          genre?: string | null
          id?: number
          modified_name?: string
          original_name?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          age: number
          country: string
          created_at: string
          email: string
          id: number
          name: string
          song_id: number | null
        }
        Insert: {
          age: number
          country?: string
          created_at?: string
          email: string
          id?: number
          name: string
          song_id?: number | null
        }
        Update: {
          age?: number
          country?: string
          created_at?: string
          email?: string
          id?: number
          name?: string
          song_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_song_id_fkey'
            columns: ['song_id']
            isOneToOne: false
            referencedRelation: 'songs'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = PostgrestError
