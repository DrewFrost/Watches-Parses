const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  const pageURL = 'https://www.watchfinder.co.uk';

  try {
    await page.goto(pageURL);
    console.log(`Openning: ${pageURL}`);
  } catch (error) {
    console.log(`Couldn't open: ${pageURL} cause of: ${error}`);
  }

  await browser.close();
  process.exit();
})();
