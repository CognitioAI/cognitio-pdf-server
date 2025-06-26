const express = require("express");
const bodyParser = require("body-parser");
const { chromium } = require("playwright");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const html = req.body.html;

  if (!html) {
    return res.status(400).send("Missing HTML content in request body.");
  }

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=report.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Failed to generate PDF.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});