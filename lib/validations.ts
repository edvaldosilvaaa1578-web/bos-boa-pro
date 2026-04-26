import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const colaboradorSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  setor: z.string().min(1, 'Setor é obrigatório'),
  cargo: z.string().min(1, 'Cargo é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  ativo: z.boolean().default(true),
})

export const registroSchema = z.object({
  tipo: z.enum(['BOS', 'BOA']),
  colaborador_id: z.string().min(1, 'Colaborador é obrigatório'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  data_ocorrencia: z.string().min(1, 'Data é obrigatória'),
  pontuacao: z.number().min(1).max(100),
  status: z.enum(['aberto', 'em_analise', 'encerrado']).default('aberto'),
  observacoes: z.string().optional(),
})

export const setorSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type ColaboradorFormData = z.infer<typeof colaboradorSchema>
export type RegistroFormData = z.infer<typeof registroSchema>
export type SetorFormData = z.infer<typeof setorSchema>
