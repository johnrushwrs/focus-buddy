import React from "react";
import { getHourMinuteString } from "./Utils";

interface Props {
  startTime: Date;
  endTime: Date;
  blockTitle: string;
  details: string;
  topPercent: number;
  botPercent: number;
  onClick: () => void;
  isSelected: boolean;
}

const FocusBlock = ({
  startTime,
  endTime,
  blockTitle,
  details,
  topPercent,
  botPercent,
  onClick,
  isSelected,
}: Props) => {
  const blockStyle = { top: `${topPercent}%`, bottom: `${botPercent}%` };

  return (
    <div
      className={isSelected ? "focus-block selected" : "focus-block"}
      style={blockStyle}
      onClick={onClick}
    >
      <span className="title">{blockTitle}</span>
      <span className="time">
        {getHourMinuteString(startTime)} - {getHourMinuteString(endTime)}
      </span>
    </div>
  );
};

export default FocusBlock;
