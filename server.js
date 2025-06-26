import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json({ limit: '2mb' }));

app.post('/generate-pdf', async (req, res) => {
  const { html } = req.body;
  if (!html) return res.status(400).send('HTML content is missing.');

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set({ 'Content-Type': 'application/pdf' });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).send(`PDF generation error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`PDF server running on port ${port}`);
});