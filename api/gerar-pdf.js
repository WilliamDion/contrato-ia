import PDFDocument from "pdfkit";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { contrato } = req.body;
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.text(contrato);
  doc.end();
}
