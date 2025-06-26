
const express = require('express');
const bodyParser = require('body-parser');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json({ limit: '5mb' }));

app.post('/generate', async (req, res) => {
  const { html } = req.body;

  if (!html) return res.status(400).send('Missing HTML content');

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    const pdfBuffer = await page.pdf();
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="output.pdf"',
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('Error generating PDF');
  }
});

app.get('/', (req, res) => {
  res.send('Playwright PDF server is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
