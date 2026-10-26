import type { Escrito } from "@/lib/escritos";
import {
  contacto as contactoDaBase,
  escritosPublicados,
  ligacoesDe,
  projetosPublicados,
  redesDe,
} from "@/lib/painel/conteudo-db";
import type { Preparacao } from "@/lib/projetos";
import type { Rede } from "@/lib/redes";

/**
 * A porta de entrada do conteúdo.
 *
 * Esteve aqui a leitura dos ficheiros em `content/`, que uma ferramenta à parte
 * escrevia no GitHub. Agora o conteúdo vive na base de dados e edita-se no
 * próprio painel -- os ficheiros ficaram como semente da primeira importação,
 * e `lib/painel/conteudo-db.ts` é quem fala com a base.
 *
 * Isto continua a ser a porta: os componentes importam daqui e não sabem de
 * onde vem. Foi o que permitiu trocar a origem sem mexer no desenho de nada.
 *
 * O que mudou para quem chama: as funções passaram a ser assíncronas. E as
 * páginas que mostram conteúdo têm de ser dinâmicas -- sem isso, o Next lia a
 * base uma vez na construção e congelava o resultado, e gravar no painel não
 * mudava nada no sítio.
 */

export type Onde = "rodape" | "menu" | "investigo" | "escrevo";

export type Ligacao = {
  nome: string;
  endereco: string;
  onde: Onde[];
  activa: boolean;
};

export function lerProjetos(): Promise<Preparacao[]> {
  return projetosPublicados();
}

export function lerEscritos(): Promise<Escrito[]> {
  return escritosPublicados();
}

export function lerLigacoes(onde?: Onde): Promise<Ligacao[]> {
  return ligacoesDe(onde);
}

/**
 * As ligações do rodapé e do menu, na forma que esses componentes já usavam.
 * Uma ligação desligada no painel desaparece da lista em vez de aparecer como
 * texto que não leva a lado nenhum.
 */
export function lerRedes(onde: Onde = "rodape"): Promise<Rede[]> {
  return redesDe(onde);
}

/**
 * O contacto. Se a base ainda não tiver o registo -- antes da primeira
 * importação --, fica o endereço que esteve sempre no sítio, para as páginas
 * legais nunca ficarem sem o contacto que o RGPD obriga a ter.
 */
export async function lerContacto() {
  return (await contactoDaBase()) ?? { email: "jcm@linear.com.pt" };
}
