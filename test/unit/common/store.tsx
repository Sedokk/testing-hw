import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { LocationDescriptor } from "history";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CartApi, ExampleApi } from "../../../src/client/api";
import { initStore } from "../../../src/client/store";
import { CartState } from "../../../src/common/types";

export function setupStore(api?: Partial<ExampleApi>, cart?: Partial<CartApi>) {
  return initStore(
    Object.assign(new ExampleApi(""), api),
    Object.assign(new CartApi(), cart)
  );
}

export function renderWithWrappers(
  ui: React.ReactElement,
  store: ReturnType<typeof setupStore>,
  startUrl?: LocationDescriptor
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    const initialEntries = startUrl !== undefined ? [startUrl] : undefined;
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper });
}

export function renderWithCart(
  ui: React.ReactElement,
  cartApi: CartApi,
  cartState: CartState
) {
  const getState = cartApi.getState;
  cartApi.getState = () => cartState;

  const renderResult = renderWithWrappers(ui, setupStore(undefined, cartApi));

  cartApi.setState(cartApi.getState());
  cartApi.getState = getState;

  return renderResult;
}
