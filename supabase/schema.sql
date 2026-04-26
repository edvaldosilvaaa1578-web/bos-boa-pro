-- Gestão BOS/BOA Pro - Schema SQL
-- Execute este arquivo no SQL Editor do Supabase

-- Habilitar RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Tabela: setores
create table if not exists public.setores (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null
);

alter table public.setores enable row level security;

create policy "Users can manage their own setores"
  on public.setores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Tabela: colaboradores
create table if not exists public.colaboradores (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  matricula text not null,
  setor text not null,
  cargo text not null,
  email text,
  telefone text,
  ativo boolean default true not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.colaboradores enable row level security;

create policy "Users can manage their own colaboradores"
  on public.colaboradores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Tabela: categorias
create table if not exists public.categorias (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  tipo text check (tipo in ('BOS', 'BOA')) not null,
  pontuacao_padrao integer default 10 not null,
  descricao text,
  created_at timestamptz default now() not null
);

alter table public.categorias enable row level security;

create policy "Anyone authenticated can read categorias"
  on public.categorias for select
  to authenticated
  using (true);

create policy "Authenticated users can manage categorias"
  on public.categorias for insert update delete
  to authenticated
  using (true)
  with check (true);

-- Tabela: registros
create table if not exists public.registros (
  id uuid default gen_random_uuid() primary key,
  tipo text check (tipo in ('BOS', 'BOA')) not null,
  colaborador_id uuid references public.colaboradores(id) on delete cascade not null,
  descricao text not null,
  categoria text not null,
  data_ocorrencia date not null,
  pontuacao integer default 10 not null,
  status text check (status in ('aberto', 'em_analise', 'encerrado')) default 'aberto' not null,
  observacoes text,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.registros enable row level security;

create policy "Users can manage their own registros"
  on public.registros for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_colaboradores
  before update on public.colaboradores
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_registros
  before update on public.registros
  for each row execute procedure public.handle_updated_at();

-- Dados iniciais: categorias padrão
insert into public.categorias (nome, tipo, pontuacao_padrao, descricao) values
  ('Acidente de Trabalho', 'BOS', 30, 'Lesão com ou sem afastamento'),
  ('Quase Acidente', 'BOS', 15, 'Situação que poderia causar acidente'),
  ('Ato Inseguro', 'BOS', 20, 'Comportamento que gera risco'),
  ('Condição Insegura', 'BOS', 15, 'Ambiente ou equipamento em condição de risco'),
  ('Não Uso de EPI', 'BOS', 10, 'Ausência de equipamento de proteção individual'),
  ('Violação de Procedimento', 'BOS', 20, 'Descumprimento de norma ou procedimento'),
  ('Bom Desempenho', 'BOA', 20, 'Reconhecimento de trabalho exemplar'),
  ('Sugestão Implementada', 'BOA', 15, 'Ideia de melhoria aceita e aplicada'),
  ('Trabalho em Equipe', 'BOA', 10, 'Colaboração e apoio ao time'),
  ('Proatividade', 'BOA', 15, 'Antecipação de problemas ou necessidades'),
  ('Segurança Exemplar', 'BOA', 25, 'Atitude exemplar em segurança do trabalho')
on conflict do nothing;

-- Índices para performance
create index if not exists idx_registros_colaborador on public.registros(colaborador_id);
create index if not exists idx_registros_tipo on public.registros(tipo);
create index if not exists idx_registros_status on public.registros(status);
create index if not exists idx_registros_data on public.registros(data_ocorrencia);
create index if not exists idx_colaboradores_ativo on public.colaboradores(ativo);
