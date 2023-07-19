import React, {useEffect, useRef, useState} from "react";
import "./gantt-task.scss"
import {GanttProps, ScaleMode, Task, TreeColumn, ViewMode} from "../../../types/public-types";
import {Calendar, CalendarProps} from "../canlendar/canlendar";
import {DateSetup} from "../../../types/date-setup";
import {ganttDateRange, seedDates} from "../../gantt-task/helpers/date-helper";
import {Column} from "../../drag-tree-table/column";
import NetworkGantt from "./network-gantt";

export const Network: React.FunctionComponent<GanttProps> = (
  {
    taskData, // 任务树形数据
    columnData, // 任务展示字段
    headerHeight = 50, // 头部高度
    columnWidth = 260, // 时间步长宽度 day: 36 week: 144 month: 260
    scaleMode = ScaleMode.Month, // 时标步长类型
    viewMode = ViewMode.GanttViewer, // 视图展示类型
    preStepsCount = 1,
    locale = "en-GB"
  }
) => {
  const [columnHeader, setColumnHeader] = useState(columnData)
  const rowHeight = 56;
  const isdraggable = true;
  const [tasks, setTasks] = React.useState<Task[]>(taskData); // 原始数据
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const [startDate, endDate] = ganttDateRange(tasks, scaleMode, preStepsCount);
    return {scaleMode, dates: seedDates(startDate, endDate, scaleMode)};
  }); // 日期刻度

  const ganttHeadRef: any = useRef();
  const calendarRef: any = useRef();
  const ganttFSplitRef: any = useRef();
  const ganttFooterRef: any = useRef();
  const networkAdmRef: any = useRef();
  const networkGantRef: any = useRef();
  const networkPdmRef: any = useRef();

  const dates = dateSetup.dates;
  const ganttMainWidth = dates.length * (columnWidth + 1) - 1 + 'px'
  const calendarProps: CalendarProps = {
    dateSetup,
    locale,
    scaleMode,
    headerHeight,
    columnWidth,
  };
  const customField = {
    id: 'id',
    parent_id: 'parent_id',
    order: 'order',
    children: 'children',
    open: 'hideChildren',
    checked: 'checked',
    highlight: 'highlight'
  }

  const onResizeX = (column: TreeColumn, moveWidth: number) => {
    const newHeader = columnData.map(item=>{
      if(item.field === column.field){
        item.width = moveWidth
      }
      return item
    })
    setColumnHeader(newHeader)
  }

  useEffect(() => {
    const [startDate, endDate] = ganttDateRange(tasks, scaleMode, preStepsCount);
    let newDates = seedDates(startDate, endDate, scaleMode);
    setDateSetup({ dates: newDates, scaleMode });
    // 中间试图区域滚动条判断，滚动到最右边有个偏移bug
    // const targetM: any = document.querySelector('.gantt-body-main')
    // if(visibleHeight < virtualHeight) {
    //   targetM.style.marginRight = '-7px'
    // } else {
    //   targetM.style.marginRight = '1px'
    // }
    // targetM.addEventListener("mousewheel",()=>{
    //   // 触控板手势滚动处理
    //   calendarRef.current.scrollLeft = ganttRightRef.current.scrollLeft
    //   ganttFooterRef.current.scrollLeft = ganttRightRef.current.scrollLeft
    // })
  }, [tasks,viewMode, columnWidth])

  const handleRightScroll = () => {
    calendarRef.current.scrollLeft = ganttFooterRef.current.scrollLeft
    if(networkAdmRef.current){
      networkAdmRef.current.scrollTo(ganttFooterRef.current.scrollLeft)
    }
    if(networkGantRef.current){
      networkGantRef.current.scrollTo(ganttFooterRef.current.scrollLeft)
    }
    if(networkPdmRef.current){
      networkPdmRef.current.scrollTo(ganttFooterRef.current.scrollLeft)
    }
  }

  const columns = columnHeader.map((item, index) => {
    return (
      <Column key={index} column={item} isHeader={true} onResizeX={onResizeX} />
    )
  })

  return (
    <div className={'gantt-task'}>
      <div className={'task-container'}>
        <div className={'gantt-header'}>
          <div className={'header-l'} ref={ganttHeadRef}>
            <div className={'header-wrap'}>
              {columns}
            </div>
          </div>
          <div className={'header-m'}></div>
          <div className={'header-r'} ref={calendarRef}>
            <Calendar {...calendarProps} />
          </div>
        </div>
        {
          viewMode === ViewMode.GanttViewer && (
            <NetworkGantt
              ref={networkGantRef}
              tasks={tasks}
              columnWidth={columnWidth}
              rowHeight={rowHeight}
              dateSetup={dateSetup}
              columnData={columnHeader}
              calendarRef={calendarRef}
              ganttFooterRef={ganttFooterRef}
              ganttHeadRef={ganttHeadRef}
              ganttFSplitRef={ganttFSplitRef}
            />
          )
        }
        <div className={'gantt-footer'}>
          <div className={'footer-l'} ref={ganttFSplitRef}></div>
          <div className={'footer-m'}></div>
          <div className={'footer-r'} ref={ganttFooterRef} onScroll={handleRightScroll}>
            <div className={'scrollbar'} style={{width: ganttMainWidth}}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
