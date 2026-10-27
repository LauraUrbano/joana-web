-- As imagens carregadas pelo painel.
--
-- Porque ficam aqui e não num armazenamento de objetos: o bucket do Neon exige
-- quatro variáveis de ambiente no projeto da Vercel, e duas delas são
-- credenciais que não posso manusear daqui. Isso punha mais um passo manual
-- entre a Joana e uma fotografia nova -- que é exactamente o que esta mudança
-- toda serve para tirar do caminho.
--
-- Para um portfólio -- algumas dezenas de imagens, cada uma a rondar os 200 kB
-- depois de convertida -- a base de dados aguenta isto sem dar por ela, e tem
-- uma vantagem: uma cópia de segurança só, um restauro só. Se um dia forem
-- centenas, muda-se para o bucket; é uma função.
--
-- Os bytes vivem em base64 num campo de texto em vez de `bytea`: o driver HTTP
-- do Neon passa os parâmetros em JSON, e um Buffer não sobrevive à viagem.
--
-- Correr com: npm run painel:migrar

create table if not exists conteudo_imagens (
  id bigint generated always as identity primary key,
  -- A quem pertence: "projeto:carla-rocha", "escrito:ia-nao-substitui".
  -- Serve para listar as órfãs e para apagar com o dono.
  dono text not null,
  ficheiro text not null,
  tipo text not null default 'image/webp',
  largura integer,
  altura integer,
  bytes text not null,
  criado_em timestamptz not null default now(),
  criado_por text
);

create index if not exists conteudo_imagens_dono on conteudo_imagens (dono);
