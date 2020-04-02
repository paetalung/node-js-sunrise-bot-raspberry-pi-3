const puppeteer = require('puppeteer-core');
const LineNotify = require("./src/client");
const mins = 60000;           // Equal to 1 minute
const timeOut = 1 * mins;     // Waiting for 1 minute then terminate the App

const ACCESS_TOKEN = ""; //TEST TOKEN

const notify = new LineNotify(`${ACCESS_TOKEN}`);
const URL = 'https://www.tmd.go.th/province.php?StationNumber=48517';

async function run() {
     const browser = await puppeteer.launch({
         headless: true, // false = show Browser , true = Not Show Browser
         executablePath: '/usr/bin/chromium-browser'
     });

  const page = await browser.newPage();
  await page.goto(URL);

  // Waiting for DOM
  await page.waitFor("td.PM");
     
  // Direct to the data
  let sunrise = await page.evaluate(() => {
         let myItem = document.querySelectorAll('.PM > table > tbody > tr > td')[2];
         return myItem.querySelectorAll('table > tbody > tr > td')[1].innerText;
  });

      var out = sunrise.replace('น.', ''); //trim TEXT
      //console.log(out);
      out = "SUNRISE @ " + out;
      // Send LineNotify
      notify.sendText(out);
      await browser.close();
 }

run(); // run App

setInterval(() => {
     //console.log("EXIT");
     process.exit(1);
 }, timeOut);
