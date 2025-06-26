const express = require('express');
const app = express();
const port = process.env.PORT || 10000;
const fs = require('fs');
const html_to_pdf = require('html-pdf-node');

app.use(express.json({ limit: '5mb' }));

app.post('/', async (req, res) => {
  try {
    const htmlContent = req.body.html;

    if (!htmlContent) {
      return res.status(400).send('Missing HTML content in request body');
    }

    const file = { content: htmlContent };

    const pdfBuffer = await html_to_pdf.generatePdf(file, { format: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
