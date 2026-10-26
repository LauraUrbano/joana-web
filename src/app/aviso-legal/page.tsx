import type { Metadata } from "next";

import PaginaLegal, { Acto } from "@/components/pagina-legal";
import { lerContacto } from "@/lib/conteudo";

export const metadata: Metadata = {
  title: "Aviso legal — Joana Domingues Design",
  description:
    "Quem é responsável por este sítio, o que se pode fazer com o que está aqui, e a lei que se aplica.",
  alternates: { canonical: "/aviso-legal" },
};

/**
 * O aviso legal.
 *
 * Escrito a partir do que este sítio é mesmo: um portfólio e um lugar de
 * escrita, sem loja, sem conta e sem formulário. Não há aqui cláusulas de
 * comércio electrónico porque não há comércio nenhum.
 *
 * Falta a identificação fiscal e a morada profissional -- não as tenho, e
 * inventar dados de identificação de alguém é a última coisa a fazer numa
 * página destas. Quando a Joana as mandar, entram na primeira secção.
 */
/* O conteúdo vem da base de dados, por isso esta página não pode ser
   construída uma vez e congelada: o Next guarda-a durante um minuto e
   reconstrói-a depois, e as acções do painel mandam reconstruir mal se grave.
   Assim uma alteração aparece no sítio logo a seguir, sem o custo de ir à base
   de dados a cada visita. */
export const revalidate = 60;

export default async function AvisoLegal() {
  const contacto = await lerContacto();
  return (
    <PaginaLegal titulo="Aviso legal" atualizado="16 de outubro de 2026">
      <Acto titulo="Quem é responsável por este sítio">
        <p>
          Este sítio é de <strong>Joana Domingues</strong>, designer de
          comunicação e investigadora, a trabalhar a partir de Portugal. Serve
          para mostrar o trabalho dela e aquilo que escreve.
        </p>
        <p>
          Para falar com ela:{" "}
          <a
            href={`mailto:${contacto.email}`}
            className="border-b border-clay/60 transition-opacity hover:opacity-60"
          >
            {contacto.email}
          </a>{" "}
          ou{" "}
          <a
            href="https://wa.me/351915086579"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-clay/60 transition-opacity hover:opacity-60"
          >
            +351 915 086 579
          </a>
          .
        </p>
      </Acto>

      <Acto titulo="O que se pode fazer com o que está aqui">
        <p>
          Os textos, as imagens, as marcas e a identidade visual deste sítio
          são de Joana Domingues ou dos clientes para quem os projetos foram
          feitos. Pode ler, citar com indicação da origem e partilhar a
          ligação.
        </p>
        <p>
          Reproduzir, copiar ou reutilizar qualquer parte em trabalho próprio
          ou de terceiros precisa de autorização escrita. As marcas dos
          clientes que aparecem nos projetos pertencem a esses clientes e são
          mostradas apenas a título de portfólio.
        </p>
      </Acto>

      <Acto titulo="Ligações para outros sítios">
        <p>
          Há ligações daqui para o ORCID, o Ciência Vitae, o LinkedIn, o
          Substack, o Instagram e o WhatsApp. Esses sítios são de terceiros,
          têm as suas próprias regras e políticas, e não são responsabilidade
          de Joana Domingues.
        </p>
      </Acto>

      <Acto titulo="Rigor do conteúdo">
        <p>
          O conteúdo deste sítio é informativo e é mantido com o cuidado
          possível, mas pode conter erros ou estar desactualizado. Nada do que
          está aqui constitui, por si só, uma proposta comercial ou um
          compromisso contratual: os trabalhos são sempre acordados por
          escrito, caso a caso.
        </p>
      </Acto>

      <Acto titulo="Dados pessoais">
        <p>
          Este sítio não usa cookies nem recolhe dados de quem o visita, para
          além dos registos técnicos do servidor. Está tudo explicado, com o
          detalhe que o Regulamento Geral sobre a Proteção de Dados exige, na{" "}
          <a
            href="/politica-de-privacidade"
            className="border-b border-clay/60 transition-opacity hover:opacity-60"
          >
            Política de Privacidade
          </a>
          .
        </p>
      </Acto>

      <Acto titulo="Lei aplicável">
        <p>
          A este sítio aplica-se a lei portuguesa. Qualquer litígio que não se
          resolva por acordo fica sujeito aos tribunais portugueses
          competentes.
        </p>
      </Acto>

      <Acto titulo="Alterações">
        <p>
          Este aviso pode ser alterado sempre que o sítio ou a actividade
          mudem. A data da última revisão está no fim da página.
        </p>
      </Acto>
    </PaginaLegal>
  );
}
