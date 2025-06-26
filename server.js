
const express = require("express");
const { chromium } = require("playwright");
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json({ limit: "2mb" }));

app.post("/", async (req, res) => {
    const { html } = req.body;
    if (!html) return res.status(400).send("Missing HTML content");

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.set("Content-Type", "application/pdf");
    res.send(pdfBuffer);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
