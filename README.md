# Gestão BOS/BOA Pro

Sistema SaaS para gestão de Boletins de Ocorrência de Segurança (BOS) e Boletins de Ocorrência Administrativa (BOA).

## Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (banco de dados + autenticação)
- **Recharts** (gráficos)
- **React Hook Form + Zod** (formulários e validação)

## Funcionalidades

- Autenticação via Supabase Auth
- Dashboard com KPIs e gráficos em tempo real
- Gestão de colaboradores (CRUD completo)
- Registro de ocorrências BOS e BOA
- Ranking de colaboradores por pontuação
- Relatórios com gráficos por período, categoria e setor
- Configuração de setores e categorias personalizadas

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
3. Copie as credenciais do projeto

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 4. Rodar o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Páginas

| Rota | Descrição |
|------|-----------|
| `/login` | Autenticação |
| `/dashboard` | Visão geral com KPIs e gráficos |
| `/colaboradores` | CRUD de colaboradores |
| `/registros` | CRUD de registros BOS/BOA |
| `/ranking` | Ranking de colaboradores |
| `/relatorios` | Relatórios com gráficos |
| `/configuracoes` | Setores e categorias |

## Como funciona a pontuação

- **BOS** subtrai pontos do colaborador (ocorrência negativa)
- **BOA** adiciona pontos ao colaborador (ocorrência positiva)
- O ranking é calculado com base em registros com status **Encerrado**

## Deploy

O projeto pode ser deployado no Vercel:

```bash
npx vercel
```

Configure as variáveis de ambiente no painel do Vercel.
