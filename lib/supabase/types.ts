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
      colaboradores: {
        Row: {
          id: string
          nome: string
          matricula: string
          setor: string
          cargo: string
          email: string | null
          telefone: string | null
          ativo: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          nome: string
          matricula: string
          setor: string
          cargo: string
          email?: string | null
          telefone?: string | null
          ativo?: boolean
          user_id: string
        }
        Update: {
          nome?: string
          matricula?: string
          setor?: string
          cargo?: string
          email?: string | null
          telefone?: string | null
          ativo?: boolean
          updated_at?: string
          user_id?: string
        }
      }
      registros: {
        Row: {
          id: string
          tipo: 'BOS' | 'BOA'
          colaborador_id: string
          descricao: string
          categoria: string
          data_ocorrencia: string
          pontuacao: number
          status: 'aberto' | 'em_analise' | 'encerrado'
          observacoes: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          tipo: 'BOS' | 'BOA'
          colaborador_id: string
          descricao: string
          categoria: string
          data_ocorrencia: string
          pontuacao: number
          status?: 'aberto' | 'em_analise' | 'encerrado'
          observacoes?: string | null
          user_id: string
        }
        Update: {
          tipo?: 'BOS' | 'BOA'
          colaborador_id?: string
          descricao?: string
          categoria?: string
          data_ocorrencia?: string
          pontuacao?: number
          status?: 'aberto' | 'em_analise' | 'encerrado'
          observacoes?: string | null
          updated_at?: string
          user_id?: string
        }
      }
      categorias: {
        Row: {
          id: string
          nome: string
          tipo: 'BOS' | 'BOA'
          pontuacao_padrao: number
          descricao: string | null
          created_at: string
        }
        Insert: {
          nome: string
          tipo: 'BOS' | 'BOA'
          pontuacao_padrao?: number
          descricao?: string | null
        }
        Update: {
          nome?: string
          tipo?: 'BOS' | 'BOA'
          pontuacao_padrao?: number
          descricao?: string | null
        }
      }
      setores: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          nome: string
          descricao?: string | null
          user_id: string
        }
        Update: {
          nome?: string
          descricao?: string | null
          user_id?: string
        }
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
  }
}
