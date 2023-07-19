import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {Network} from "./network";
import {Task, TreeColumn, ScaleMode, ViewMode} from "../../../types/public-types";
import {setWbsIndex} from "../helpers/bar-helper";
import "./gantt-demo.scss"


const currentDate = new Date();
const tasks: Task[] = [
  {
    id: 1,
    parent_id: 0,
    name: "单项工程一（建筑工程）",
    level: 1,
    duration: 14,
    progress: 25,
    type: "project",
    hideChildren: true,
    start: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 20),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
    children: [
      {
        id: 9,
        parent_id: 1,
        name: "单位工程一（基础工程）",
        level: 2,
        duration: 1.5,
        progress: 45,
        type: "task",
        hideChildren: true,
        project: "ProjectSample",
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          2,
          12,
          28
        ),
        children: [
          {
            id: 10,
            parent_id: 9,
            name: "分部工程一（柱工程）",
            level: 3,
            duration: 1.5,
            progress: 45,
            type: "task",
            project: "ProjectSample",
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              2,
              12,
              28
            ),
            children: []
          },
          {
            id: 12,
            parent_id: 9,
            name: "分部工程二（梁工程）",
            level: 3,
            duration: 1.5,
            progress: 45,
            type: "task",
            hideChildren: true,
            project: "ProjectSample",
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            end: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              2,
              12,
              28
            ),
            children: [
              {
                id: 13,
                parent_id: 12,
                name: "分项工程一（水泥砂浆）",
                level: 4,
                duration: 1.5,
                progress: 45,
                type: "task",
                project: "ProjectSample",
                start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                end: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  2,
                  12,
                  28
                ),
                children: []
              },
              {
                id: 14,
                parent_id: 12,
                name: "分项工程二（石材楼地面）",
                level: 4,
                duration: 1.5,
                progress: 45,
                type: "task",
                project: "ProjectSample",
                start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                end: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  2,
                  12,
                  28
                ),
                children: []
              },
            ]
          },
        ]
      },
      {
        id: 15,
        parent_id: 1,
        name: "单位工程二（装饰装修工程）",
        level: 2,
        duration: 2.5,
        progress: 45,
        type: "task",
        project: "ProjectSample",
        color: "error",
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          3,
          12,
          28
        ),
        children: []
      },
    ]
  },
  {
    id: 2,
    parent_id: 0,
    name: "单项工程二（装饰装修工程）",
    level: 1,
    duration: 1.5,
    progress: 45,
    type: "task",
    project: "ProjectSample",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    end: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      2,
      12,
      28
    ),
    children: []
  },
  {
    id: 3,
    parent_id: 0,
    name: "单项工程三（安装工程）",
    level: 1,
    duration: 2,
    progress: 25,
    dependencies: ["2"],
    type: "task",
    project: "ProjectSample",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
    children: []
  },
  {
    id: 4,
    parent_id: 0,
    name: "单项工程四（安装工程）",
    level: 1,
    duration: 4,
    progress: 10,
    dependencies: ["3"],
    type: "task",
    project: "ProjectSample",
    color: "warning",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
    children: []
  },
  {
    id: 5,
    parent_id: 0,
    name: "单项工程五（安装工程）",
    level: 1,
    duration: 1,
    progress: 2,
    dependencies: ["4"],
    type: "task",
    project: "ProjectSample",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
    children: []
  },
  {
    id: 6,
    parent_id: 0,
    name: "单项工程六（安装工程）",
    level: 1,
    duration: 2,
    type: "task",
    progress: 70,
    dependencies: ["5"],
    project: "ProjectSample",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
    children: []
  },
  {
    id: 7,
    parent_id: 0,
    name: "单项工程七（安装工程）",
    level: 1,
    duration: 7,
    progress: currentDate.getMonth(),
    type: "task",
    dependencies: ["6"],
    project: "ProjectSample",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 11),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
    children: []
  },
  {
    id: 8,
    parent_id: 0,
    name: "单项工程八（安装工程）",
    level: 1,
    duration: 5,
    progress: 0,
    isDisabled: true,
    type: "task",
    color: "success",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    children: []
  },
  {
    id: 16,
    parent_id: 0,
    name: "单项工程九（安装工程）",
    level: 1,
    duration: 5,
    progress: 0,
    isDisabled: true,
    type: "task",
    color: "success",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    children: []
  },
  {
    id: 17,
    parent_id: 0,
    name: "单项工程十（安装工程）",
    level: 1,
    duration: 5,
    progress: 0,
    isDisabled: true,
    type: "task",
    color: "success",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    children: []
  },
  {
    id: 18,
    parent_id: 0,
    name: "单项工程十一（安装工程）",
    level: 1,
    duration: 5,
    progress: 0,
    isDisabled: true,
    type: "task",
    color: "success",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    children: []
  },
  {
    id: 19,
    parent_id: 0,
    name: "单项工程十二（安装工程）",
    level: 1,
    duration: 5,
    progress: 0,
    isDisabled: true,
    type: "task",
    color: "success",
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
    children: []
  },
];

const columnData: TreeColumn[] = [
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

export const GanttDemo: React.FC = () => {
  const history = useHistory()

  const [scaleMode, setScaleMode] = useState(ScaleMode.Day)
  const [scaleIndicator, setScaleIndicator] = useState(0)
  const [viewMode, setViewMode] = useState(ViewMode.GanttViewer)
  const [columnWidth, setColumnWidth] = useState(36)

  const turnTo = () => {
    history.push({pathname: '/network-diagram'})
  }
  const turnToBig = () => {
    history.push({pathname: '/bigdata'})
  }

  /**
   * 切换时间步长 0：日 1：周 2：月
   * @param index
   */
  const changeScaleIndicator = (index: number) => {
    let width: number = 36, mode: ScaleMode = ScaleMode.Day
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
  const newTasks = setWbsIndex(tasks)

  return (
    <div className={'gantt-demo'}>
      <div className="gantt-time">
        <div className="gantt-zoom">
          {
            ['日', '周', '月'].map((item, index) => {
              let className = 'gantt-time-item'
              if (index === scaleIndicator) {
                className += " gantt-time-active"
              }
              return (
                <div className={className} key={index} onClick={() => changeScaleIndicator(index)}>{item}</div>
              )
            })
          }
        </div>
      </div>
      <Network
        taskData={newTasks}
        columnData={columnData}
        scaleMode={scaleMode}
        viewMode={viewMode}
        columnWidth={columnWidth}
      />
    </div>
  )
}
