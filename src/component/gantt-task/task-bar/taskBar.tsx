import React from "react";
import {BarTask} from "../../../types/bar-task";
import {dateByX} from "../helpers/bar-helper";

export type TaskBarProps = {
  columnWidth: number,
  dates: Date[],
  model: any,
  custom_field: {
    id: string,
    parent_id: string,
    order: string,
    children: string,
    open: string,
    checked: string,
    highlight: string,
  },
  onGanttEvent: Function,
  ganttRightRef: any,
  // onExpanderClick: Function,
  // onMoveX: Function,
  style?: React.CSSProperties
}


export const TaskBar : React.FC<TaskBarProps> = (
  {
    columnWidth,
    dates,
    model,
    custom_field,
    onGanttEvent,
    ganttRightRef,
    style
  }
) => {
  const timeStep = 300000
  const dateDelta =
    dates[1].getTime() -
    dates[0].getTime() -
    dates[1].getTimezoneOffset() * 60 * 1000 +
    dates[0].getTimezoneOffset() * 60 * 1000;
  const xStep = (timeStep * columnWidth) / dateDelta;

  const tooltipEnter = (e: React.MouseEvent, task: BarTask) => {
    onGanttEvent('tooltip',{event: e, task})
  }
  const tooltipLeave = (e: React.MouseEvent) => {
    const tooltip: any = document.querySelector(".gantt-item-tooltip")
    tooltip.style.display = 'none'
  }

  let x1: number = model.x1;
  let x2: number = model.x2;
  let className: string;
  let classBgName: string;

  const width = x2 - x1;

  if(model.type === 'project'){
    className = 'gantt-task-pro'
    classBgName = 'gantt-task-bar-actual gantt-task-bg-primary'
  } else if(model.type === 'milestone') {
    className = 'gantt-task-bar gantt-task-primary'
    classBgName = 'gantt-task-bar-actual gantt-task-bg-primary'
  } else {
    const color = model.color ? model.color : 'primary'
    className = `gantt-task-bar gantt-task-${color}`
    classBgName = `gantt-task-bar-actual gantt-task-bg-${color}`
  }

  const mouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const target = e.target as HTMLDivElement
    const dragDiv: any = target.parentElement
    dragDiv.style.cursor = 'pointer'

    let offsetX = parseInt(dragDiv.offsetLeft) // 获取当前的x轴距离
    let innerX = e.clientX - offsetX // 获取鼠标在方块内的x轴距

    document.onmousemove = (e: MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      const moveX = e.clientX - innerX
      dragDiv.style.left = moveX + 'px'
      dragDiv.nextSibling.style.left = moveX + 'px'
      const width = dragDiv.nextSibling.clientWidth
      dragDiv.nextSibling.nextSibling.style.left = moveX + width + 3 + 'px'

      const timeStep = 300000
      let start = dateByX(moveX, model.x1 ,model.start,xStep,timeStep)
      let end = dateByX(moveX + width, model.x2 ,model.end,xStep,timeStep)

      model.x1 = moveX
      model.x2 = moveX + width
      model.start = start
      model.end = end

      onGanttEvent('move-bar', model)
    }
    document.onmouseup = () => {
      dragDiv.style.cursor = 'initial'
      document.onmousemove = null
      document.onmouseup = null
    }
  }
  /**
   * 锚点连线
   * @param e
   */
  const drawArrowLine = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const {left,top} = ganttRightRef.current.getBoundingClientRect()
    const scrollX = ganttRightRef.current.scrollLeft
    const scrollY = ganttRightRef.current.scrollTop
    const sX = e.clientX - left + scrollX + ''
    const sY = e.clientY - top + scrollY + ''

    const svgns = "http://www.w3.org/2000/svg";
    const svgDom = document.getElementsByTagName('svg')[0]
    let line = document.createElementNS(svgns, "line");

    line.setAttribute("x1", sX);
    line.setAttribute("y1", sY);
    line.setAttribute("x2", sX);
    line.setAttribute("y2", sY);
    line.setAttribute("stroke", "red");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-dasharray", "4 2");
    line.setAttribute("fill", "none");
    svgDom.appendChild(line);

    document.onmousemove = (e: MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      const eX = e.clientX - left + scrollX + ''
      const eY = e.clientY - top + scrollY + ''

      line.setAttribute("x2", eX);
      line.setAttribute("y2", eY);
    }

    document.onmouseup = (e: MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      line.remove()
      document.onmousemove = null
      document.onmouseup = null
    }
  }

  return (
    <div style={style}>
      <div className={'gantt-body-row-item'}>
        <div
          className={'gantt-task-wrap'}
          style={{left: x1 + 'px'}}
          onMouseDown={mouseDown}
        >
          <div className={classBgName} style={{width: width + 'px'}}></div>
        </div>
        <div className={'gantt-task-wrap'} style={{left: x1 + 'px'}}>
          <div
            className={className} style={{width: width + 'px'}}
            onMouseOver={(e) =>tooltipEnter(e,model)}
            onMouseOut={tooltipLeave}>
            <div className={'prepend'} onMouseDown={drawArrowLine}></div>
            <div className={'append'} onMouseDown={drawArrowLine}></div>
          </div>
        </div>
        <div className={'gantt-task-wrap'} style={{left: x2 + 3 + 'px'}}>
          <div className={'gantt-task-bar-predict'}>
            <div className={'gantt-predict-twill'}></div>
            <div className={'twill-text'}>预计任务工期延后七天</div>
          </div>
        </div>
      </div>
    </div>
  )
}
