/**
 * A palavra-passe do painel, guardada como impressão digital.
 *
 * Isto é o resultado de passar a palavra-passe por um scrypt -- uma conta que
 * só anda para a frente. Dá para confirmar se uma palavra-passe está certa;
 * não dá para a descobrir a partir daqui. Por isso pode viver no repositório
 * sem ser um segredo exposto, e é o que permite ter uma variável a menos para
 * configurar na Vercel.
 *
 * Para trocar a palavra-passe sem mexer no código, põe-se `PAINEL_SENHA` nas
 * variáveis de ambiente: quando existe, é essa que manda.
 *
 * Formato: scrypt:<sal em hexadecimal>:<impressão em hexadecimal>, com os
 * parâmetros que o Node usa por omissão (N=16384, r=8, p=1, 32 bytes).
 */
export const SENHA_IMPRESSAO =
  "scrypt:54ccfa2a1ad36d8d4dbd379155d37ff5:0d2752f4b9e8a0ee81801873f916d1195873611996c566856ac13e9b74c8763e";
