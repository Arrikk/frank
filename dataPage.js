const firstSection = 'div[id="pnlDetalleGral_content"]';
const tableSelector = "table";
const tableRow = "tr";
const tableData = "td";
const tableHead = "thead";
const tableTHead = "th";
const productAndService = 'div[id="dtGrdProductosId_content"]';
const productAndServiceBody =
  'tbody[id="dtGrdProductosId:0:dtTblProdServId_data"]';
const pnlDetails = 'div[id="pnlDetalleGralListas_content"]';
const agentSelector = 'div[id="dtGrdApoderadosId_content"]';
const agentSelectorTable = 'div[id="dtGrdApoderadosId_content"] > table table';


const generalData = async (page) => {
  let allData = {};

  await page.waitForSelector(firstSection, {timeout: 50000});
  const section1 = await page.$(firstSection);
  // console.log(section1)
  if(!section1) return;
  const tables = await section1.$$(tableSelector, {timeout: 20000});

  if (tables.length > 0) {
    for (const table of tables) {
      const rows = await table.$$(tableRow);
      for (const row of rows) {
        let val;
        const td = await row.$$(tableData);
        const key = await td[0]?.evaluate((e) => e.textContent);
        if(key?.trim().replace("\\n", "") === 'Imagen'){
          // console.log("Has an image", td.length)
          val = await td[1]?.evaluate(e => {
            const img = e.querySelector('img')
            return img?.src
          })
        }
        else val = await td[1].evaluate((e) => e.textContent);
        allData[key?.trim().replace("\\n", "")] = val?.trim().replace("\\n", "");
      }
    }
  }
  // console.log({general: allData});
  return allData;
};

const descriptionData = async (page) => {
  const PDSData = await page.$(productAndService, {timeout: 20000});
  if(!PDSData) return;
  const PDSDataHead = await PDSData.$(tableHead);
  const PDSDataBody = await PDSData.$(productAndServiceBody, {timeout: 20000});

  const PDSDataHeadTh = await PDSDataHead.$$(tableTHead);
  const PDSDataBodyTd = await PDSDataBody.$$(tableData, {timeout: 10000});

  // console.log(PDSDataBodyTd);
  let PDS = {};
  for (let i = 0; i < PDSDataHeadTh.length; i++) {
    const key = await PDSDataHeadTh[i]?.evaluate((e) => e.textContent);
    const val = await PDSDataBodyTd[i]?.evaluate((e) => e.textContent);
    PDS[key?.trim().replace("\\n", "")] = val?.trim().replace("\\n", "");
  }
  return PDS;
};

const agentAndDescription = async (page) => {
  let allData = {};
  const agentDetails = await page.$(agentSelector, {timeout: 20000});
  // console.log(agentDetails)
  if (!agentDetails) return;
  const agentTable = await page.$(agentSelectorTable, {timeout: 20000});
  const rows = await agentTable.$$(tableRow);
  for (const row of rows) {
    const td = await row.$$(tableData);
    const key = await td[0]?.evaluate((e) => e.textContent);
    const val = await td[1]?.evaluate((e) => e.textContent);
    allData[key?.trim().replace("\\n", "")] = val?.trim().replace("\\n", "");
  }
  // console.log({allDataDes: allData})
  return allData;
};

module.exports = { generalData, descriptionData, agentAndDescription };
