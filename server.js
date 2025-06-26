import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer-core';
import { executablePath } from 'puppeteer';

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json({ limit: '5mb' }));

app.post('/generate-pdf', async (req, res) => {
  try {
    const { html } = req.body;

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: executablePath(), // ← garantit un chemin valide
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="rapport.pdf"',
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erreur génération PDF :', error);
    res.status(500).send('Erreur lors de la génération PDF');
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur PDF prêt sur le port ${port}`);
});
