import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Loading from "./Loading";
import "@testing-library/jest-dom";
vi.mock('react-redux-loading-bar', () => ({
    default: () => <div data-testid="mock-loading-bar" />
}));

describe("Loading", () => {
    it("renders all loading elements", () => {
        render(<Loading />);

        expect(screen.getByTestId("mock-loading-bar")).toBeInTheDocument();

        // Cek shimmer by test id
        expect(screen.getByTestId("shimmer")).toBeInTheDocument();

        // Cek jumlah floating dots
        expect(document.querySelectorAll(".animate-float").length).toBe(3);
    });
});
