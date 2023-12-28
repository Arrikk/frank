const pageToGo = "https://acervomarcas.impi.gob.mx:8181/marcanet/vistas/common/datos/bsqExpedienteCompleto.pgi";
const searchSelector = 'input[id="frmBsqExp:expedienteId"]'
const searchButton = 'button[id="frmBsqExp:busquedaId2"]'

const searchPageService = async(browser, number) => {
    let page = await browser.newPage();
    await page.goto(pageToGo, {timeout: 90000});
    await page.waitForSelector(searchSelector, {timeout: 70000})
    await page.type(searchSelector, number.toString())
    await page.click(searchButton)
    return page;

}

module.exports = searchPageService