import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        background: "#FFFBF0",
        color: "#241B05",
      }}
    >
      <h1 style={{ marginBottom: "4px" }}>Entrar no Chaveiro Pro</h1>
      <p style={{ color: "#8C7A45", marginBottom: "18px" }}>
        Cadastro automático — sem senha, sem formulário.
      </p>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/dashboard" });
        }}
      >
        <button
          type="submit"
          style={{
            width: "260px",
            padding: "12px",
            borderRadius: "9px",
            border: "1px solid #F2DFA0",
            background: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continuar com Google
        </button>
      </form>

      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/dashboard" });
        }}
      >
        <button
          type="submit"
          style={{
            width: "260px",
            padding: "12px",
            borderRadius: "9px",
            border: "none",
            background: "#241B05",
            color: "#FFF3CE",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continuar com GitHub
        </button>
      </form>
    </main>
  );
}
