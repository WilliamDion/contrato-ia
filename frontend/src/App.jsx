import { useState } from "react";

function App() {
  const [descricao, setDescricao] = useState("");
  const [contrato, setContrato] = useState("");
  const [loading, setLoading] = useState(false);

  async function gerarContrato() {
    if (!descricao) return alert("Descreve o contrato primeiro");

    setLoading(true);
    setContrato("");

    try {
      const res = await fetch("http://localhost:3000/gerar-contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descricao }),
      });

      const data = await res.json();
      setContrato(data.contrato);
    } catch (err) {
      alert("Erro ao gerar contrato");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>Gerador de Contratos com IA</h2>

      <textarea
        placeholder="Descreva sobre o que é o contrato..."
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        rows={6}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={gerarContrato} disabled={loading}>
        {loading ? "Gerando..." : "Gerar contrato"}
      </button>

      {contrato && (
        <>
          <h3>Pré-visualização</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f4f4f4",
              padding: 10,
              marginTop: 10,
            }}
          >
            {contrato}
          </pre>
        </>
      )}
    </div>
  );
}

export default App;
