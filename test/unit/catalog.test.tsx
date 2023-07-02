import React from "react";
import { screen } from "@testing-library/react";
import { ProductItemProps } from "../../src/client/components/ProductItem";
import { Catalog } from "../../src/client/pages/Catalog";
import { mockProducts, mockResponse } from "./common/mocks";
import { renderWithWrappers, setupStore } from "./common/store";

const mockProductItem = jest.fn();

jest.mock("../../src/client/components/ProductItem", () => ({
  ProductItem: (props: ProductItemProps) => {
    mockProductItem(props.product);
    return <></>;
  },
}));

it("Каталог должен показывать список товаров, возвращаемых с сервера", async () => {
  renderWithWrappers(
    <Catalog />,
    setupStore({
      getProducts: () => mockResponse(mockProducts),
    })
  );

  await Promise.resolve();

  mockProducts.forEach((product) => {
    expect(screen.queryByTestId(product.id)).not.toBeNull();
    expect(mockProductItem.mock.calls).toContainEqual([product]);
  });
});
