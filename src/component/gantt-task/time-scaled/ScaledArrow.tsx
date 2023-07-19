import React, {ReactElement} from "react";
import {getUuid} from "../helpers/bar-helper";

interface ScaledArrowProps {
  taskFrom: any,
  dashed: number
}

const arrowPathAndTriangle = (task: any): any => {

  let path: string
  let textX: number
  let textY: number

  const taskToEndPosition = 16;
  const endY = task.x2 - 32

  textX = task.x1 + 20
  textY = task.y + taskToEndPosition

  if(task.y > 0 || task.y < 0){
    path = `
      M ${task.x1 + 18} ${16}
      v ${task.y}
      h ${endY - task.x1 + 16}
    `
  } else {
    path = `
      M ${task.x1 + 18} ${16}
      h ${endY - task.x1 - 2}
    `
  }
  const trianglePoints = `${task.x2 - 16},${taskToEndPosition}
  ${task.x2 - 16 - 5},${taskToEndPosition - 5}
  ${task.x2 - 16 - 5},${taskToEndPosition + 5}`;

  return [path, textX, textY];
}

export const ScaledArrow : React.FC<ScaledArrowProps> = ({taskFrom,dashed}) => {

  let path: string;
  let trianglePoints: string = '';
  let textX : number
  let textY : number

  [path, textX, textY] = arrowPathAndTriangle(taskFrom);

  const svgEle: ReactElement[] = []
  svgEle.push(<text key={getUuid()} x={textX} y={textY-3} style={{fontSize: '12px',fontWeight: 'normal'}}>{taskFrom.name}</text>)
  svgEle.push(<text key={getUuid()} x={textX} y={textY+13} style={{fontSize: '12px',fontWeight: 'normal'}}>{taskFrom.duration}天</text>)
  svgEle.push(<path key={getUuid()} strokeWidth="1.5" d={path} fill="none" />)
  if(dashed > taskFrom.x2){
    let x1 = taskFrom.x2
    let x2 = dashed
    if(taskFrom.y === 0){
      x1 = taskFrom.x2 - 18
      x2 = dashed - 18
    }
    svgEle.push(<line key={getUuid()} strokeWidth="1.5" x1={x1} y1={taskFrom.y + 16} x2={x2} y2={taskFrom.y + 16} strokeDasharray="2 2" />)
    if (taskFrom.y > 0) {
      trianglePoints = `${x2},${32}
      ${x2 + 5},${32 + 5}
      ${x2 - 5},${32 + 5}`;
      svgEle.push(<line key={getUuid()} strokeWidth="1.5" x1={x2} y1={taskFrom.y + 16} x2={x2} y2={32} strokeDasharray="2 2" />)
    } else if(taskFrom.y < 0) {
      trianglePoints = `${x2},${0}
      ${x2 + 5},${-5}
      ${x2 - 5},${-5}`;
      svgEle.push(<line key={getUuid()} strokeWidth="1.5" x1={x2} y1={taskFrom.y + 16} x2={x2} y2={0} strokeDasharray="2 2" />)
    }
  } else if (dashed === taskFrom.x2) {
    trianglePoints = `${taskFrom.x2 - 16},${16}
      ${taskFrom.x2 - 16 - 5},${16 - 5}
      ${taskFrom.x2 - 16 - 5},${16 + 5}`;
    if(taskFrom.y > 0){
      let x2 = dashed
      svgEle.push(<line key={getUuid()} strokeWidth="1.5" x1={x2} y1={taskFrom.y + 16} x2={x2} y2={32} />)
    }
  }
  return (
    <g className="arrow" fill="grey" stroke="grey">
      {svgEle}
      <polygon points={trianglePoints} />
    </g>
  )
}
