import type { PostgrestError } from '@supabase/supabase-js'
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      songs: {
        Row: {
          comment_count: number
          display_name: string
          genre: string | null
          id: number
          modified_name: string
          original_name: string
          song_url: string | null
          user_id: string
        }
        Insert: {
          comment_count?: number
          display_name: string
          genre?: string | null
          id?: number
          modified_name: string
          original_name: string
          song_url?: string | null
          user_id?: string
        }
        Update: {
          comment_count?: number
          display_name?: string
          genre?: string | null
          id?: number
          modified_name?: string
          original_name?: string
          song_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'songs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['auth_id']
          }
        ]
      }
      songs_comments: {
        Row: {
          comment: string
          created_at: string
          id: number
          song_id: number
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: number
          song_id: number
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: number
          song_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'songs_comments_song_id_fkey'
            columns: ['song_id']
            isOneToOne: false
            referencedRelation: 'songs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'songs_comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['auth_id']
          }
        ]
      }
      users: {
        Row: {
          age: number
          auth_id: string
          country: string
          created_at: string
          email: string
          id: number
          name: string
        }
        Insert: {
          age: number
          auth_id?: string
          country?: string
          created_at?: string
          email: string
          id?: number
          name: string
        }
        Update: {
          age?: number
          auth_id?: string
          country?: string
          created_at?: string
          email?: string
          id?: number
          name?: string
        }
        Relationships: []
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
