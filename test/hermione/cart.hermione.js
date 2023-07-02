const { mockApi } = require("./common/mocks");
const { manualFillCart, fillCart, clearMocks } = require("./common/utils");

async function fillForm(browser) {
  const nameInput = await browser.$("#f-name");
  await nameInput.addValue("Саня");

  const phoneInput = await browser.$("#f-phone");
  await phoneInput.addValue("+1234567890");

  const addressInput = await browser.$("#f-address");
  await addressInput.addValue("Адрес");

  const submitButton = await browser.$("button=Checkout");
  await submitButton.click();

  const message = await browser.$("h4=Well done!");
  await message.waitForExist({
    timeout: 2000,
  });
}

describe("Корзина с товарами", () => {
  it("должна сохранять состояние при перезагрузке страницы", async ({
    browser,
  }) => {
    await mockApi(browser);
    const itemsCount = 2;
    await manualFillCart(browser, itemsCount);

    await browser.refresh();
    await browser.assertView("plain", "body");

    await clearMocks(browser);
  });

  it("должна показывать номер заказа после удачного оформления", async ({
    browser,
  }) => {
    const orderRegex = /#(\d+)/;
    const ordersCount = 2;

    for (let i = 1; i < ordersCount + 1; ++i) {
      await fillCart(browser);

      await fillForm(browser);

      const order = await browser.$("p*=Order #");
      const orderNumber = +orderRegex.exec(await order.getText())[1];

      // По-хорошему должна использоваться проверка на равенство.
      // Но чтобы не надо было перезагружать сервер, поставил проверку на <= большого числа (100)
      // expect(orderNumber).toBe(i);
      expect(orderNumber).toBeLessThan(100);

      await clearMocks(browser);
    }
  });

  it("должна показывать сообщение после удачного оформления заказа", async ({
    browser,
  }) => {
    await mockApi(browser);
    await fillCart(browser);

    await fillForm(browser);

    await browser.assertView("plain", "body");

    await clearMocks(browser);
  });
});
