import React from "react";
import { screen } from "@testing-library/react";
import { ProductItem } from "../../src/client/components/ProductItem";
import { CartItem } from "../../src/common/types";
import { mockProduct } from "./common/mocks";
import { renderWithWrappers, setupStore } from "./common/store";

describe("Карточка товара в каталоге", () => {
  beforeEach(() => {
    renderWithWrappers(<ProductItem product={mockProduct} />, setupStore());
  });

  it("должна содержать название товара", () => {
    expect(
      screen.getByRole("heading", { name: mockProduct.name })
    ).not.toBeNull();
  });

  it("должна содержать цену товара", () => {
    expect(screen.queryByText(`$${mockProduct.price}`)).not.toBeNull();
  });

  it("должна содержать ссылку на страницу с подробной информацией о товаре", () => {
    const link = screen.getByRole("link", { name: "Details" });
    expect(link.getAttribute("href")).toBe(`/catalog/${mockProduct.id}`);
  });

  it("не должна показывать, что товар в корзине, если его там нет", () => {
    expect(screen.queryByText("Item in cart")).toBeNull();
  });
});

it("Карточка товара в каталоге должна показывать сообщение, если товар уже есть в корзине", () => {
  const cartItem: CartItem = {
    ...mockProduct,
    count: 1,
  };

  renderWithWrappers(
    <ProductItem product={mockProduct} />,
    setupStore(undefined, {
      getState: () => ({ [mockProduct.id]: cartItem }),
    })
  );

  expect(screen.queryByText("Item in cart")).not.toBeNull();
});
