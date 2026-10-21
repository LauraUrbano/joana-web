import type { Metadata } from "next";

import PaginaLegal, { Acto } from "@/components/pagina-legal";
import { EMAIL, EMAIL_HREF } from "@/lib/contacto";

export const metadata: Metadata = {
  title: "Política de Privacidade — Joana Domingues Design",
  description:
    "Que dados este sítio trata, porquê, durante quanto tempo e que direitos tem quem o visita.",
  alternates: { canonical: "/politica-de-privacidade" },
};

/**
 * A política de privacidade.
 *
 * Escrita a partir do que medi no sítio publicado, não de um modelo: abri as
 * duas páginas num browser limpo e registei todos os pedidos de rede, os
 * cookies e o armazenamento. Resultado: só contacta o próprio domínio, não põe
 * um único cookie e não escreve nada no localStorage nem no sessionStorage.
 * Os tipos de letra vêm do Google Fonts mas são descarregados na compilação e
 * servidos por este sítio, por isso o browser de quem visita nunca fala com o
 * Google -- é a diferença que a maior parte das políticas copiadas erra.
 *
 * Se algum dia entrar análise de tráfego, um formulário ou um vídeo
 * incorporado, esta página tem de ser revista no mesmo dia.
 */
export default function PoliticaDePrivacidade() {
  return (
    <PaginaLegal
      titulo="Política de Privacidade"
      atualizado="16 de outubro de 2026"
    >
      <Acto titulo="Em duas linhas">
        <p>
          Este sítio não usa cookies, não tem análise de tráfego, não tem
          formulários e não incorpora nada de redes sociais. A única coisa que
          se trata são os registos técnicos que qualquer servidor web guarda, e
          aquilo que nos escrever se decidir escrever.
        </p>
      </Acto>

      <Acto titulo="Quem trata os dados">
        <p>
          <strong>Joana Domingues</strong>, designer de comunicação, a partir
          de Portugal. Para qualquer questão sobre esta política ou sobre os
          seus dados:{" "}
          <a
            href={EMAIL_HREF}
            className="border-b border-clay/60 transition-opacity hover:opacity-60"
          >
            {EMAIL}
          </a>
          .
        </p>
      </Acto>

      <Acto titulo="O que este sítio não faz">
        <p>
          Não põe cookies, de nenhum tipo — nem técnicos, nem de medição, nem
          de publicidade. Não usa Google Analytics nem nenhuma outra ferramenta
          de estatísticas. Não tem formulários nem conta de utilizador. Não
          tem botões de partilha, vídeos incorporados nem mapas.
        </p>
        <p>
          Os tipos de letra são do Google Fonts, mas são descarregados quando o
          sítio é compilado e servidos a partir deste mesmo domínio: o seu
          browser não faz nenhum pedido ao Google para os ir buscar.
        </p>
      </Acto>

      <Acto titulo="Registos do servidor">
        <p>
          O sítio está alojado na Vercel. Como qualquer servidor web, a Vercel
          regista os pedidos que recebe: endereço IP, data e hora, página
          pedida, código de resposta e identificação do browser. Isto não é
          usado para o identificar nem para construir perfis — serve para o
          sítio funcionar, para o manter seguro e para perceber avarias.
        </p>
        <p>
          Fundamento: o interesse legítimo em manter o serviço a funcionar e
          protegido, nos termos da alínea f) do n.º 1 do artigo 6.º do
          Regulamento Geral sobre a Proteção de Dados. Estes registos são
          conservados pela Vercel durante o prazo definido nas políticas dela e
          depois eliminados.
        </p>
      </Acto>

      <Acto titulo="Se nos escrever">
        <p>
          Se enviar um e-mail ou uma mensagem de WhatsApp, os dados que
          escrever — nome, contacto e o conteúdo da mensagem — são usados
          apenas para lhe responder e, se daí vier trabalho, para o tratar.
          Não são usados para mais nada nem passados a terceiros.
        </p>
        <p>
          Fundamento: as diligências pré-contratuais que pediu, nos termos da
          alínea b) do n.º 1 do artigo 6.º. A correspondência é conservada
          enquanto durar a relação e, depois, pelo prazo legal aplicável.
        </p>
      </Acto>

      <Acto titulo="Quem mais lhes toca">
        <p>
          A Vercel Inc., que aloja o sítio, enquanto subcontratante. Pode
          tratar dados fora da União Europeia, nomeadamente nos Estados Unidos,
          ao abrigo das salvaguardas previstas no Regulamento — cláusulas
          contratuais-tipo e o quadro de privacidade de dados entre a UE e os
          Estados Unidos.
        </p>
        <p>
          Se escrever por e-mail ou WhatsApp, o fornecedor desse serviço trata
          a mensagem segundo as regras dele, que não dependem deste sítio.
        </p>
      </Acto>

      <Acto titulo="Os seus direitos">
        <p>
          Pode pedir o acesso aos seus dados, a correcção do que esteja errado,
          o apagamento, a limitação do tratamento, a portabilidade, e pode
          opor-se ao tratamento feito com base em interesse legítimo. Basta
          escrever para{" "}
          <a
            href={EMAIL_HREF}
            className="border-b border-clay/60 transition-opacity hover:opacity-60"
          >
            {EMAIL}
          </a>
          .
        </p>
        <p>
          Se achar que os seus dados não estão a ser bem tratados, pode
          reclamar junto da Comissão Nacional de Proteção de Dados, em{" "}
          <a
            href="https://www.cnpd.pt"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-clay/60 transition-opacity hover:opacity-60"
          >
            cnpd.pt
          </a>
          .
        </p>
      </Acto>

      <Acto titulo="Alterações">
        <p>
          Se o sítio passar a usar medição de tráfego, formulários ou qualquer
          outra coisa que trate dados, esta página é actualizada antes disso. A
          data da última revisão está no fim.
        </p>
      </Acto>
    </PaginaLegal>
  );
}
