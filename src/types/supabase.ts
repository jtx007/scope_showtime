export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      showtimes: {
        Row: {
          id: string
          theater_name: string
          movie_title: string
          auditorium: string
          start_time: string
          end_time: string
          language: string
          format: string
          rating: string
          last_updated: string
          archived_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          theater_name: string
          movie_title: string
          auditorium: string
          start_time: string
          end_time: string
          language?: string
          format?: string
          rating?: string
          last_updated?: string
          archived_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          theater_name?: string
          movie_title?: string
          auditorium?: string
          start_time?: string
          end_time?: string
          language?: string
          format?: string
          rating?: string
          last_updated?: string
          archived_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
        Relationships: []
      }
    }
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [key: string]: string
    }
  }
}
