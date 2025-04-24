const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/screenshot", async (req, res) => {
    const url = req.query.url;
    const format = req.query.format || "png";
    const fullPage = req.query.fullPage === "true";

    if (!url) {
        return res.status(400).json({ error: "Please provide a valid URL." });
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const screenshotBuffer = await page.screenshot({ type: format, fullPage });
        await browser.close();

        res.setHeader("Content-Type", `image/${format}`);
        res.send(screenshotBuffer);
    } catch (error) {
        console.error("Screenshot error:", error);
        res.status(500).json({ error: "Failed to capture screenshot." });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Web Screenshot API running at http://localhost:${PORT}`))
