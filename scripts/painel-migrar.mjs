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
import { readFileSync, readdirSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const ligacao = process.env.DATABASE_URL;
if (!ligacao) {
  console.error(
    "Falta o DATABASE_URL. Corre `neon deploy` (ou `neon env pull`) primeiro."
  );
  process.exit(1);
}

const sql = neon(ligacao);
const pasta = new URL("../db/", import.meta.url);

for (const ficheiro of readdirSync(pasta).filter((f) => f.endsWith(".sql")).sort()) {
  const texto = readFileSync(new URL(ficheiro, pasta), "utf8");

  // O driver HTTP manda uma instrução por pedido, por isso o ficheiro é partido
  // aos pontos e vírgulas. Nenhuma destas instruções tem `;` lá dentro.
  const instrucoes = texto
    .split(/;\s*$/m)
    .map((i) => i.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);

  console.log(`\n${ficheiro}`);
  for (const instrucao of instrucoes) {
    await sql.query(instrucao);
    console.log(`  ok  ${instrucao.split("\n")[0].slice(0, 58)}`);
  }
}

const contas = async (tabela) =>
  (await sql.query(`select count(*)::int as quantas from ${tabela}`))[0].quantas;

console.log("\nTabelas prontas.");
for (const t of [
  "painel_pessoas",
  "conteudo_projetos",
  "conteudo_escritos",
  "conteudo_ligacoes",
  "conteudo_contacto",
]) {
  console.log(`  ${t.padEnd(20)} ${await contas(t)} linhas`);
}
