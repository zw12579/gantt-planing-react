import React from "react";

interface PertArrowProps {
  taskFrom: any,
  taskTo: any
}


export const PertArrow : React.FC<PertArrowProps> = ({taskFrom,taskTo}) => {

  const lineEle = (
    <line
      x1={taskFrom.x1 + 16}
      y1={taskFrom.y +16}
      x2={taskTo.x1 - 22}
      y2={taskTo.y + 16}
      stroke='grey'
      strokeWidth='2'
      markerEnd='url(#markerArrow)'>
    </line>
  )

  return (
    <g className="arrow">
      {lineEle}
    </g>
  )
}
