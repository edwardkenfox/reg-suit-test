/* capture.js */

const puppeteer = require('puppeteer');
const mkdirp = require('mkdirp');
const fs = require('fs')
const { URL } = require('url')

async function main() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  let page = await browser.newPage();

  page.setViewport({ width: 1280, height: 1080 });

  const json = fs.readFileSync('./screenshots.json')
  const rawUrls = JSON.parse(json)["screenshot_urls"]
  const urls = rawUrls.map(url => new URL(url))

  await (
    urls.map(async (url) => {
      await page.goto(url.href);
      await new Promise(res => setTimeout(() => res(), 300));
      await page.screenshot({ path: `screenshot/${url.pathname.replace(/\//g, '_')}.png` });
    })
  )();

  await page.close();
  await browser.close();
}

mkdirp.sync('screenshot');
main();
