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

  return (
    <div className="block-view">
      <div className="title-and-time">
        <input className="title" onChange={onTitleChange} value={blockTitle} />
        <div className="time-inputs">
          <label htmlFor="startTime">
            <select name="startTime" id="startTime" onChange={onStartChange}>
              {Array.from({ length: timeOptions }, (v, index) => {
                let timeOption = addMinutesToDate(startTime, index * 15);
                let timeString = timeOption.toISOString();
                return (
                  <option value={timeString} key={timeString}>
                    {getHourMinuteString(timeOption)}
                  </option>
                );
              })}
            </select>
          </label>
          <label htmlFor="endTime">
            <select name="endTime" id="endTime" onChange={onEndChange}>
              {Array.from({ length: timeOptions }, (v, index) => {
                let timeOption = addMinutesToDate(endTime, (index - 1) * 15);
                let timeString = timeOption.toISOString();
                return (
                  <option value={timeString} key={timeString}>
                    {getHourMinuteString(timeOption)}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>
      <span className="details">{details}</span>
    </div>
  );
};

export default BlockView;
