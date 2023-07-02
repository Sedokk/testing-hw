const API_URL = "http://localhost:3000/hw/store/api";

const mockProducts = Array.from({ length: 5 }, (_, index) => ({
  id: index,
  name: `Product ${index + 1}`,
  price: index * 10,
  description: `Product ${index + 1} description`,
  material: `Product ${index + 1} material`,
  color: `Product ${index + 1} color`,
}));

const mockDetails = Object.fromEntries(
  mockProducts.map((product) => [`${API_URL}/products/${product.id}`, product])
);

const mockCheckout = {
  id: 1,
};

const apiMocks = {
  ...mockDetails,
  [`${API_URL}/products`]: mockProducts,
  [`${API_URL}/checkout`]: mockCheckout,
};

async function mockApi(browser) {
  for (const [url, mock] of Object.entries(apiMocks)) {
    const mockResponse = await browser.mock(url);
    mockResponse.respond(mock);
  }
}

module.exports = { mockApi, mockProducts };
