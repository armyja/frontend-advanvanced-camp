const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://localhost:8080/animation.html")
    const a = await page.$$('a');
    console.log(a)
    // console.log(await a.asElement().boxModel())
    // await hrefElement.click();
})();