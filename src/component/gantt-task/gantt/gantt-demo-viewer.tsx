import React, {useState} from "react";
import {Network} from "./network";
import {ScaleMode, Task, TreeColumn, ViewMode} from "../../../types/public-types";
import "./gantt-demo.scss"

const currentDate = new Date();
const PdmTasks: Task[] = [
  {
    id: 1,
    parent_id: 0,
    name: "施工准备",
    duration: 11,
    progress: 25,
    type: "task",
    hideChildren: true,
    start: new Date(currentDate.getFullYear(), 2, 14),
    end: new Date(currentDate.getFullYear(),2, 25),
    children: []
  },
  {
    id: 2,
    parent_id: 0,
    name: "预制场预制锁型预制块",
    duration: 30,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["1"],
    color: "success",
    start: new Date(currentDate.getFullYear(), 2, 25),
    end: new Date(currentDate.getFullYear(),3, 24),
    children: []
  },
  {
    id: 3,
    parent_id: 0,
    name: "河道清理工程",
    duration: 35,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["1"],
    start: new Date(currentDate.getFullYear(), 2, 25),
    end: new Date(currentDate.getFullYear(),3, 29),
    children: []
  },
  {
    id: 4,
    parent_id: 0,
    name: "堤防清基、土方开挖",
    duration: 25,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["2","3"],
    color: "error",
    start: new Date(currentDate.getFullYear(), 3, 29),
    end: new Date(currentDate.getFullYear(),4, 24),
    children: []
  },
  {
    id: 5,
    parent_id: 0,
    name: "狮山涵拆出重建工程",
    duration: 55,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["2","3"],
    start: new Date(currentDate.getFullYear(), 3, 29),
    end: new Date(currentDate.getFullYear(),5, 23),
    children: []
  },
  {
    id: 6,
    parent_id: 0,
    name: "小毛河桥拆除重建工程",
    duration: 80,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["2","3"],
    start: new Date(currentDate.getFullYear(), 3, 29),
    end: new Date(currentDate.getFullYear(),6, 18),
    children: []
  },
  {
    id: 7,
    parent_id: 0,
    name: "土方回填碾压",
    duration: 18,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["4"],
    color: "warning",
    start: new Date(currentDate.getFullYear(), 4, 24),
    end: new Date(currentDate.getFullYear(),5, 11),
    children: []
  },
  {
    id: 8,
    parent_id: 0,
    name: "预制块护坡工程",
    duration: 35,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["7"],
    start: new Date(currentDate.getFullYear(), 5, 11),
    end: new Date(currentDate.getFullYear(),6, 16),
    children: []
  },
  {
    id: 9,
    parent_id: 0,
    name: "浆砌石基脚、压顶、隔埂工程",
    duration: 30,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["7"],
    start: new Date(currentDate.getFullYear(), 5, 11),
    end: new Date(currentDate.getFullYear(),6, 11),
    children: []
  },
  {
    id: 10,
    parent_id: 0,
    name: "新建泥结石防汛道路工程",
    duration: 21,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["5","8","9"],
    start: new Date(currentDate.getFullYear(), 6, 16),
    end: new Date(currentDate.getFullYear(),7, 6),
    children: []
  },
  {
    id: 11,
    parent_id: 0,
    name: "草皮护坡工程",
    duration: 20,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["5","8","9"],
    start: new Date(currentDate.getFullYear(), 6, 16),
    end: new Date(currentDate.getFullYear(),7, 5),
    children: []
  },
  {
    id: 12,
    parent_id: 0,
    name: "整理资料、完工清场",
    duration: 18,
    progress: 25,
    type: "task",
    hideChildren: true,
    dependencies: ["6","10","11"],
    color: "error",
    start: new Date(currentDate.getFullYear(), 7, 6),
    end: new Date(currentDate.getFullYear(),7, 24),
    children: []
  },
]
const columData: TreeColumn[] = [
    {
        type: "selection",
        title: "任务名称",
        field: "name",
        width: 260,
        align: "left"
    },
    {
        title: "计划工期",
        field: "duration",
        width: 100,
        align: "center"
    },
    {
        title: "实际进度",
        field: "progress",
        width: 100,
        align: "center"
    },
]

export const GanttDemoViewer: React.FC = () => {

  const [scaleMode,setScaleMode] = useState(ScaleMode.Day)
  const [viewMode,setViewMode] = useState(ViewMode.GanttViewer)
  const [columnWidth,setColumnWidth] = useState(36)
  const [scaleIndicator,setScaleIndicator] = useState(0)
  const [viewIndicator,setViewIndicator] = useState(0)

  /**
   * 切换时间步长 0：日 1：周 2：月
   * @param index
   */
  const changeScaleIndicator = (index: number) => {
    let width:number = 36, mode: ScaleMode = ScaleMode.Day
    switch (index) {
      case 0:
        width = 36
        mode = ScaleMode.Day
        break
      case 1:
        width = 144
        mode = ScaleMode.Week
        break
      case 2:
        width = 260
        mode = ScaleMode.Month
        break
    }
    setScaleIndicator(index)
    setScaleMode(mode)
    setColumnWidth(width)
  }

  /**
   * 切换视图模式 0：甘特图 1：时标网络图 2：双代号 3：单代号（PERT图）
   * @param index
   */
  const changeViewIndicator = (index: number) => {
    let viewIndicator: number = 0,viewMode: ViewMode = ViewMode.GanttViewer
    switch (index) {
      case 0: // gantt图
        viewIndicator = 0
        viewMode = ViewMode.GanttViewer
        changeScaleIndicator(0)
        break
      case 1: // 时标网络图
        viewIndicator = 1
        viewMode = ViewMode.TimeViewer
        changeScaleIndicator(0)
        break
      case 2: // 箭线图（双代号）
        viewIndicator = 2
        viewMode = ViewMode.AdmViewer
        changeScaleIndicator(2)
        break
      case 3: // 前导图（单代号、PERT图）
        viewIndicator = 3
        viewMode = ViewMode.PdmViewer
        changeScaleIndicator(2)
        break
    }
    setViewIndicator(viewIndicator)
    setViewMode(viewMode)
  }

  return (
    <div className={'gantt-demo'}>
      <div className="gantt-time">
        {/*<div className="gantt-btn">今天</div>*/}
        {
          <div className="gantt-change">
            {
              ['Gant图','时标网络图','双代号','PERT图'].map((item,index)=>{
                let className = 'gantt-change-item'
                if(index === viewIndicator){
                  className += " gantt-time-active"
                }
                return (
                  <div className={className} key={index} onClick={()=>changeViewIndicator(index)}>{item}</div>
                )
              })
            }
          </div>
        }
        <div className="gantt-zoom">
          {
            ['日','周','月'].map((item,index)=>{
              let className = 'gantt-time-item'
              if(index === scaleIndicator){
                className += " gantt-time-active"
              }
              return (
                <div className={className} key={index} onClick={()=>changeScaleIndicator(index)}>{item}</div>
              )
            })
          }
        </div>
      </div>
      <Network
        taskData={PdmTasks}
        columnData={columData}
        scaleMode={scaleMode}
        viewMode={viewMode}
        columnWidth={columnWidth}
      />
    </div>
  )
}
