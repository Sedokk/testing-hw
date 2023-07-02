const {
  staticPages,
  dynamicPages,
  mobileSize,
  fillCart,
  clearMocks,
} = require("./common/utils");
const { mockApi } = require("./common/mocks");

async function checkDesign(browser) {
  await browser.assertView("desktop", "body");
  await browser.setWindowSize(...mobileSize);
  await browser.assertView("mobile", "body");
}

describe("Должны удовлетворять дизайнам", () => {
  for (const [page, url] of Object.entries(staticPages)) {
    it(page, async ({ browser }) => {
      await browser.url(url);
      await checkDesign(browser);
    });
  }

  for (const [page, { url, loaderSelector }] of Object.entries(dynamicPages)) {
    it(page, async ({ browser }) => {
      await mockApi(browser);
      await browser.url(url());

      const loader = await browser.$(loaderSelector);
      await loader.waitForExist({
        timeout: 2000,
        reverse: true,
      });

      await checkDesign(browser);
      await clearMocks(browser);
    });
  }

  it("страница с непустой корзиной", async ({ browser }) => {
    await mockApi(browser);
    await fillCart(browser);
    await checkDesign(browser);
    await clearMocks(browser);
  });
});
