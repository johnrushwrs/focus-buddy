import React from "react";
import { addMinutesToDate, getHourMinuteString } from "./Utils";

interface BlockProps {
  startTime: Date;
  endTime: Date;
  blockTitle: string;
  details: string;
}

interface TimeOptions {
  minStartTime: Date;
  maxEndTime: Date;
  intervalLengthInMinutes: number;
}

function calculateNumOptions(
  startTime: Date,
  endTime: Date,
  intervalLengthInMinutes: number,
  inclusive: boolean | null = null
) {
  let difference = endTime.getTime() - startTime.getTime();
  let intervalLength = intervalLengthInMinutes * 60 * 1000; // converts to ms

  if (inclusive) return difference / intervalLength + 1;
  else return difference / intervalLength;
}

interface Props extends BlockProps {
  timeOptions: TimeOptions;
  onBlockChange: (
    startTime: Date,
    endTime: Date,
    blockTitle: string,
    details: string
  ) => void;
}

const BlockView = ({
  startTime,
  endTime,
  blockTitle,
  details,
  timeOptions,
  onBlockChange,
}: Props) => {
  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let title = event.target.value || "";
    onBlockChange(startTime, endTime, title, details);
  };

  const onStartChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    let elem = event.target;
    let selectedOption = elem.selectedOptions[0];

    let newStartDate = new Date(Date.parse(selectedOption.value));
    onBlockChange(newStartDate, endTime, blockTitle, details);
  };

  const onEndChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    let elem = event.target;
    let selectedOption = elem.selectedOptions[0];

    let newEndDate = new Date(Date.parse(selectedOption.value));
    onBlockChange(startTime, newEndDate, blockTitle, details);
  };

  const onDetailsChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    let newDetails = event.target.value;
    onBlockChange(startTime, endTime, blockTitle, newDetails);
  };

  const numStartTimeOptions = calculateNumOptions(
    timeOptions.minStartTime,
    endTime,
    timeOptions.intervalLengthInMinutes,
    false
  );

  const firstEndTime = new Date(
    startTime.getTime() + timeOptions.intervalLengthInMinutes * 60 * 1000
  );
  const numEndTimeOptions = calculateNumOptions(
    firstEndTime,
    timeOptions.maxEndTime,
    timeOptions.intervalLengthInMinutes,
    true
  );

  const createTimeOptions = (startTime: Date, numOptions: number) => {
    return Array.from({ length: numOptions }, (v, index) => {
      let timeOption = addMinutesToDate(startTime, index * 15);
      let timeString = timeOption.toISOString();
      return (
        <option value={timeString} key={timeString}>
          {getHourMinuteString(timeOption)}
        </option>
      );
    });
  };

  return (
    <div className="block-view">
      <div className="title-and-time">
        <input className="title" onChange={onTitleChange} value={blockTitle} />
        <div className="time-inputs">
          <div className="time-input">
            <span>Start</span>
            <label htmlFor="startTime">
              <select
                name="startTime"
                id="startTime"
                onChange={onStartChange}
                value={startTime.toISOString()}
                data-testid="startTime"
              >
                {createTimeOptions(
                  timeOptions.minStartTime,
                  numStartTimeOptions
                )}
              </select>
            </label>
          </div>
          <div className="time-input">
            <span>End</span>
            <label htmlFor="endTime">
              <select
                name="endTime"
                id="endTime"
                onChange={onEndChange}
                value={endTime.toISOString()}
                data-testid="endTime"
              >
                {createTimeOptions(firstEndTime, numEndTimeOptions)}
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="details-section">
        <span>Notes</span>
        <textarea
          className="details"
          value={details}
          onChange={onDetailsChange}
        ></textarea>
      </div>
    </div>
  );
};

export default BlockView;
