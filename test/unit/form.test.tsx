import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cart } from "../../src/client/pages/Cart";
import { mockCartState, mockCheckoutResponse, mockResponse } from "./common/mocks";
import { renderWithWrappers, setupStore } from "./common/store";

describe("При попытке оформить заказ", () => {
  const mockCheckout = jest.fn(() => mockResponse(mockCheckoutResponse));

  const fillForm = async (name: string, phone: string, address: string) => {
    const nameField = screen.getByLabelText("Name");
    await userEvent.type(nameField, name);

    const phoneField = screen.getByLabelText("Phone");
    await userEvent.type(phoneField, phone);

    const addressField = screen.getByLabelText("Address");
    await userEvent.type(addressField, address);
  };

  const submitForm = () => {
    const submitButton = screen.getByRole("button", { name: "Checkout" });
    return userEvent.click(submitButton);
  };

  beforeEach(() => {
    renderWithWrappers(
      <Cart />,
      setupStore(
        {
          checkout: mockCheckout,
        },
        {
          getState: () => mockCartState,
        }
      )
    );
  });

  afterEach(() => {
    mockCheckout.mockClear();
  });

  it("форма не должна отправляться, если поля заполнены неправильно", async () => {
    await fillForm("Саня", "123", "Адрес");
    await submitForm();
    expect(mockCheckout).not.toBeCalled();
  });
});
