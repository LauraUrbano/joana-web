-- O conteúdo do sítio, que até aqui vivia em ficheiros dentro do repositório.
--
-- Porque mudou: o painel antigo eram dois passos -- a nossa entrada, e depois
-- uma ferramenta à parte que pedia uma chave do GitHub para escrever os
-- ficheiros. Dois passos a mais. Com o conteúdo aqui, entra-se e editam-se as
-- coisas na mesma página, sem chave nenhuma.
--
-- O que se perde, dito com todas as letras: o histórico do git por alteração.
-- Em troca fica o `actualizado_por`/`actualizado_em` de cada linha, e o Neon
-- guarda a base de dados inteira numa janela de recuperação -- dá para voltar
-- a um instante anterior se alguém apagar o que não devia.
--
-- Os ficheiros em `content/` ficam como semente: a primeira importação lê-os,
-- e a partir daí a verdade é esta.
--
-- Correr com: npm run painel:migrar

create table if not exists conteudo_projetos (
  slug text primary key,
  titulo text not null,
  tipo text not null default '',
  ano text,
  descricao text,
  -- A capa é quadrada e é a que vai à órbita da home. As medidas ficam
  -- gravadas: antes mediam-se os bytes da imagem a cada construção, e isso só
  -- funciona para ficheiros dentro do repositório. Medidas na linha servem
  -- também para as que venham do armazenamento de objetos.
  capa text,
  capa_w integer,
  capa_h integer,
  imagens jsonb not null default '[]'::jsonb,
  -- [{ src, poster, w, h }]
  videos jsonb not null default '[]'::jsonb,
  na_home boolean not null default false,
  ordem integer not null default 99,
  estado text not null default 'publicado'
    check (estado in ('rascunho', 'publicado')),
  actualizado_em timestamptz not null default now(),
  actualizado_por text
);

create table if not exists conteudo_escritos (
  slug text primary key,
  titulo text not null,
  familia text not null default 'Artigo de opinião'
    check (familia in ('Artigo de opinião', 'Texto original', 'Paper')),
  data date not null,
  resumo text not null default '',
  imagem text,
  -- Onde saiu, quando não foi aqui. Com `endereco_externo`, o cartão aponta
  -- para fora; sem ele, para a página do artigo neste sítio.
  publicado text,
  endereco_externo text,
  corpo text,
  estado text not null default 'publicado'
    check (estado in ('rascunho', 'publicado')),
  actualizado_em timestamptz not null default now(),
  actualizado_por text
);

create table if not exists conteudo_ligacoes (
  id bigint generated always as identity primary key,
  nome text not null,
  endereco text not null,
  -- Onde aparece: rodape, menu, investigo, escrevo. Uma ligação pode estar em
  -- mais do que um sítio.
  onde jsonb not null default '[]'::jsonb,
  activa boolean not null default true,
  ordem integer not null default 0,
  actualizado_em timestamptz not null default now(),
  actualizado_por text
);

-- Um registo só: há um email e um telefone, não vários. O `check` garante-o.
create table if not exists conteudo_contacto (
  id integer primary key default 1 check (id = 1),
  email text not null,
  telefone text,
  actualizado_em timestamptz not null default now(),
  actualizado_por text
);
