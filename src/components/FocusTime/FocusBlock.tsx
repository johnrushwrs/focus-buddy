import React, { CSSProperties } from "react";
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

  let intervalLength = 15 * 60 * 1000;
  let numIntervals = (endTime.getTime() - startTime.getTime()) / intervalLength;
  const numDetailsLinesToDisplay = (numIntervals - 1) * 2;
  const detailsStyling: CSSProperties = {
    WebkitLineClamp: numDetailsLinesToDisplay,
    visibility: numDetailsLinesToDisplay === 0 ? "hidden" : "visible",
  };

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
      <p className="details" style={detailsStyling}>
        {details}
      </p>
    </div>
  );
};

export default FocusBlock;
