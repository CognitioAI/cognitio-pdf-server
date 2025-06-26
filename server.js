// Nouveau fichier server.js corrigé avec Puppeteer embarqué (headless Chrome inclus)
const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post("/generate-pdf", async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: "Missing HTML content." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage"
      ]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({ "Content-Type": "application/pdf" });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed:", err);
    res.status(500).json({ error: "PDF generation failed.", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`PDF server running on port ${port}`);
});
