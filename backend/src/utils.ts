import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
const which = require('which')

interface PropertyData {
    title: string;
    imageUrl: string;
  }

console.log("Searching for chromium");
const chromium = which.sync('chromium', {nothrow:true}) || which.sync('chromium-browser'); // if not found, throw error and end up

console.log(chromium)

const getDataFromPage = async (url: string): Promise<PropertyData[]> => {
  const browser = await puppeteer.launch({
      executablePath: chromium,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox']
  });

  const propertyDataList: PropertyData[] = [];
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  const htmlContent = await page.content();
  const $ = cheerio.load(htmlContent);

  $('div.property').each((index, element) => {
    const title = $(element).find('h2 > a.title').text().trim();
    const imageUrl = $(element).find('a:first-of-type > img').first().attr('src') || "";
    propertyDataList.push({ "title": title, "imageUrl": imageUrl });
  });

  return propertyDataList;

};

export default getDataFromPage