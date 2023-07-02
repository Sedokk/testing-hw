import React from "react";
import { getAllByRole, getByRole, screen } from "@testing-library/react";
import { Application } from "../../src/client/Application";
import { renderWithWrappers, setupStore } from "./common/store";
import { mockCartState } from "./common/mocks";

describe("Шапка", () => {
  beforeEach(() => {
    renderWithWrappers(<Application />, setupStore());
  });

  it("должна содержать ссылки на страницы магазина и корзину", () => {
    const links = ["/", "/catalog", "/delivery", "/contacts", "/cart"];

    const navigation = screen.getByRole("navigation");
    const pagesLinks = getAllByRole(navigation, "link").map((link) =>
      link.getAttribute("href")
    );

    expect(pagesLinks).toEqual(links);
  });

  it("должна содержать название магазина как ссылку на главную страницу", () => {
    const navigation = screen.getByRole("navigation");
    const title = getByRole(navigation, "link", { name: "Example store" });
    const link = title.getAttribute("href");

    expect(link).toEqual("/");
  });
});

describe("Рядом с ссылкой на корзину", () => {
  it("не должно ничего отображаться, если корзина пустая", () => {
    renderWithWrappers(<Application />, setupStore());
    expect(screen.getByRole("link", { name: "Cart" })).not.toBeNull();
  });

  it("должно показываться количество уникальных товаров в корзине, если она не пустая", () => {
    const cartItems = mockCartState;
    const itemsCount = Object.keys(mockCartState).length;

    renderWithWrappers(
      <Application />,
      setupStore(undefined, {
        getState: () => cartItems,
      })
    );

    expect(
      screen.queryByRole("link", { name: `Cart (${itemsCount})` })
    ).not.toBeNull();
  });
});
