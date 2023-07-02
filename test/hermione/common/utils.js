const { mockProducts } = require("./mocks");

const BASE_URL = "http://localhost:3000/hw/store";

const staticPages = {
  "главная страница": `${BASE_URL}`,
  "страница с условиями доставки": `${BASE_URL}/delivery`,
  "страница с контактами": `${BASE_URL}/contacts`,
  "страница с корзиной": `${BASE_URL}/cart`,
};

const dynamicPages = {
  "страница с каталогом": {
    url: () => `${BASE_URL}/catalog`,
    loaderSelector: "div=LOADING",
  },
  "страница с подробной информацией о товаре": {
    url: (id = 0) => `${BASE_URL}/catalog/${id}`,
    loaderSelector: "div=LOADING",
  },
};

const mobileSize = [375, 6000];

function generateIndices(length, count = 1, random = true) {
  const stub = Array.from({ length: count }).fill(0);

  if (random) {
    return stub.map(() => Math.floor(Math.random() * length));
  }

  return stub.map((_, index) => index % length);
}

function getProductCards(browser) {
  return browser.$$("[data-testid] > [data-testid]");
}

async function loadDetailsPage(browser) {
  const { loaderSelector } =
    dynamicPages["страница с подробной информацией о товаре"];

  const loader = await browser.$(loaderSelector);
  await loader.waitForExist({
    timeout: 2000,
    reverse: true,
  });
}

async function manualFillCart(browser, itemsCount, random = false) {
  await browser.url(dynamicPages["страница с каталогом"].url());

  const cards = await getProductCards(browser);
  const idAttributes = cards.map((card) => card.getAttribute("data-testid"));
  const productIds = (await Promise.all(idAttributes)).map((attr) => +attr);

  if (!productIds.length) {
    return false;
  }

  const productIndices = generateIndices(productIds.length, itemsCount, random);

  const { url } = dynamicPages["страница с подробной информацией о товаре"];

  for (const index of productIndices) {
    await browser.url(url(productIds[index]));
    await loadDetailsPage(browser);

    const addButton = await browser.$("button=Add to Cart");
    await addButton.click();
  }

  await browser.url(staticPages["страница с корзиной"]);
  return true;
}

async function fillCart(browser) {
  await browser.url(staticPages["главная страница"]);
  const puppeteer = await browser.getPuppeteer();
  const [page] = await puppeteer.pages();

  await page.evaluate((mockProducts) => {
    window.localStorage.setItem(
      "example-store-cart",
      JSON.stringify(
        Object.fromEntries(
          mockProducts.map((product, i) => [
            product.id,
            { ...product, count: i + 1 },
          ])
        )
      )
    );
  }, mockProducts);

  await browser.url(staticPages["страница с корзиной"]);
}

async function clearMocks(browser) {
  const puppeteer = await browser.getPuppeteer();
  const [page] = await puppeteer.pages();

  await page.evaluate(() => {
    window.localStorage.removeItem("example-store-cart");
  });

  await browser.mockClearAll();
}

module.exports = {
  staticPages,
  dynamicPages,
  mobileSize,
  generateIndices,
  getProductCards,
  loadDetailsPage,
  manualFillCart,
  fillCart,
  clearMocks,
};
