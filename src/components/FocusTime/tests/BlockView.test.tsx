import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import BlockView from "../BlockView";
import { getHourMinuteString } from "../Utils";
import userEvent from "@testing-library/user-event";

describe("BlockView component", () => {
  const mockOnBlockChange = jest.fn();
  const testIntervalLengthInMinutes = 15;

  const defaultProps = {
    startTime: new Date("2022-01-01T10:00:00Z"),
    endTime: new Date("2022-01-01T11:00:00Z"),
    blockTitle: "Test Title",
    details: "Test Details",
    timeOptions: {
      minStartTime: new Date("2022-01-01T09:00:00Z"),
      maxEndTime: new Date("2022-01-01T12:00:00Z"),
      intervalLengthInMinutes: testIntervalLengthInMinutes,
    },
    onBlockChange: mockOnBlockChange,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should call onBlockChange when the title input changes", () => {
    const { container } = render(<BlockView {...defaultProps} />);
    const titleInput: HTMLInputElement | null =
      container.querySelector("input.title");

    expect(titleInput?.value).toBe(defaultProps.blockTitle);

    fireEvent.change(titleInput!, { target: { value: "New Title" } });

    expect(mockOnBlockChange).toHaveBeenCalledWith(
      defaultProps.startTime,
      defaultProps.endTime,
      "New Title",
      defaultProps.details
    );
  });

  it("should call onBlockChange when the startTime is changed", () => {
    const { container } = render(<BlockView {...defaultProps} />);
    const selectInput: HTMLSelectElement | null = container.querySelector(
      'select[name="startTime"]'
    );

    userEvent.selectOptions(
      screen.getByTestId("startTime"),
      screen.getByRole("option", {
        name: getHourMinuteString(defaultProps.timeOptions.minStartTime),
      })
    );

    expect(mockOnBlockChange).toHaveBeenCalledWith(
      new Date(selectInput?.options[0].value!),
      defaultProps.endTime,
      defaultProps.blockTitle,
      defaultProps.details
    );
  });

  it("should call onBlockChange when the endTime is changed", () => {
    const { getByTestId } = render(<BlockView {...defaultProps} />);
    const selectInput: HTMLSelectElement | null = getByTestId(
      "endTime"
    ) as HTMLSelectElement;

    userEvent.selectOptions(
      screen.getByTestId("endTime"),
      screen.getByRole("option", {
        name: getHourMinuteString(defaultProps.timeOptions.maxEndTime),
      })
    );

    expect(mockOnBlockChange).toHaveBeenCalledWith(
      defaultProps.startTime,
      new Date(selectInput?.options[selectInput.options.length - 1].value!),
      defaultProps.blockTitle,
      defaultProps.details
    );
  });

  it("should have the correct default selected startTime", () => {
    const { container } = render(<BlockView {...defaultProps} />);
    const selectInput: HTMLSelectElement | null = container.querySelector(
      'select[name="startTime"]'
    );

    expect(selectInput).not.toBeNull();
    expect(selectInput?.selectedIndex).toBe(4);
    expect(selectInput?.selectedOptions.item(0)?.value).toBe(
      defaultProps.startTime.toISOString()
    );
  });

  it("should have the correct default selected endTime", () => {
    const { container } = render(<BlockView {...defaultProps} />);
    const selectInput: HTMLSelectElement | null = container.querySelector(
      'select[name="endTime"]'
    );

    expect(selectInput).not.toBeNull();
    expect(selectInput?.selectedIndex).toBe(3);
    expect(selectInput?.selectedOptions.item(0)?.value).toBe(
      defaultProps.endTime.toISOString()
    );
  });
});
