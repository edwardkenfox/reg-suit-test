/* capture.js */

const puppeteer = require('puppeteer');
const mkdirp = require('mkdirp');
const fs = require('fs')
const { URL } = require('url')

async function main() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  const json = fs.readFileSync('./screenshots.json')
  const rawUrls = JSON.parse(json)["screenshot_urls"]
  const urls = rawUrls.map(url => new URL(url))

  await (
    new Promise(resolve => {
      urls.map(async url => {
        let page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 1080 });
        await page.goto(url.href);
        await new Promise(res => setTimeout(() => res(), 300));
        await page.screenshot({ path: `screenshot/${url.pathname.replace(/\//g, '_')}.png` });
        await page.close();
      })
      resolve();
    })
  )();

  await browser.close();
}

mkdirp.sync('screenshot');
main();
