// App.test.jsx

import React from "react";
import {render, screen} from "@testing-library/react";
import {App} from "./App.jsx";

const expect = (value) => {
  return {
    toBe: (expected) => {
      if (value !== expected) {
        throw new Error(`Expected ${value} to be ${expected}`);
      }
    },
    // Add more assertion methods as needed
  };
};

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


