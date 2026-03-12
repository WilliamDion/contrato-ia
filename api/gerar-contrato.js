import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";
import PDFDocument from "pdfkit";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rota de contrato (mantendo seu prompt)
app.post("/api/gerar-contrato", async (req, res) => {
  try {
    const { descricao } = req.body;
    const prompt = `Você é um advogado especialista em contratos no Brasil.

Crie um contrato profissional, juridicamente válido, em português do Brasil.



REGRAS OBRIGATÓRIAS:

1. Verifique a "Descrição" abaixo: se nela houver nomes, CPFs, CNPJs, valores ou prazos, INSIRA-OS DIRETAMENTE no texto do contrato.

2. Se a informação NÃO estiver na descrição, use o marcador {{id_do_campo}}.

3. Retorne um JSON com:

   - "contrato": O texto completo.

   - "campos": Apenas os itens que NÃO foram encontrados na descrição e ficaram como {{id_do_campo}}. Se tudo foi preenchido, o array "campos" deve estar vazio [].



ASSINATURA (modelo obrigatório):

Local e data: ________________________________________________

CONTRATANTE: ________________________________________________

CONTRADO: _________________________________________________



Descrição fornecida pelo usuário:

"${descricao}"



Campos possíveis para verificação:

nome_contratante, documento_contratante, endereco_contratante, nome_contratado, documento_contratado, endereco_contratado, valor, prazo.



Retorne SOMENTE o JSON:

{

  "contrato": "...",

  "campos": [{ "id": "...", "label": "..." }]

}`; // Seu prompt original aqui

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar contrato" });
  }
});

export default app;
