import React, { useState } from "react";
import "./focus.css";
import FocusBlock from "./FocusBlock";
import TimeBlock from "./TimeBlock";
import BlockView from "./BlockView";
import { getHourMinuteString, addMinutesToDate } from "./Utils";

// the startTime is in milliseconds since epoch
function getNearestHour(startTime: number) {
  // milliseconds modulo
  let modulo = 1000 * 60 * 60;
  let modulus = startTime % modulo;

  return startTime - modulus;
}

const intervalLengthInMinutes = 15;
const numIntervals = 32;

function getTimeIntervals(
  startTime: number,
  incrementInMinutes: number
): Date[] {
  return Array.from(
    { length: numIntervals },
    (_, index) => new Date(startTime + index * incrementInMinutes * 60 * 1000)
  );
}

function getFocusBlockKey(block: FocusBlockDetails) {
  return "focus-block(" + block.startTime.getTime() + ")";
}

interface FocusBlockDetails {
  startTime: Date;
  endTime: Date;
  blockTitle: string;
  details: string;
  topPercent: number;
  botPercent: number;
}

const FocusApp = () => {
  const startTime = Date.now();
  const startDate = new Date(getNearestHour(startTime));

  const intervals = getTimeIntervals(
    startDate.getTime(),
    intervalLengthInMinutes
  );

  const calculatePosition = (startDate: Date, endDate: Date): number[] => {
    let timeInInterval = intervalLengthInMinutes * 60 * 1000;
    let startTime = startDate.getTime();
    let endTime = endDate.getTime();

    var intervalNumber = (startTime - intervals[0].getTime()) / timeInInterval;
    let lengthInIntervals = (endTime - startTime) / timeInInterval;

    let topPercent = (100 * intervalNumber) / intervals.length;
    let botPercent =
      (100 * (intervalNumber + lengthInIntervals)) / intervals.length;

    return [topPercent, 100 - botPercent];
  };

  const [focusBlocks, setFocusBlocks] = useState<FocusBlockDetails[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<FocusBlockDetails>();
  const addFocusBlock = (startDate: Date) => {
    console.log(startDate);

    var startDateTime = startDate.getTime();
    let endTime = addMinutesToDate(startDate, intervalLengthInMinutes);
    let timeInInterval = intervalLengthInMinutes * 60 * 1000;
    var intervalNumber =
      (startDateTime - intervals[0].getTime()) / timeInInterval;
    var hasConflict = false;

    for (let i = 0; i < focusBlocks.length; i++) {
      let blockStart = focusBlocks[i].startTime.getTime();
      let blockEnd = focusBlocks[i].endTime.getTime();
      if (
        (blockStart < startDateTime && blockEnd > startDateTime) ||
        (blockStart < endTime.getTime() && blockEnd > endTime.getTime()) ||
        (blockStart === startDateTime && blockEnd === endTime.getTime())
      ) {
        hasConflict = true;
        break;
      }
    }

    if (!hasConflict) {
      let lengthInIntervals =
        (endTime.getTime() - startDateTime) / timeInInterval;
      let topPercent = (100 * intervalNumber) / intervals.length;
      let botPercent =
        (100 * (intervalNumber + lengthInIntervals)) / intervals.length;

      let newBlock: FocusBlockDetails = {
        startTime: startDate,
        endTime: endTime,
        blockTitle: "New block",
        details: "",
        topPercent,
        botPercent: 100 - botPercent,
      };

      setFocusBlocks([...focusBlocks, newBlock]);
      setSelectedBlock(newBlock);
    }
  };

  const blockSectionChildren = [
    ...focusBlocks.map((block) => (
      <FocusBlock
        {...block}
        key={getFocusBlockKey(block)}
        onClick={() => setSelectedBlock(block)}
        isSelected={
          selectedBlock != null &&
          getFocusBlockKey(selectedBlock) === getFocusBlockKey(block)
        }
      />
    )),
    ...intervals.map((val) => (
      <TimeBlock
        startDate={val}
        key={"timeBlock " + val}
        onClick={() => addFocusBlock(val)}
      />
    )),
  ];

  const onBlockChange = (
    block: FocusBlockDetails,
    startTime: Date,
    endTime: Date,
    blockTitle: string,
    details: string
  ) => {
    let editedBlockKey = getFocusBlockKey(block);
    var otherBlocks = focusBlocks.filter(
      (val) => getFocusBlockKey(val) !== editedBlockKey
    );

    let [top, bot] = calculatePosition(startTime, endTime);

    let newBlock: FocusBlockDetails = {
      startTime,
      endTime,
      blockTitle,
      details,
      topPercent: top,
      botPercent: bot,
    };
    setFocusBlocks([newBlock, ...otherBlocks]);
    setSelectedBlock(newBlock);
  };

  return (
    <div>
      <h1>Focus time Organizer</h1>
      <div className="focus-section">
        <div className="intervals">
          <div className="block-labels">
            {intervals.map((val) => {
              return (
                <div className="label" key={val.getTime()}>
                  {getHourMinuteString(val)}
                </div>
              );
            })}
          </div>
          <div className="block-section">{blockSectionChildren}</div>
        </div>
        <div className="selected-focus-block">
          {selectedBlock !== undefined && (
            <BlockView
              {...selectedBlock}
              timeOptions={10}
              onBlockChange={(start, end, title, details) =>
                onBlockChange(selectedBlock, start, end, title, details)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusApp;
