import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductDetails } from "../../src/client/components/ProductDetails";
import { CartState } from "../../src/common/types";
import { mockProduct } from "./common/mocks";
import { renderWithCart, renderWithWrappers, setupStore } from "./common/store";
import { CartApi } from "../../src/client/api";

const product = mockProduct;

describe("Подробная информация о товаре", () => {
  beforeEach(() => {
    renderWithWrappers(<ProductDetails product={product} />, setupStore());
  });

  it("должна содержать название товара", () => {
    expect(
      screen.queryByRole("heading", { name: product.name })
    ).not.toBeNull();
  });

  it("должна содержать описание товара", () => {
    expect(screen.queryByText(product.description)).not.toBeNull();
  });

  it("должна содержать цену товара", () => {
    expect(screen.queryByText(`$${product.price}`)).not.toBeNull();
  });

  it("должна содержать цвет товара", () => {
    expect(screen.queryByText(product.color)).not.toBeNull();
  });

  it("должна содержать материал товара", () => {
    expect(screen.queryByText(product.material)).not.toBeNull();
  });

  it("не должна показывать, что товар в корзине, если его там нет", () => {
    expect(screen.queryByText("Item in cart")).toBeNull();
  });
});

describe("Подробная информация о товаре", () => {
  const cartApi = new CartApi();
  const mockCartState: CartState = {
    [product.id]: {
      ...product,
      count: 0,
    },
  };

  beforeEach(() => {
    renderWithCart(
      <ProductDetails product={product} />,
      cartApi,
      mockCartState
    );
  });

  it("должна показывать сообщение, если товар уже есть в корзине", () => {
    expect(screen.queryByText("Item in cart")).not.toBeNull();
  });

  it("должна содержать кнопку, при нажатии на которую количество товара в корзине увеличивается на 1", async () => {
    const addButton = screen.getByRole("button", { name: "Add to Cart" });

    const countBefore = cartApi.getState()[product.id].count;
    await userEvent.click(addButton);
    const countAfter = cartApi.getState()[product.id].count;

    expect(countAfter).toBe(countBefore + 1);
  });
});
