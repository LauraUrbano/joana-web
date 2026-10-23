-- O que o painel precisa de guardar, que não são as contas.
--
-- As contas e as sessões são do Neon Auth e vivem no esquema `neon_auth`, que
-- não se mexe à mão. Aqui ficam só duas coisas nossas:
--
--   painel_pessoas    quem pode entrar. É a porta: uma conta criada com um
--                     email que não esteja nesta lista entra e não vê nada.
--                     Sem isto, qualquer pessoa se registava e recebia a chave
--                     do repositório.
--   painel_segredos   a chave do GitHub. Fica aqui em vez de numa variável de
--                     ambiente para que se possa trocar sem publicar outra vez
--                     e sem passar pela Vercel.
--
-- Correr com: npm run painel:migrar

create table if not exists painel_pessoas (
  email text primary key,
  nome text,
  acrescentado_em timestamptz not null default now(),
  acrescentado_por text
);

create table if not exists painel_segredos (
  nome text primary key,
  valor text not null,
  actualizado_em timestamptz not null default now(),
  actualizado_por text
);

-- A primeira pessoa, para haver por onde começar: sem uma entrada nesta tabela
-- ninguém passava da porta, nem para abrir a porta a outra pessoa.
insert into painel_pessoas (email, nome, acrescentado_por)
values ('lauraurbano30@gmail.com', 'Laura', 'migração inicial')
on conflict (email) do nothing;
