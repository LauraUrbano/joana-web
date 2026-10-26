import Link from "next/link";
import { redirect } from "next/navigation";

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
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-[2rem] leading-tight">
          Como se edita o site
        </h1>
        <Link
          href="/painel"
          className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-70 hover:opacity-100"
        >
          Voltar
        </Link>
      </header>

      <P>
        Tudo o que se edita está em{" "}
        <A href="https://www.joanadominguesdesign.pt/admin">
          joanadominguesdesign.pt/admin
        </A>
        . Abre, carrega em <B>&quot;Sign In with GitHub&quot;</B> — apesar do
        nome, o que abre é a nossa entrada — e escreve o teu email e a tua
        palavra-passe.
      </P>

      <H>O que se pode mudar</H>
      <P>
        Quatro coisas: os <B>projetos</B>, os <B>textos do blog</B>, as{" "}
        <B>ligações externas</B> (LinkedIn, Substack, ORCID…) e as{" "}
        <B>informações de contacto</B>.
      </P>
      <P>
        Os textos do desenho — a bio, os campos do &quot;Designer&quot;, as
        linhas dos percursos, as frases de entrada — não estão aí de propósito:
        vêm do ficheiro do Figma e mudam-se a pedido, para o desenho não se
        desalinhar sem ninguém ver.
      </P>

      <H>Nada se perde</H>
      <P>
        Cada alteração fica gravada com data e autor, e desfaz-se. Se um projeto
        for apagado por engano, recupera-se. Não há nenhum botão aqui que
        estrague o site de forma definitiva — por isso vale a pena experimentar
        sem medo.
      </P>

      <H>Acrescentar ou mudar um projeto</H>
      <P>
        <B>Projetos</B> → <I>New Projetos</I> para um novo, ou carregar num da
        lista. Depois <B>Publish</B> → <I>Publish now</I>. Dois minutos depois
        está no site.
      </P>
      <Tabela
        cabecalho={["Campo", "O que lá vai"]}
        linhas={[
          ["Título", "“Authentic Studio Pilates”"],
          [
            "Endereço",
            "Nasce do título. Num projeto que já está no ar, não se muda — parte as ligações que andem por aí",
          ],
          ["Tipo", "“Marca · Identidade visual”. Sai no cartão, em maiúsculas"],
          ["Ano", "2023 a 2026"],
          ["Descrição", "Um a três parágrafos"],
          ["Capa", "Quadrada, mínimo 1400×1400. É a que vai à órbita da home"],
          ["Imagens", "A galeria da página. Mínimo 1600 de largura"],
          ["Vídeos", "MP4, sempre com o poster — sem ele fica um buraco preto"],
          ["Aparece na home", "Se entra na órbita e na tira do telemóvel"],
          ["Ordem", "A ordem na home, do menor para o maior. Não é a data"],
          ["Estado", "Rascunho não aparece em lado nenhum, nem no Google"],
        ]}
      />
      <P>
        <B>O ponto que costuma correr mal são as imagens.</B> Uma fotografia
        tirada da câmara pesa 8 MB e faz o site demorar segundos a abrir no
        telemóvel — uma página de projeto inteira, hoje, pesa menos do que isso.
        Antes de carregar, reduz para 2000 px de largura. Se for mais simples,
        manda-as à Laura, que converte.
      </P>

      <H>Escrever no blog</H>
      <P>
        <B>Escritos</B>. A lista pública é a página{" "}
        <A href="https://www.joanadominguesdesign.pt/escrita">/escrita</A>. Há
        dois tipos de texto, e a diferença conta:
      </P>
      <Lista>
        <li>
          <B>Um texto que vive aqui</B> — escreve-se o corpo no painel e abre
          uma página do próprio site. É o único que trabalha o teu SEO: o Google
          dá o crédito ao domínio onde o texto está.
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
        <B>O blog não publica directo.</B> Gravar um texto não o põe no site:
        <I> Save</I> deixa-o em rascunho; arrastá-lo para <I>In review</I> faz
        aparecer a ligação <I>Check for Preview</I>, com o texto na página a
        sério, num endereço só teu; e só o <B>Publish</B> o põe no ar. Vê sempre
        a pré-visualização antes.
      </P>

      <H>Ligações e contactos</H>
      <P>
        Estão em <B>Definições</B>, e publicam directo. Para esconder uma
        ligação, desliga o interruptor <I>activa</I> — não é preciso apagá-la.
      </P>
      <P>
        O email aparece em <B>cinco sítios</B> do site e o telefone em três. Nas
        páginas legais não é decoração: é o contacto do responsável pelo
        tratamento de dados, que o RGPD obriga a estar lá e a estar certo.
        Trocar sim; apagar sem pôr outro, não.
      </P>

      <H>Se alguma coisa correr mal</H>
      <Tabela
        cabecalho={["O que acontece", "O que fazer"]}
        linhas={[
          [
            "Gravei e o site não mudou",
            "Esperar dois minutos e recarregar com Ctrl+Shift+R (ou Cmd+Shift+R)",
          ],
          [
            "Diz que não consegue gravar",
            "A chave do repositório expirou. Avisa a Laura — é um minuto a pôr outra",
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
