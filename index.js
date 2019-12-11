const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  var brand = 'Omega'
  const pageURL = `https://www.watchfinder.co.uk/${brand}/watches`;

  try {
    await page.goto(pageURL);
    console.log(`Openning: ${pageURL}`);
    var links = await page.evaluate(() => {
      var watchesLinks = document.querySelectorAll(
        `a.series_item`
      );
      var linksResult = [];
      for (var i = 0; i < 10; i++) {
        linksResult[i] = watchesLinks[i].getAttribute('href')
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
