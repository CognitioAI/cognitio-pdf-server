
const express = require("express");
const app = express();
const port = process.env.PORT || 10000;
const html_to_pdf = require("html-pdf-node");

app.use(express.json({ limit: "2mb" }));

app.post("/pdf", async (req, res) => {
    try {
        const html = req.body.html;
        const file = { content: html };
        const options = { format: 'A4' };
        const pdfBuffer = await html_to_pdf.generatePdf(file, options);
        res.setHeader("Content-Type", "application/pdf");
        res.send(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).send("PDF generation failed");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
