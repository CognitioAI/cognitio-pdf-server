const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer"); // Assure-toi que c’est bien installé

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("PDF Server is running.");
});

app.post("/generate", async (req, res) => {
  const html = req.body.html;

  if (!html) {
    return res.status(400).send("Missing HTML content");
  }

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: "new",
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=generated.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
