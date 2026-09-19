# Joana Domingues — Design Studio

Website do estúdio. Neste momento está online a **página temporária** ("website in progress"),
com fundo líquido animado em WebGL.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — base de dados, autenticação e storage *(a ligar)*
- **Vercel** — alojamento, com deploy automático a cada push para `main`

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run lint
```

## Estrutura

```
src/
  app/
    layout.tsx               # fontes, metadata, idioma
    page.tsx                 # página temporária
    globals.css              # tokens de cor da marca
  components/
    liquid-background.tsx    # fundo animado (WebGL, fbm + domain warping)
```

O fundo animado degrada com elegância: se o browser não tiver WebGL fica o gradiente CSS
por baixo, e com `prefers-reduced-motion: reduce` é desenhado um único fotograma estático.

## Deploy

Qualquer push para `main` publica automaticamente em produção no Vercel.

## Próximos passos

- [ ] Ligar o projeto Supabase (variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] Formulário de contacto gravado em base de dados
- [ ] Projetos/portfólio dinâmicos, com imagens em Supabase Storage
- [ ] Painel de administração com Supabase Auth
