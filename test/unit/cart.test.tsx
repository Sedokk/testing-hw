import React from "react";
import { getAllByRole, queryByText, screen } from "@testing-library/react";
import { Cart } from "../../src/client/pages/Cart";
import { renderWithWrappers, setupStore } from "./common/store";
import { mockCartState } from "./common/mocks";

it("Страница с пустой корзиной должна содержать ссылку на страницу с каталогом", () => {
  renderWithWrappers(<Cart />, setupStore());
  const link = screen.getByRole("link", { name: "catalog" });
  expect(link.getAttribute("href")).toBe("/catalog");
});

describe("Страница с не пустой корзиной", () => {
  const cellIds = {
    name: 0,
    price: 1,
    count: 2,
    total: 3,
  } as const;

  const getCell = (productId: string, column: keyof typeof cellIds) =>
    getAllByRole(screen.getByTestId(productId), "cell")[cellIds[column]];

  beforeEach(() => {
    renderWithWrappers(
      <Cart />,
      setupStore(undefined, {
        getState: () => mockCartState,
      })
    );
  });

  it("должна содержать таблицу с товарами в корзине", () => {
    Object.keys(mockCartState).forEach((id) =>
      expect(screen.queryByTestId(id)).not.toBeNull()
    );
  });

  it("должна содержать название каждого товара в корзине", () => {
    Object.entries(mockCartState).forEach(([id, { name }]) => {
      const cell = getCell(id, "name");
      expect(cell.textContent).toBe(name);
    });
  });

  it("должна содержать цену каждого товара в корзине", () => {
    Object.entries(mockCartState).forEach(([id, { price }]) => {
      const cell = getCell(id, "price");
      expect(cell.textContent).toBe(`$${price}`);
    });
  });

  it("должна содержать количество каждого товара в корзине", () => {
    Object.entries(mockCartState).forEach(([id, { count }]) => {
      const cell = getCell(id, "count");
      expect(cell.textContent).toBe(count.toString());
    });
  });

  it("должна содержать общую стоимость каждого товара в корзине", () => {
    Object.entries(mockCartState).forEach(([id, { count, price }]) => {
      const cell = getCell(id, "total");
      expect(cell.textContent).toBe(`$${count * price}`);
    });
  });

  it("должна содержать общую сумму товаров в корзине", () => {
    const tfoot = screen.getAllByRole("rowgroup").at(-1)!;
    const totalPrice = Object.values(mockCartState).reduce(
      (total, { price, count }) => total + price * count,
      0
    );
    expect(queryByText(tfoot, `$${totalPrice}`));
  });
});
