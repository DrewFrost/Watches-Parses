const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  var brand = 'Tissot';
  const pageURL = `https://www.watchfinder.co.uk/${brand}/watches/all`;

  try {
    await page.goto(pageURL);
    console.log(`Openning: ${pageURL}`);
    var links = await page.evaluate(() => {
      var watchesLinks = document.querySelectorAll(
        'div > div.col-push-5.col-7.col-md-12.prods_content > a'
      );
      var linksResult = [];
      for (var i = 0; i < 10; i++) {
        linksResult[i] = watchesLinks[i].getAttribute('href');
      }
      return linksResult;
    });
  } catch (error) {
    console.log(`Couldn't proceed: ${pageURL} cause of: ${error}`);
  }

  await browser.close();
  console.log(links);
  process.exit();
})();
