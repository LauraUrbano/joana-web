import Link from "next/link";

/**
 * As peças dos formulários do painel.
 *
 * Tudo formulários do servidor, sem JavaScript nosso: o browser submete, uma
 * server action grava, e a página volta com o resultado. Se o JavaScript não
 * carregar, continua a funcionar -- foi assim que apanhei um erro meu no teste,
 * e vale a pena manter.
 */

const CAIXA =
  "mt-2 w-full border border-clay/40 bg-paper px-3 py-2.5 font-body text-[1.05rem] outline-offset-2 focus-visible:outline-2 focus-visible:outline-clay";

export function Etiqueta({
  children,
  ajuda,
}: {
  children: React.ReactNode;
  ajuda?: string;
}) {
  return (
    <>
      <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
        {children}
      </span>
      {ajuda && (
        <span className="mt-1 block font-body text-[0.9rem] opacity-60">
          {ajuda}
        </span>
      )}
    </>
  );
}

export function Texto({
  etiqueta,
  nome,
  valor,
  ajuda,
  tipo = "text",
  obrigatorio = false,
  placeholder,
}: {
  etiqueta: string;
  nome: string;
  valor?: string | number | null;
  ajuda?: string;
  tipo?: string;
  obrigatorio?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Etiqueta ajuda={ajuda}>{etiqueta}</Etiqueta>
      <input
        name={nome}
        type={tipo}
        defaultValue={valor ?? ""}
        required={obrigatorio}
        placeholder={placeholder}
        className={CAIXA}
      />
    </label>
  );
}

export function Longo({
  etiqueta,
  nome,
  valor,
  ajuda,
  linhas = 5,
}: {
  etiqueta: string;
  nome: string;
  valor?: string | null;
  ajuda?: string;
  linhas?: number;
}) {
  return (
    <label className="block">
      <Etiqueta ajuda={ajuda}>{etiqueta}</Etiqueta>
      <textarea
        name={nome}
        rows={linhas}
        defaultValue={valor ?? ""}
        className={`${CAIXA} leading-relaxed`}
      />
    </label>
  );
}

export function Escolha({
  etiqueta,
  nome,
  valor,
  opcoes,
  ajuda,
}: {
  etiqueta: string;
  nome: string;
  valor?: string | null;
  opcoes: { valor: string; label: string }[];
  ajuda?: string;
}) {
  return (
    <label className="block">
      <Etiqueta ajuda={ajuda}>{etiqueta}</Etiqueta>
      <select name={nome} defaultValue={valor ?? ""} className={CAIXA}>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Interruptor({
  etiqueta,
  nome,
  ligado,
  ajuda,
}: {
  etiqueta: string;
  nome: string;
  ligado?: boolean;
  ajuda?: string;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        name={nome}
        type="checkbox"
        defaultChecked={ligado}
        value="1"
        className="mt-1 size-4 accent-clay"
      />
      <span>
        <Etiqueta ajuda={ajuda}>{etiqueta}</Etiqueta>
      </span>
    </label>
  );
}

export function Botao({
  children,
  discreto = false,
}: {
  children: React.ReactNode;
  discreto?: boolean;
}) {
  if (discreto) {
    return (
      <button
        type="submit"
        className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-60 hover:opacity-100"
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type="submit"
      className="bg-clay px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-80"
    >
      {children}
    </button>
  );
}

export function Seccao({
  titulo,
  acao,
  children,
}: {
  titulo: string;
  acao?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-clay/40 pt-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
          {titulo}
        </h2>
        {acao}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Recado({
  tom,
  children,
}: {
  tom: "bom" | "mau";
  children: React.ReactNode;
}) {
  return (
    <p
      role="status"
      className={`mt-6 border-l-2 pl-3 font-body text-[1.05rem] ${
        tom === "bom" ? "border-olive" : "border-[#8a2b1f] text-[#8a2b1f]"
      }`}
    >
      {children}
    </p>
  );
}

export function Atalho({
  para,
  children,
}: {
  para: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={para}
      className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] opacity-70 hover:opacity-100"
    >
      {children}
    </Link>
  );
}
