const {
  dynamicPages,
  generateIndices,
  getProductCards,
  loadDetailsPage,
} = require("./common/utils");

describe("Страница с каталогом", () => {
  beforeEach(async ({ browser }) => {
    const { url, loaderSelector } = dynamicPages["страница с каталогом"];
    await browser.url(url());

    const loader = await browser.$(loaderSelector);
    await loader.waitForExist({
      timeout: 2000,
      reverse: true,
    });
  });

  it("Должна содержать непустые данные в каждой карточке товара", async ({
    browser,
  }) => {
    for await (const card of getProductCards(browser)) {
      const title = await card.$(".card-title");
      await expect(title).not.toHaveText("");

      const price = await card.$(".card-text");
      await expect(price).not.toHaveText("");
    }
  });

  it("Должна в каждой карточке содержать ссылку, при переходе на которую открывается подробная информация о товаре", async ({
    browser,
  }) => {
    const cards = await getProductCards(browser);

    if (!cards.length) {
      return;
    }

    // Тест иногда может дават ложные положительные срабатывания. Поэтому его имеет смысл запускать несколько раз.
    const [randomProductIndex] = generateIndices(cards.length);
    const link = await cards[randomProductIndex].$("a=Details");
    await link.click();

    await loadDetailsPage(browser);
  });
});
