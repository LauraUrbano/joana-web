/**
 * Aplica db/painel.sql à base de dados que o DATABASE_URL apontar.
 *
 * O ficheiro é feito para correr duas vezes sem fazer mal (`if not exists`,
 * `on conflict do nothing`), por isso isto não é um sistema de migrações: é um
 * comando que se repete à vontade.
 *
 *   npm run painel:migrar
 *
 * As variáveis vêm do .env.local que o `neon deploy` escreve.
 */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const ligacao = process.env.DATABASE_URL;
if (!ligacao) {
  console.error(
    "Falta o DATABASE_URL. Corre `neon deploy` (ou `neon env pull`) primeiro."
  );
  process.exit(1);
}

const sql = neon(ligacao);
const texto = readFileSync(new URL("../db/painel.sql", import.meta.url), "utf8");

// O driver HTTP manda uma instrução por pedido, por isso o ficheiro é partido
// aos pontos e vírgulas. Nenhuma destas instruções tem `;` lá dentro.
const instrucoes = texto
  .split(/;\s*$/m)
  .map((i) => i.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);

for (const instrucao of instrucoes) {
  const nome = instrucao.split("\n")[0].slice(0, 60);
  await sql.query(instrucao);
  console.log(`ok  ${nome}`);
}

const [{ quantas }] = await sql.query(
  "select count(*)::int as quantas from painel_pessoas"
);
console.log(`\nTabelas prontas. Pessoas com entrada: ${quantas}.`);
