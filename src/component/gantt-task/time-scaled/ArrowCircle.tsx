import React, {useState} from "react";

interface ArrowCircleProps {
  index: number
  offsetX: number,
  offsetY: number,
  handleMoveX: Function
}

export const ArrowCircle: React.FunctionComponent<ArrowCircleProps> = (
  {
    index,
    offsetX,
    offsetY,
    handleMoveX
  }
) => {
  let position = {left: offsetX - 16 + 'px',top: `calc(10% + ${offsetY - 33}px)`}

  const moveScaledX = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    document.onmousemove = (e) => {
      e.stopPropagation()
      e.preventDefault()
      const moveX = e.clientX - 475

      handleMoveX(index, moveX)
    }

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
    }
  }


  return (
    <div
      className={'gantt-task-circle-adm'}
      style={position}
      onMouseDown={moveScaledX}>
      <span>{index}</span>
    </div>
  )
}
