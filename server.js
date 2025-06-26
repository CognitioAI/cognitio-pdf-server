const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json({ limit: "10mb" }));

app.post("/generate", async (req, res) => {
  try {
    const { html } = req.body;
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.set({ "Content-Type": "application/pdf" });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la génération du PDF");
  }
});

app.listen(PORT, () => {
  console.log(`PDF Server running on port ${PORT}`);
});
