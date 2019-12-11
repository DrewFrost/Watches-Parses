const puppeteer = require('puppeteer');
const fs = require('fs');

function arrayToCSV(objArray) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str =
    `${Object.keys(array[0])
      .map(value => `"${value}"`)
      .join(',')}` + '\r\n';

  return array.reduce((str, next) => {
    str +=
      `${Object.values(next)
        .map(value => `"${value}"`)
        .join(',')}` + '\r\n';
    return str;
  }, str);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const basicURL = 'https://www.watchfinder.co.uk';
  var brand = 'Omega';
  const pageURL = `${basicURL}/search?q=${brand}`;
  //Getting links of particular brand of watch
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
    console.error(`Couldn't proceed with: ${pageURL} cause of: ${error}`);
  }

  //Going through N watches that we got previously
  var watches = [];
  for (link in links) {
    //Basic url + specific watch link
    var linkPath = `${basicURL}${links[link]}`;
    try {
      await page.goto(linkPath);
      console.log(`Openning: ${linkPath}`);
      var watch = await page.evaluate(() => {
        var watchInfo = {};
        var brand = document.querySelector('h3 > span.prod_brand.ellipsis')
          .innerText;
        var model = document.querySelector('h3 > span.prod_series.ellipsis')
          .innerText;
        var referenceNumber = document.querySelector(
          'h3 > span.prod_model.ellipsis'
        ).innerText;
        var caseSize = document.querySelector(
          'div.prod_info-content > div > table > tbody > tr:nth-child(11) > td:nth-child(2)'
        ).innerText;
        watchInfo = { brand, model, referenceNumber, caseSize };
        return watchInfo;
      });
      watches.push(watch);
    } catch (error) {
      console.error(`Couldn't proceed: ${pageURL} cause of: ${error}`);
    }
  }

  await browser.close();
  var csvFileInfo = arrayToCSV(watches);
  fs.writeFileSync(`${watches[0].brand}.csv`, csvFileInfo);
  process.exit();
})();
