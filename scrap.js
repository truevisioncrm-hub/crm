const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.propertyfinder.ae/en/plp/buy/villa-for-sale-ajman-al-helio-al-helio-2-2QAdDkxOiYa.html', { waitUntil: 'domcontentloaded' });
  const content = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.property-page__features, .property-page__amenities, .property-amenities, .property-facts')).map(el => el.innerText).join('\n---\n');
  });
  console.log(content);
  await browser.close();
})();
