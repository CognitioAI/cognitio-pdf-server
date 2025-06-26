import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json({ limit: '5mb' }));

app.post('/generate-pdf', async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML manquant dans la requête.' });
    }

    const browser = await puppeteer.launch({
      headless: 'new', // compatible Puppeteer v22+
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="rapport.pdf"',
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erreur lors de la génération PDF :', error);
    res.status(500).json({ error: 'Erreur lors de la génération PDF' });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur PDF en ligne sur le port ${port}`);
});
