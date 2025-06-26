const express = require("express");
const bodyParser = require("body-parser");
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("PDF Server is running.");
});

app.post("/generate", async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: "HTML content is required." });
  }

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf();
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=rapport.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
