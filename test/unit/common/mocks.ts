import { CartState, CheckoutResponse, Product } from "../../../src/common/types";

export const mockProduct: Product = {
  id: 0,
  name: "Mock product",
  price: 1000,
  description: "Mock product description",
  material: "Mock product material",
  color: "Mock product color",
};

export const mockAxiosResponse = {
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
  request: {},
};

export const mockProducts: Product[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: index,
    name: `Product ${index + 1}`,
    price: index * 10,
    description: `Product ${index + 1} description`,
    material: `Product ${index + 1} material`,
    color: `Product ${index + 1} color`,
  })
);

export const mockCheckoutResponse: CheckoutResponse = {
  id: 0,
};

export const mockCartState: CartState = Object.fromEntries(
  mockProducts.map((product, i) => [
    product.id,
    {
      ...product,
      count: i + 1,
    },
  ])
);

export function mockResponse<T>(value: T) {
  return Promise.resolve({
    data: value,
    ...mockAxiosResponse,
  });
}
