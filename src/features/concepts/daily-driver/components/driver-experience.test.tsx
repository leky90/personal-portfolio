import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { COMMANDS } from "@/features/concepts/daily-driver/lib/keyboard-data";
import { DriverExperience } from "@/features/concepts/daily-driver/components/driver-experience";

// Không mount canvas thật trong jsdom.
vi.mock(
  "@/features/concepts/daily-driver/components/keyboard-canvas-loader",
  () => ({
    KeyboardCanvasLoader: () => <div data-testid="canvas-loader" />,
  }),
);

describe("DriverExperience — layout DOM + terminal prompt", () => {
  it("hero hiển thị headline THE DAILY DRIVER + prompt guest@kyle", () => {
    render(<DriverExperience />);
    expect(screen.getByText(/THE DAILY DRIVER/i)).toBeInTheDocument();
    expect(screen.getAllByText(/guest@kyle/i).length).toBeGreaterThanOrEqual(1);
  });

  it("mỗi lệnh có một section riêng", () => {
    const { container } = render(<DriverExperience />);
    for (const command of COMMANDS) {
      expect(
        container.querySelector(`[data-cmd-section="${command.cmd}"]`),
      ).not.toBeNull();
    }
  });

  it("gõ w: buffer nhận chữ, ghost tự hoàn thành 'ork'", () => {
    render(<DriverExperience />);
    fireEvent.keyDown(window, { key: "w", code: "KeyW" });
    expect(screen.getByTestId("prompt-buffer").textContent).toBe("w");
    expect(screen.getByTestId("prompt-ghost").textContent).toBe("ork");
  });

  it("Enter chạy lệnh khớp, xoá buffer, ghi exec line", () => {
    render(<DriverExperience />);
    fireEvent.keyDown(window, { key: "w", code: "KeyW" });
    fireEvent.keyDown(window, { key: "Enter", code: "Enter" });
    expect(screen.getByTestId("exec-line").textContent).toMatch(/work/);
    expect(screen.getByTestId("prompt-buffer").textContent).toBe("");
  });

  it("Escape xoá buffer; phím kèm Ctrl/Meta bị bỏ qua", () => {
    render(<DriverExperience />);
    fireEvent.keyDown(window, { key: "a", code: "KeyA" });
    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
    expect(screen.getByTestId("prompt-buffer").textContent).toBe("");
    fireEvent.keyDown(window, { key: "w", code: "KeyW", ctrlKey: true });
    fireEvent.keyDown(window, { key: "l", code: "KeyL", metaKey: true });
    expect(screen.getByTestId("prompt-buffer").textContent).toBe("");
  });

  it("core idea nhắc instanced, draw call và event.code", () => {
    render(<DriverExperience />);
    expect(screen.getAllByText(/instanced/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/draw call/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/event\.code/i).length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("mount canvas loader đúng một lần", () => {
    render(<DriverExperience />);
    expect(screen.getAllByTestId("canvas-loader")).toHaveLength(1);
  });
});
