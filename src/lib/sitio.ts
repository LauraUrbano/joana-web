/**
 * O endereço do sítio, para os endereços absolutos que os metadados precisam
 * (partilha, canónico, sitemap).
 *
 * Vem do ambiente e não está escrito aqui à mão porque o sítio ainda vive em
 * joana-web.vercel.app e vai passar para o domínio dela: assim a mudança é uma
 * variável de ambiente e não uma alteração de código.
 *
 *   NEXT_PUBLIC_SITE_URL              o que mandar, se estiver definido
 *   VERCEL_PROJECT_PRODUCTION_URL     o domínio de produção, que a Vercel dá
 *   localhost                         em desenvolvimento
 *
 * Quando o domínio dela estiver pronto: definir NEXT_PUBLIC_SITE_URL como
 * https://joanadomingues.pt nas variáveis do projeto na Vercel.
 */
export const SITIO =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
