const { mockApi } = require("./common/mocks");
const {
  staticPages,
  mobileSize,
  generateIndices,
} = require("./common/utils");

function getNavLinks(browser) {
  return browser.$$(".navbar-nav a");
}

async function expectLinksDisplayed(browser, expectIsDisplayed = true) {
  const navLinks = await getNavLinks(browser);

  for (const link of navLinks) {
    const isDisplayed = await link.isDisplayed();
    expect(isDisplayed).toBe(expectIsDisplayed);
  }
}

describe("На мобильных устройствах", () => {
  beforeEach(async ({ browser }) => {
    await browser.url(staticPages["главная страница"]);
    await browser.setWindowSize(...mobileSize);
  });

  it("навигация должна быть скрыта по умолчанию", async ({ browser }) => {
    await expectLinksDisplayed(browser, false);
  });

  it("навигация должна раскрываться при клике на гамбургер", async ({
    browser,
  }) => {
    const toggler = browser.$("aria/Toggle navigation");
    await toggler.click();
    await expectLinksDisplayed(browser);
  });

  it("навигация должна скрываться при переходе на другую страницу", async ({
    browser,
  }) => {
    await mockApi(browser);
    const toggler = browser.$("aria/Toggle navigation");
    await toggler.click();

    const links = await getNavLinks(browser);
    const [randomLinkIndex] = generateIndices(links.length);
    await links[randomLinkIndex].click();

    await expectLinksDisplayed(browser, false);
  });
});
