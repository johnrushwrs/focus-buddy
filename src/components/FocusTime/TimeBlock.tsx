import React from "react";

interface Props {
  startDate: Date;
  onClick: () => void;
}

const TimeBlock = ({ startDate, onClick }: Props) => {
  return (
    <div
      className="time-block"
      key={startDate.getTime()}
      onClick={onClick}
    ></div>
  );
};

export default TimeBlock;
