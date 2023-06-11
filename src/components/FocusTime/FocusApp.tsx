import React, { ChangeEventHandler, useEffect, useState } from "react";
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

// assumes that the time options are sorted and
// not conflicted
const calculateTimeOptions = (
  blocks: FocusBlockDetails[],
  selectedIndex: number,
  startDate: Date,
  endDate: Date
) => {
  let minStartTime = startDate;
  if (blocks.length > 1 && selectedIndex > 0) {
    minStartTime = blocks[selectedIndex - 1].endTime;
  }

  let maxEndTime = endDate;
  if (blocks.length > 1 && selectedIndex < blocks.length - 1) {
    maxEndTime = blocks[selectedIndex + 1].startTime;
  }

  return { minStartTime, maxEndTime, intervalLengthInMinutes };
};

interface FocusBlockDetails {
  startTime: Date;
  endTime: Date;
  blockTitle: string;
  details: string;
  topPercent: number;
  botPercent: number;
}

interface TimeOptions {
  minStartTime: Date;
  maxEndTime: Date;
  intervalLengthInMinutes: number;
}

const FocusApp = () => {
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

  const startTime = Date.now();
  const [startDate, setStartDate] = useState<Date>(
    new Date(getNearestHour(startTime))
  );
  const endDate = addMinutesToDate(
    startDate,
    intervalLengthInMinutes * numIntervals
  );
  const intervals = getTimeIntervals(
    startDate.getTime(),
    intervalLengthInMinutes
  );

  const onStartDateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    let inputDate: Date | null = event.target.valueAsDate;
    console.log(inputDate);
    if (inputDate !== null) {
      let newDate: Date = new Date(Date.now());
      newDate.setHours(inputDate.getUTCHours());
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      setStartDate(newDate);
    }
  };

  const [focusBlocks, setFocusBlocks] = useState<FocusBlockDetails[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<FocusBlockDetails>();
  const [timeOptions, setTimeOptions] = useState<TimeOptions>();

  // ensures that we set the time options after selecting
  // and updating the selected block
  useEffect(() => {
    if (selectedBlock !== undefined) {
      var selectedIndex = 0;
      for (let i = 0; i < focusBlocks.length; i++) {
        if (
          getFocusBlockKey(selectedBlock) === getFocusBlockKey(focusBlocks[i])
        ) {
          selectedIndex = i;
          break;
        }
      }

      let newTimeOptions = calculateTimeOptions(
        focusBlocks,
        selectedIndex,
        startDate,
        endDate
      );
      setTimeOptions(newTimeOptions);
    }
  }, [focusBlocks, selectedBlock, startDate, endDate]);

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

      let newBlocks = [...focusBlocks, newBlock];
      newBlocks.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

      setFocusBlocks(newBlocks);
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

    let isSelectedBlock =
      selectedBlock != null &&
      getFocusBlockKey(block) === getFocusBlockKey(selectedBlock);

    let newBlock: FocusBlockDetails = {
      startTime,
      endTime,
      blockTitle,
      details,
      topPercent: top,
      botPercent: bot,
    };

    let newBlocks = [newBlock, ...otherBlocks];
    newBlocks.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    if (isSelectedBlock) {
      setSelectedBlock(newBlock);
    }

    setFocusBlocks(newBlocks);
  };

  return (
    <div>
      <h1>Focus time Organizer</h1>
      <span>
        Start time{" "}
        <input
          type={"time"}
          value={getHourMinuteString(startDate)}
          placeholder={getHourMinuteString(startDate)}
          onChange={onStartDateChange}
        />
      </span>
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
          {selectedBlock !== undefined && timeOptions !== undefined && (
            <BlockView
              {...selectedBlock}
              timeOptions={timeOptions!}
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
