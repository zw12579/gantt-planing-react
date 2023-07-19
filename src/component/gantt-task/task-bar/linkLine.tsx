import React from "react";
import {BarTask} from "../../../types/bar-task";

type LinkProps ={
  taskFrom: any,
  taskTo: any
}

const drownPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const indexCompare = taskFrom?.index > taskTo?.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + 10 + taskHeight / 2;
  const taskFromEndPosition = taskFrom.x2 + arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition < taskTo.x1 ? "" : `H ${taskTo.x1 - arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition > taskTo.x1
      ? arrowIndent
      : taskTo.x1 - taskFrom.x2 - arrowIndent;

  const path = `M ${taskFrom.x2} ${taskFrom.y + 10 + taskHeight / 2}
  h ${arrowIndent}
  v ${(indexCompare * rowHeight) / 2}
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition}
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskTo.x1},${taskToEndPosition}
  ${taskTo.x1 - 5},${taskToEndPosition - 5}
  ${taskTo.x1 - 5},${taskToEndPosition + 5}`;
  return [path, trianglePoints];
};

export const LinkLine : React.FC<LinkProps> = (
  {
    taskFrom,
    taskTo
  }
) => {

  let path: string;
  let trianglePoints: string;

  [path, trianglePoints] = drownPathAndTriangle(
    taskFrom,
    taskTo,
    56,
    46,
    20
  );

  return (
    <g className="arrow" fill="grey" stroke="grey">
      <path strokeWidth="1.5" d={path} fill="none" />
      <polygon points={trianglePoints} />
    </g>
  )
}
