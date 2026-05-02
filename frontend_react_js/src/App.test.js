import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app title and topics", () => {
  render(<App />);

  // Top nav brand
  expect(screen.getByText(/RDK Middleware Insights/i)).toBeInTheDocument();

  // Sidebar topics header
  expect(screen.getByText(/Topics/i)).toBeInTheDocument();

  // A known topic title from local content
  expect(screen.getByText(/What is RDK & where middleware fits/i)).toBeInTheDocument();
});
