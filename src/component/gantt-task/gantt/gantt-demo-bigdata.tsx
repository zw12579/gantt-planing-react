import React from "react";
import {preprocessTasks} from "../helpers/bar-helper";
import {ScaleMode, Task, TreeColumn, ViewMode} from "../../../types/public-types";
import {Network} from "./network";
interface BigDataProp {
}

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

interface State {
  tasks: Task[];
  scaleMode: ScaleMode;
  viewMode: ViewMode;
  columnWidth: number;
  scaleIndicator: number;
}

class GanttDemoBigdata extends React.Component<BigDataProp,State> {

  constructor(BigDataProp: BigDataProp) {
    super(BigDataProp);
    this.state = {
      tasks: [],
      scaleMode: ScaleMode.Day,
      viewMode: ViewMode.AdmViewer,
      columnWidth: 36,
      scaleIndicator: 0
    };
  }
  componentDidMount() {
    fetch("/network_data.json").then(e => e.json()).then(data=>{
      const preprocessData = preprocessTasks(data.data)
      this.setState({
        tasks: preprocessData
      })
    })
  }
  changeScaleIndicator(index: number) {
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
    this.setState({
      columnWidth: width,
      scaleMode: mode,
      scaleIndicator: index
    })
  }

  render() {
    return (
      <div>
        <div className="gantt-time">
          <div className="gantt-zoom">
            {
              ['日', '周', '月'].map((item, index) => {
                let className = 'gantt-time-item'
                if (index === this.state.scaleIndicator) {
                  className += " gantt-time-active"
                }
                return (
                  <div className={className} key={index} onClick={() => this.changeScaleIndicator(index)}>{item}</div>
                )
              })
            }
          </div>
        </div>
        {
          this.state.tasks.length > 0 && (
            <Network
              taskData={this.state.tasks}
              columnData={columData}
              scaleMode={this.state.scaleMode}
              viewMode={this.state.viewMode}
              columnWidth={this.state.columnWidth}
            />
          )
        }
      </div>
    )
  }
}

export default GanttDemoBigdata
