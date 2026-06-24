import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
        background: "#FFFBF0",
        color: "#241B05",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>Chaveiro Pro</h1>
      <p style={{ color: "#8C7A45", marginBottom: "28px", maxWidth: "440px" }}>
        Gestão de estoque e vendas para chaveiros e serralherias. Teste grátis por 15 dias, sem
        compromisso.
      </p>
      <Link
        href="/login"
        style={{
          background: "linear-gradient(160deg, #FFE066, #FFC400, #E2A100)",
          color: "#241B05",
          fontWeight: 700,
          padding: "12px 26px",
          borderRadius: "10px",
          textDecoration: "none",
        }}
      >
        Começar teste grátis →
      </Link>
    </main>
  );
}
