import React from "react";
import { addMinutesToDate, getHourMinuteString } from "./Utils";

interface BlockProps {
  startTime: Date;
  endTime: Date;
  blockTitle: string;
  details: string;
}

interface Props extends BlockProps {
  timeOptions: number;
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
    let newStart = event.target.value;
    let newStartDate = new Date(Date.parse(newStart));
    onBlockChange(newStartDate, endTime, blockTitle, details);
  };

  const onEndChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    let newEnd = event.target.value;
    let newEndDate = new Date(Date.parse(newEnd));
    onBlockChange(startTime, newEndDate, blockTitle, details);
  };

  const onDetailsChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    let newDetails = event.target.value;
    onBlockChange(startTime, endTime, blockTitle, newDetails);
  };

  return (
    <div className="block-view">
      <div className="title-and-time">
        <input className="title" onChange={onTitleChange} value={blockTitle} />
        <div className="time-inputs">
          <label htmlFor="startTime">
            <select name="startTime" id="startTime" onChange={onStartChange}>
              {Array.from({ length: timeOptions }, (v, index) => {
                let calculatedIndex = index - timeOptions / 2;
                let timeOption = addMinutesToDate(
                  startTime,
                  calculatedIndex * 15
                );
                let timeString = timeOption.toISOString();
                return (
                  <option
                    value={timeString}
                    key={timeString}
                    selected={calculatedIndex === 0}
                  >
                    {getHourMinuteString(timeOption)}
                  </option>
                );
              })}
            </select>
          </label>
          <label htmlFor="endTime">
            <select name="endTime" id="endTime" onChange={onEndChange}>
              {Array.from({ length: timeOptions }, (v, index) => {
                let timeOption = addMinutesToDate(startTime, (index + 1) * 15);
                let timeString = timeOption.toISOString();
                return (
                  <option
                    value={timeString}
                    key={timeString}
                    selected={timeOption.getTime() === endTime.getTime()}
                  >
                    {getHourMinuteString(timeOption)}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>
      <textarea
        className="details"
        value={details}
        onChange={onDetailsChange}
      ></textarea>
    </div>
  );
};

export default BlockView;
