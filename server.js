import express from "express";
import bodyParser from "body-parser";
import puppeteer from "puppeteer";

const app = express();
app.use(bodyParser.text({ type: "*/*" }));

app.post("/generate-pdf", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(req.body, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=rapport.pdf"
    });
    res.send(pdf);
  } catch (err) {
    res.status(500).send("Erreur lors de la génération PDF : " + err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Serveur PDF en ligne sur le port", PORT));
