const express = require("express");
const bodyParser = require("body-parser");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const html = req.body.html;
  if (!html) {
    return res.status(400).send("Missing HTML content.");
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("PDF generation failed.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
