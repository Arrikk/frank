const puppeteer = require("puppeteer");
const searchPageService = require("./searchPage");
const {
  generalData,
  descriptionData,
  agentAndDescription,
} = require("./dataPage");
const example = require("./example");
const ExcelJS = require("exceljs");


// const chrome = require('chromedriver')

const env = require("dotenv");
env.config({path: './.env'})

// Uncomment if Chromedriver initialization is needed
// chrome.start();
// const browserPath = chrome.path;

// Target URL and search range
const pageToGo =
  "https://acervomarcas.impi.gob.mx:8181/marcanet/vistas/common/datos/bsqExpedienteCompleto.pgi";
// const from = 2092086;
const from = process.env.FROM;
const to = process.env.TO;

let browser;
let total = 0;
const workBook = new ExcelJS.Workbook();
const b = "book.xlsx";
let sheet;

const dataFormatter = (result, data, reset = false) => {
  // console.log(data);
  if (reset) return null;
  // let result = t;
  for (const key in data) {
    if (data.hasOwnProperty.call(data, key)) {
      // console.log(result[key]);
      if (result[key] === "") {
        result[key] = data[key];
      } else if (result[key] !== "") {
        if (result[key + ".1"] === "") result[key + ".1"] = data[key];
        else result[key + ".2"] == data[key];
      }
    }
  }
  // console.log(result)
  return result;
};

// chrome.start()
const launcher = async (from) => {
  let frmN = from;
  let backN = false;
  try {
    // Launch Puppeteer browsery 
    browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    // Perform searches within the specified range
    let data = null;
    for (let n = from; n <= to; n++) {
      frmN = n + 1;
      // Navigate to search results page
      const page = await searchPageService(browser, n);
      const gd = await generalData(page);
      const desc = await descriptionData(page);
      const agentDetails = await agentAndDescription(page); 

      // Close the page after extracting data
      let ex = { ...example };
      if (gd) ex = dataFormatter(ex, gd);
      if (desc) ex = dataFormatter(ex, desc);
      if (agentDetails) ex = dataFormatter(ex, agentDetails);
      // const ex = await getData(browser, n)

      if (ex["Número de expediente"] === "") {
        backN = true;
        break;
      }

      console.log({ n, nt: ex["Número de expediente"] });

      // Combine general and description data
      // myData = { ...gd, ...desc };
      let VALUES = Object.values(ex);
      sheet.addRow(VALUES);
      await workBook.xlsx.writeFile(b);

      await new Promise((res) => res(setTimeout(() => {}, 500)));
      //  console.log("Cleared Data", data)
      page.close();

      total += 1;
      // Break the loop after processing a specific number of searches (for testing)
      // if (total === 10) break;
      // data = null;
    }
  } catch (error) {
    console.log(error);
    setTimeout(() => launcher(frmN), 2000);
  } finally {
    console.log("Quit Browser");
    browser.close();
    if (backN) launcher(frmN - 1);
    // Uncomment the line below to close the browser after execution
    // setTimeout(() => browser.close(), 5000);
  }
};

// Execute the main script launcher function

const init = async () => {
  await workBook.xlsx.readFile(b);
  sheet = workBook.getWorksheet(1);
  launcher(from);
};

// module.exports = init

init();
