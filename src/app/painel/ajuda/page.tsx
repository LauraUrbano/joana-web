import { redirect } from "next/navigation";

import { Cabeca } from "@/components/painel/campos";

import { podeEntrar } from "@/lib/painel/dados";
import { ambiente, login } from "@/lib/painel/neon";

/**
 * O guia, dentro do painel e não num documento à parte.
 *
 * Um guia que vive noutro sítio envelhece sozinho: muda-se o painel e ninguém
 * se lembra do PDF. Aqui está ao lado do que descreve, e quem está a editar
 * tem-no a um clique.
 *
 * Fica atrás da sessão como o resto -- não por ser segredo, mas porque uma
 * página pública a explicar onde se guarda a chave do repositório é um convite
 * a quem anda à procura.
 */
export const dynamic = "force-dynamic";

export default async function Ajuda() {
  const amb = ambiente();
  if (!amb.pronto) redirect("/painel/entrar");
  const auth = await login();
  const { data: sessao } = (await auth!.getSession()) ?? { data: null };
  if (!sessao?.user || !(await podeEntrar(sessao.user.email))) {
    redirect("/painel/entrar");
  }

  return (
    <>
      <Cabeca
        titulo="Como se edita o site"
        nota="O que se pode mudar, onde, e o que correr mal quer dizer."
      />

      <P>
        Tudo se edita aqui dentro. Entras em{" "}
        <A href="https://www.joanadominguesdesign.pt/painel">
          joanadominguesdesign.pt/painel
        </A>{" "}
        com o teu email e a tua palavra-passe, e a página que abre já é o
        conteúdo. Gravar escreve no sítio: a alteração aparece na visita
        seguinte.
      </P>

      <H>O que se pode mudar</H>
      <P>
        Quatro coisas: os <B>projetos</B>, os <B>textos do blog</B>, as{" "}
        <B>ligações externas</B> (LinkedIn, Substack, ORCID…) e as{" "}
        <B>informações de contacto</B>.
      </P>
      <P>
        Os textos do desenho — a bio, os campos do &quot;Designer&quot;, as
        linhas dos percursos, as frases de entrada — não estão aqui de
        propósito: vêm do ficheiro do Figma e mudam-se a pedido, para o desenho
        não se desalinhar sem ninguém ver.
      </P>

      <H>Nada se perde de repente</H>
      <P>
        Cada linha guarda quem a mudou e quando. E a base de dados inteira tem
        uma janela de recuperação: se alguma coisa for apagada por engano,
        volta-se atrás no tempo. Não é o mesmo que desfazer alteração a
        alteração — para isso avisa, e trata-se.
      </P>
      <P>
        Em dúvida, grava como <B>rascunho</B>: fica guardado, não aparece no
        sítio, e publica-se quando estiver bom.
      </P>

      <H>Acrescentar ou mudar um projeto</H>
      <P>
        Na lista de projetos, carrega no nome para mudar, ou em{" "}
        <B>Novo projeto</B>. No fim, <B>Guardar</B>.
      </P>
      <Tabela
        cabecalho={["Campo", "O que lá vai"]}
        linhas={[
          ["Título", "“Authentic Studio Pilates”"],
          [
            "Endereço",
            "A parte final do link da página. Num projeto que já está no ar, não se muda — parte as ligações que andem por aí",
          ],
          ["Tipo", "“Marca · Identidade visual”. Sai no cartão, em maiúsculas"],
          ["Ano", "2024"],
          ["Descrição", "Um a três parágrafos"],
          [
            "Capa",
            "O caminho da imagem quadrada. É a que vai à órbita da home e à tira do telemóvel",
          ],
          ["Imagens da página", "Um caminho por linha, pela ordem em que aparecem"],
          [
            "Vídeos",
            "Um por linha: o MP4, uma barra vertical, e o cartaz. Sem cartaz fica um rectângulo preto a carregar",
          ],
          ["Ordem", "A ordem na home, do menor para o maior. Não é a data"],
          ["Aparece na home", "Se entra na órbita e na tira do telemóvel"],
          ["Estado", "Rascunho não aparece em lado nenhum, nem no Google"],
        ]}
      />
      <P>
        <B>As imagens, por agora, são caminhos</B> — as que já lá estão vivem no
        próprio sítio e foram convertidas à mão. Carregar ficheiros novos a
        partir daqui é o passo seguinte; até lá, manda-as à Laura, que as
        converte e te diz o caminho. Há uma razão para isso e não é preguiça:
        uma fotografia da câmara pesa 8 MB e faz o site demorar segundos a abrir
        no telemóvel — uma página de projeto inteira, hoje, pesa menos do que
        isso.
      </P>

      <H>Escrever no blog</H>
      <P>
        A lista pública é a página{" "}
        <A href="https://www.joanadominguesdesign.pt/escrita">/escrita</A>. Há
        dois tipos de texto, e a diferença conta:
      </P>
      <Lista>
        <li>
          <B>Um texto que vive aqui</B> — escreve-se o corpo no campo{" "}
          <I>Corpo</I> e o cartão abre uma página do próprio site. É o único que
          trabalha o teu SEO: o Google dá o crédito ao domínio onde o texto
          está.
        </li>
        <li>
          <B>Um texto publicado noutro sítio</B>, como o do Marketeer —
          preenche-se <I>Publicado em</I> e <I>Endereço externo</I>, deixa-se o
          corpo vazio, e o cartão aponta para fora. Vale pelo crédito, não pela
          busca.
        </li>
      </Lista>
      <P>
        O <B>resumo de duas linhas</B> não é enfeite: é o que sai no cartão e é
        a descrição que o Google mostra.
      </P>
      <P>
        Um texto só se publica com corpo ou com endereço externo — sem um dos
        dois, o cartão não levaria a lado nenhum. Enquanto escreves, grava como
        rascunho: aí não é exigido nada e não se perde o que já está escrito.
      </P>

      <H>Ligações e contactos</H>
      <P>
        Estão no fim da página do conteúdo. Para esconder uma ligação, desliga
        o <I>Activa</I> e grava — não é preciso apagá-la.
      </P>
      <P>
        O email aparece em <B>cinco sítios</B> do site e o telefone em três. Nas
        páginas legais não é decoração: é o contacto do responsável pelo
        tratamento de dados, que o RGPD obriga a estar lá e a estar certo.
        Trocar sim; apagar sem pôr outro, o painel recusa.
      </P>

      <H>Se alguma coisa correr mal</H>
      <Tabela
        cabecalho={["O que acontece", "O que fazer"]}
        linhas={[
          [
            "Gravei e o site não mudou",
            "Recarregar com Ctrl+Shift+R (ou Cmd+Shift+R). Se o estado for rascunho, é isso: rascunho não aparece",
          ],
          [
            "Diz que não consegue gravar",
            "Avisa a Laura: é a base de dados a não responder, e vê-se do lado dela",
          ],
          ["Pede-me para entrar outra vez", "Normal. A sessão caducou"],
          [
            "Apaguei uma coisa sem querer",
            "Não mexer em mais nada e avisar. Está no histórico e volta como estava",
          ],
          [
            "A imagem ficou esticada",
            "A proporção não é a pedida: capa de projeto quadrada, imagem de texto 3:2",
          ],
          [
            "Escrevi e perdi o que tinha escrito",
            "Grava como rascunho primeiro. Um rascunho aceita tudo e guarda; a publicação é que exige",
          ],
          [
            "O site ficou lento no telemóvel",
            "Quase sempre uma imagem pesada que acabou de entrar. Acima de 1 MB já é muito",
          ],
        ]}
      />
      <P>
        Em dúvida, não há mal em experimentar: grava-se em rascunho, vê-se, e só
        se publica depois.
      </P>
    </>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 border-t border-clay/40 pt-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 font-body text-[1.05rem]">{children}</p>;
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold">{children}</strong>;
}

function I({ children }: { children: React.ReactNode }) {
  return <em>{children}</em>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="border-b border-clay/60 hover:opacity-70">
      {children}
    </a>
  );
}

function Lista({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-4 flex list-disc flex-col gap-3 pl-5 font-body text-[1.05rem]">
      {children}
    </ul>
  );
}

function Tabela({
  cabecalho,
  linhas,
}: {
  cabecalho: [string, string];
  linhas: [string, string][];
}) {
  return (
    <table className="mt-5 w-full border-collapse text-left font-body text-[1rem]">
      <thead>
        <tr>
          {cabecalho.map((c) => (
            <th
              key={c}
              className="border-b border-clay/40 pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.map(([a, b]) => (
          <tr key={a}>
            <td className="border-b border-clay/20 py-2.5 pr-4 align-top font-semibold">
              {a}
            </td>
            <td className="border-b border-clay/20 py-2.5 align-top">{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
