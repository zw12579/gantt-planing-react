import React from "react";
import {Task, TreeColumn} from "../../../types/public-types";
import {Row} from "../../drag-tree-table/row";
import {DateSetup} from "../../../types/date-setup";
import {
  appendNodeInTree,
  convertFlatTasks,
  convertToBar, convertToBarTasks, findNodeInTree,
  flatTreeToList, removeNodeInTree, taskXCoordinate,
  transListToTreeData,
  transTreeToListData
} from "../helpers/bar-helper";
import {BarTask} from "../../../types/bar-task";
import {TaskBar} from "../task-bar/taskBar";
import {LinkLine} from "../task-bar/linkLine";
import func from "../../drag-tree-table/func";
import store from "../../../redux/store";

interface Props {
  tasks: Task[],
  columnWidth: number,
  rowHeight: number,
  dateSetup: DateSetup,
  columnData: TreeColumn[],
  calendarRef: any,
  ganttFooterRef: any,
  ganttHeadRef: any,
  ganttFSplitRef: any,
}

interface State {
  xStep: number,
  tasks: Task[],
  visibleCount: number,
  itemSize: number,
  screenHeight: number,
  listHeight: number,
  startOffset: number,
  startIndex: number,
  endIndex: number,
  ganttMainWidth: number,
  visibleData: Task[],
  bufferScale: number,
  flatTasks: Task[],
  ganttTasks: Task[],
  flatBarTasks: BarTask[],
  barTasks: BarTask[],
  dragX: number,
  dragY: number,
  activeTaskId: number,
  cutTaskId: number,
  copyTaskId: number,
  targetId: string | null | undefined,
  whereInsert: string
  folder: boolean
}

const customField = {
  id: 'id',
  parent_id: 'parent_id',
  order: 'order',
  children: 'children',
  open: 'hideChildren',
  checked: 'checked',
  highlight: 'highlight'
}

class NetworkGantt extends React.Component<Props, State> {
  ganttBodyRef: any
  ganttRightRef: any
  ganttLeftRef: any
  ganttFlagRef: any
  maxId: number = 0
  constructor(props: Props) {
    super(props);
    const ganttMainWidth = props.dateSetup.dates.length * (props.columnWidth + 1) - 1
    this.state = {
      xStep: 0,
      tasks: props.tasks,
      visibleCount: 0,
      itemSize: 56,
      listHeight: 0,
      screenHeight: 0,
      startOffset: 0,
      startIndex: 0,
      endIndex: 0,
      bufferScale: 1,
      visibleData: [],
      ganttMainWidth: ganttMainWidth,
      ganttTasks: [],
      flatTasks: [],
      flatBarTasks: [],
      barTasks: [],
      dragX: 0,
      dragY: 0,
      targetId: undefined,
      whereInsert: '',
      activeTaskId: 0,
      cutTaskId: 0,
      copyTaskId: 0,
      folder: false,
    };
    this.ganttBodyRef = React.createRef();
    this.ganttLeftRef = React.createRef();
    this.ganttRightRef = React.createRef();
    this.ganttFlagRef = React.createRef();
    this.drag = this.drag.bind(this);
    this.drop = this.drop.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.GanttEvent = this.GanttEvent.bind(this);
    this.scrollEvent = this.scrollEvent.bind(this);
    this.handleLeftScroll = this.handleLeftScroll.bind(this);
    this.mouseMoveScroll = this.mouseMoveScroll.bind(this);
    this.onEnterData = this.onEnterData.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.mouseMoveSplit = this.mouseMoveSplit.bind(this);
    this.mouseMoveFlag = this.mouseMoveFlag.bind(this);
    this.hideTaskPanel = this.hideTaskPanel.bind(this);
    store.subscribe(()=>{
      const enterData = store.getState().networkGantt
      this.onEnterData(enterData.taskModel)
    })
  }
  componentDidMount() {
    const ganttTasks = convertToBarTasks(
      this.state.tasks,this.props.dateSetup.dates,
      this.props.columnWidth,this.props.rowHeight
    );
    const flatTaskData = flatTreeToList(this.state.tasks);
    const idArr = Array.from(flatTaskData,t=>t.id)
    this.maxId = Math.max(...idArr)
    const flatBarTasks = convertFlatTasks(
      flatTaskData, this.props.dateSetup.dates,
      this.props.columnWidth, this.props.rowHeight
    );
    const virtualHeight: number = flatTaskData.length * this.state.itemSize + 10;
    const screenHeight: number = this.ganttBodyRef.current.clientHeight;
    const visibleCount: number = Math.ceil(screenHeight / this.state.itemSize);
    let endIndex = this.state.startIndex + visibleCount;
    this.setState({
      listHeight: virtualHeight,
      screenHeight: screenHeight,
      visibleCount: visibleCount,
      endIndex: endIndex,
      ganttTasks: ganttTasks,
      flatTasks: flatTaskData,
      flatBarTasks: flatBarTasks,
    })
    document.addEventListener('keydown',this.handleKeyDown);
  }
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    if(
      prevState.endIndex !== this.state.endIndex ||
      prevState.flatTasks !== this.state.flatTasks
    ){
      this.handleVisibleData();
    }
    if(
      prevProps.columnWidth !== this.props.columnWidth ||
      prevState.tasks !== this.state.tasks ||
      prevProps.dateSetup.scaleMode !== this.props.dateSetup.scaleMode
    ){
      this.watchColumnChange()
    }
  }
  componentWillUnmount() {
    document.removeEventListener('keydown',this.handleKeyDown);
  }
  watchColumnChange(){
    const ganttMainWidth = this.props.dateSetup.dates.length * (this.props.columnWidth + 1) - 1
    const flatTaskData = flatTreeToList(this.state.tasks);
    const flatBarTasks = convertFlatTasks(
      flatTaskData, this.props.dateSetup.dates,
      this.props.columnWidth, this.props.rowHeight
    );
    this.setState({
      ganttMainWidth: ganttMainWidth,
      flatTasks: flatTaskData,
      flatBarTasks: flatBarTasks,
    })
  }
  handleVisibleData() {
    let showList = this.state.flatTasks
    let aboveCount = Math.min(this.state.startIndex, this.state.bufferScale * this.state.visibleCount);
    let belowCount = Math.min(showList.length - this.state.endIndex, this.state.bufferScale * this.state.visibleCount);
    let start = this.state.startIndex - aboveCount;
    let end = this.state.endIndex + belowCount;
    let visibleData = showList.slice(start, end)
    const tempVisibleData = visibleData.filter(t => t.display)
    let listHeight = tempVisibleData.length * this.state.itemSize
    let barTasks = tempVisibleData.map((item, index) => {
      return convertToBar(item, this.props.dateSetup.dates, index, this.props.columnWidth, this.props.rowHeight)
    })
    const flatBarTasks = convertFlatTasks(
      tempVisibleData, this.props.dateSetup.dates,
      this.props.columnWidth, this.props.rowHeight
    );
    let ganttTasks =  transListToTreeData(visibleData)
    this.setState({
      listHeight: listHeight,
      ganttTasks: ganttTasks,
      visibleData: visibleData,
      barTasks: barTasks,
      flatBarTasks: flatBarTasks,
    })
    const ganttViewer: any = document.querySelector('.gantt-body-main')
    if(ganttViewer.scrollHeight - 10 > listHeight) {
      ganttViewer.style.marginRight = '1px'
    } else {
      ganttViewer.style.marginRight = '-7px'
    }
  }
  handleKeyDown(e: KeyboardEvent){
    switch (e.key){
      case 'Tab':
        const currentTaskId = this.state.activeTaskId
        if(e.shiftKey) {
          // shift + tab 升级
          const currentTask = this.state.flatTasks.find(t=>t.id === currentTaskId)
          if(currentTask) {
            const parentId = currentTask.parent_id
            if(parentId) {
              findNodeInTree(this.state.tasks,parentId,(item:Task,index:number,data:Task[])=>{
                removeNodeInTree(this.state.tasks,currentTaskId)
                let level = item.level || 0
                currentTask.level = level
                currentTask.parent_id =  item.parent_id
                const newTasks = appendNodeInTree(parentId,this.state.tasks,currentTask)
                this.setState({
                  tasks: newTasks
                })
                this.watchColumnChange()
              })
            }
          }
        } else {
          // tab 降级
          findNodeInTree(this.state.tasks,currentTaskId,(item:Task,index:number,data:Task[])=>{
            if(index > 0){
              removeNodeInTree(this.state.tasks,currentTaskId)
              let level = item.level || 0
              item.level = level + 1
              item.parent_id =  data[index - 1].id
              data[index - 1].children.push({...item})
              this.setState({
                tasks: this.state.tasks
              })
              this.watchColumnChange()
            }
          })
        }
        break;
      case 'Delete':
        if(this.state.activeTaskId){
          const newTasks = removeNodeInTree(this.state.tasks,this.state.activeTaskId)
          this.setState({
            tasks: newTasks
          })
          this.watchColumnChange()
        }
        break;
      case 'd':
        if(e.ctrlKey && this.state.activeTaskId) {
          if(this.state.activeTaskId){
            const newTasks = removeNodeInTree(this.state.tasks,this.state.activeTaskId)
            this.setState({
              tasks: newTasks
            })
            this.watchColumnChange()
          }
        }
        break;
      case 'z':
        // 历史记录队列、正向队列与反向队列 - 只回退20步、 实时版本（每隔10分钟自动保存一个版本-可选择版本回滚）
        break
      case 'x':
        if (e.ctrlKey && this.state.activeTaskId) {
          const cutTask: any = document.querySelector('.tree-active');
          cutTask.style.opacity = '0.5'; // 剪切修改任务栏透明度
          this.setState({
            cutTaskId: this.state.activeTaskId,
            copyTaskId: 0
          })
        }
        break
      case 'c':
        if (e.ctrlKey && this.state.activeTaskId) {
          this.setState({
            cutTaskId: 0,
            copyTaskId: this.state.activeTaskId
          })
        }
        break
      case 'v':
        if (e.ctrlKey && this.state.activeTaskId && (this.state.cutTaskId || this.state.copyTaskId)) {
          const cutTask: any = document.querySelector('.tree-active');
          cutTask.style.opacity = '1';
          let copyOrCutTaskId = this.state.copyTaskId;
          if(this.state.cutTaskId > 0) copyOrCutTaskId = this.state.cutTaskId;
          findNodeInTree(this.state.tasks, copyOrCutTaskId, (item: Task, index: number, data: Task[]) => {
            if (this.state.cutTaskId > 0) {
              // 剪切移动
              removeNodeInTree(this.state.tasks, this.state.cutTaskId);
            }
            // 复制粘贴
            const pasteGoal = this.state.flatTasks.find(t => t.id === this.state.activeTaskId);
            if (pasteGoal) {
              let level = pasteGoal.level || 0;
              item.level = level;
              item.parent_id = pasteGoal.parent_id;
              const newTasks = appendNodeInTree(this.state.activeTaskId, this.state.tasks, item);
              this.setState({
                tasks: newTasks
              });
              this.watchColumnChange();
            }
          })
        }
        break
    }
  }
  scrollTo(toLeft: number){
    this.ganttRightRef.current.scrollLeft = toLeft
  }
  scrollEvent() {
    let scrollTop = this.ganttBodyRef.current.scrollTop;
    let startIndex = Math.floor(scrollTop / this.state.itemSize);
    let endIndex = startIndex + this.state.visibleCount;
    let startOffset = 0
    if (this.state.startIndex >= 1) {
      let aboveCount = Math.min(this.state.startIndex, this.state.bufferScale * this.state.visibleCount)
      let start = this.state.startIndex - aboveCount
      let size = this.state.startIndex * this.state.itemSize - (start >= 0 ? (start) * this.state.itemSize : 0)
      startOffset = scrollTop - (scrollTop % this.state.itemSize) - size;
    }
    this.setState({
      startIndex: startIndex,
      endIndex: endIndex,
      startOffset: startOffset
    })
  }
  drag(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"
    if (e.pageX === this.state.dragX && e.pageY == this.state.dragY) return;

    this.setState({
      dragX: e.pageX,
      dragY: e.pageY,
    })
    this.filterDrag(e.pageX, e.clientY)
  }
  drop() {
    this.resetTreeData()
  }
  resetTreeData() {
    if (this.state.targetId === undefined) return
    const listKey = customField.children
    const parentIdKey = customField.parent_id
    const idKey = customField.id
    const newList: any = [];
    const curList = this.state.ganttTasks;
    let curDragItem: any = null;
    let targetItem: any = null;

    let targetId = this.state.targetId
    let whereInsert = this.state.whereInsert
    let tasks = this.state.ganttTasks
    let _this = this
    function pushData(curList: any, needPushList: any) {
      for (let i = 0; i < curList.length; i++) {
        const item = curList[i]
        let obj = func.deepClone(item);
        obj[listKey] = []
        if (targetId == item[idKey]) {
          curDragItem = _this.getItemById(tasks, window.dragId);
          targetItem = _this.getItemById(tasks, targetId);
          if (whereInsert === 'top') {
            curDragItem[parentIdKey] = item[parentIdKey]
            needPushList.push(curDragItem)
            needPushList.push(obj)
          } else if (whereInsert === 'center') {
            curDragItem[parentIdKey] = item[idKey];
            obj.open = true;
            curDragItem.level = obj.level + 1
            obj[listKey].push(curDragItem)
            needPushList.push(obj)
          } else {
            curDragItem[parentIdKey] = item[parentIdKey]
            needPushList.push(obj)
            needPushList.push(curDragItem)
          }
        } else {
          if (window.dragId != item[idKey]) {
            needPushList.push(obj)
          }
        }
        if (item[listKey] && item[listKey].length) {
          pushData(item[listKey], obj[listKey])
        }
      }
    }
    pushData(curList, newList)
    this.setState({
      ganttTasks: newList
    })
  }
  getItemById(lists: any, id: any) {
    let curItem = null
    const listKey = customField.children
    const idKey = customField.id

    function getchild(curList: any) {
      for (let i = 0; i < curList.length; i++) {
        let item = curList[i]
        if (item[idKey] == id) {
          curItem = func.deepClone(item)
          break
        } else if (item[listKey] && item[listKey].length) {
          getchild(item[listKey])
        }
      }
    }

    getchild(lists)
    return curItem;
  }
  filterDrag(x: number, y: number){
    const rows: any = document.querySelectorAll('.tree-row')
    this.setState({targetId: undefined})
    const dragRect = window.dragParentNode.getBoundingClientRect();
    const dragW = dragRect.left + window.dragParentNode.clientWidth;
    const dragH = dragRect.top + window.dragParentNode.clientHeight;
    if (x >= dragRect.left && x <= dragW && y >= dragRect.top && y <= dragH) {
      // 当前正在拖拽原始块不允许插入
      return
    }
    // let hoverBlock: any = undefined;
    let targetId: string | null | undefined = undefined;
    let whereInsert: string = '';
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rect = row.getBoundingClientRect();
      const rx = rect.left;
      const ry = rect.top;
      const rw = row.clientWidth;
      const rh = row.clientHeight;
      if (x > rx && x < (rx + rw) && y > ry && y < (ry + rh)) {
        const diffY = y - ry
        const pId = row.getAttribute('tree-p-id');
        // 不允许改变层级结构，只能改变上下顺序逻辑
        targetId = row.getAttribute('tree-id');
        // hoverBlock = row.children[row.children.length - 1]
        let rowHeight = row.offsetHeight
        if (diffY / rowHeight > 3 / 4) {
          whereInsert = 'bottom'
        } else if (diffY / rowHeight > 1 / 4) {
          whereInsert = 'center'
        } else {
          whereInsert = 'top'
        }
        break;
      }
    }
    if (targetId === undefined) {
      // 匹配不到清空上一个状态
      // func.clearHoverStatus();
      whereInsert = '';
      return;
    }
    // hoverBlock.style.display = 'block'
    this.setState({
      targetId: targetId,
      whereInsert: whereInsert
    })
  }
  handleLeftScroll(){}
  mouseMoveScroll(e: any){
    e.stopPropagation()
    e.preventDefault()
    const target = e.target;
    target.style.cursor = 'pointer';
    let offsetX = e.clientX
    let offsetY = e.clientY
    let scrollLeft = this.ganttRightRef.current.scrollLeft
    let scrollTop = this.ganttBodyRef.current.scrollTop
    if(e.ctrlKey) {
      document.onmousemove = (e) => {
        e.stopPropagation()
        e.preventDefault()
        const moveX = e.clientX
        const moveY = e.clientY

        let x = offsetX - moveX
        let y = offsetY - moveY

        this.props.calendarRef.current.scrollLeft = scrollLeft + x;
        this.props.ganttFooterRef.current.scrollLeft = scrollLeft + x;
        this.ganttRightRef.current.scrollLeft = scrollLeft + x;
        this.ganttBodyRef.current.scrollTop = scrollTop + y;
      }
    }
    document.onmouseup = () => {
      target.style.cursor = 'initial'
      document.onmousemove = null
      document.onmouseup = null
    }
  }
  mouseMoveSplit(e: any){
    e.stopPropagation()
    e.preventDefault()

    document.onmousemove = (e) => {
      e.stopPropagation()
      e.preventDefault()
      const moveX = e.clientX
      this.props.ganttHeadRef.current.style.width = moveX + 'px'
      this.props.ganttFSplitRef.current.style.width = moveX + 'px'
      this.ganttLeftRef.current.style.width = moveX + 'px'
    }

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
  mouseMoveFlag(e: any){
    e.stopPropagation()
    e.preventDefault()
    const target = e.target;
    target.style.cursor = 'move';
    document.onmousemove = (e) => {
      e.stopPropagation()
      e.preventDefault()
      const moveX = e.clientX
      const offsetX = this.ganttLeftRef.current.clientWidth
      const scrollLeft = this.ganttRightRef.current.scrollLeft
      this.ganttFlagRef.current.style.left = scrollLeft + moveX - offsetX + 'px'
    }

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
  handleExpand(task: any, flag: boolean) {
    if(flag) {
      this.setTreeStatus(task.children, task.hideChildren)
      const ganttTasks = this.state.ganttTasks.map(t => t)
      const newFlatData = transTreeToListData(ganttTasks)
      this.setState({
        flatTasks: newFlatData,
        ganttTasks: ganttTasks,
      })
    } else {
      this.setState({
        activeTaskId: task.id
      })
    }
  }
  hideTaskPanel() {
    this.setState({
      folder: !this.state.folder
    })
  }
  setTreeStatus(children: Task[], status: boolean) {
    const travel = (list: Task[]) => {
      list.forEach((child) => {
        child.display = status
        if (child.children && child.children.length) {
          // 展开则只展开子集中的isExpand为true的
          // 收拢则全部收拢
          if ((status && child.hideChildren) || !status) travel(child.children)
        }
      })
    }
    travel(children)
  }
  GanttEvent(eventName: string, arg: any){
    switch (eventName) {
      case 'tooltip':
        this.barTooltip(arg);
        break
      case 'move-bar':
        this.onMoveX(arg);
        break;
    }
  }
  onMoveX(task: any) {
    this.setState({
      barTasks: this.state.barTasks.map(t => (t.id === task.id ? task : t))
    })
  }
  barTooltip(arg: any) {
    const {event, task} = arg
    const scrollX =  this.ganttRightRef.current.scrollLeft
    const targetX = event.clientX + scrollX - 477;
    const tooltip: any = document.querySelector(".gantt-item-tooltip")
    tooltip.style.display = 'block'
    const top = task.y
    const left = targetX
    if(top > 181){
      tooltip.style.left = left + 'px'
      tooltip.style.top = top - 161 + 'px'
    } else {
      tooltip.style.left = left + 'px'
      tooltip.style.top = top + 46 + 'px'
    }
    const color = task.color ? task.color : 'primary'
    const tooltipClass = `tip-header gantt-task-${color}`
    tooltip.firstChild.setAttribute("class", tooltipClass)
    tooltip.firstChild.querySelector('span').innerText = task.name
  }
  onEnterData(data: any){
    const currentDate = new Date();
    this.maxId = this.maxId + 1
    const newTask = {
      id: this.maxId,
      parent_id: data.parent_id,
      name: "新建任务",
      level: data.level,
      duration: 1,
      progress: 0,
      type: "task",
      project: "ProjectSample",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay()),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay()+1),
      children: []
    }
    const newData = appendNodeInTree(data.id,this.state.tasks,newTask)
    this.setState({
      tasks: newData
    })
    this.watchColumnChange()
  }
  render() {
    const isdraggable = true
    const today = new Date();
    const todayFlagX = taskXCoordinate(today, this.props.dateSetup.dates, this.props.columnWidth);
    const colLine = this.props.dateSetup.dates.map((item, index) => {
      const xOffset = (this.props.columnWidth + 1) * index - 1 + 'px'
      return (
        <div
          className={'gantt-body-col-item'}
          key={index}
          style={{transform: `translateX(${xOffset})`}}
        ></div>
      )
    })
    const rows = this.state.ganttTasks.map((item,index)=>{
      return (
        <Row
          key={index}
          model={item}
          columns={this.props.columnData}
          isdraggable={isdraggable}
          custom_field={customField}
          activeTaskId={this.state.activeTaskId}
          onExpanderClick={this.handleExpand}
        ></Row>
      )
    })
    const rowBars = this.state.barTasks.map((item, index) => {
      return (
        <TaskBar
          key={index}
          columnWidth={this.props.columnWidth}
          dates={this.props.dateSetup.dates}
          model={item}
          custom_field={customField}
          onGanttEvent={this.GanttEvent}
          ganttRightRef={this.ganttRightRef}
        ></TaskBar>
      )
    })
    const linkLine = this.state.barTasks.map((item, index) => {
      return item.dependencies?.map((ele, eleInd) => {
        const taskFrom = this.state.barTasks.find(t=> t.id === parseInt(ele))
        if(taskFrom) {
          return (
            <LinkLine
              key={`Arrow from ${index} to ${eleInd}`}
              taskFrom={taskFrom}
              taskTo={item}
            />
          )
        }
      })
    })
    const contentElement = (
      <div>
        <div className={'gantt-body-row'} style={{width: this.state.ganttMainWidth}}>
          {rowBars}
          <div className='gantt-item-tooltip'>
            <div className={'tip-header'}>
              <span>功能迭代计划</span>
            </div>
            <div className={'tip-body'}>
              <p>开始日期：2023-02-21</p>
              <p>预计完成：2023-03-21</p>
              <p>任务时长：5天</p>
              <p>任务责任人：曾伟</p>
              <p>进展：进展中</p>
            </div>
          </div>
        </div>
        <div className={'gantt-body-svg'}>
          <svg xmlns="http://www.w3.org/2000/svg">
            {linkLine}
          </svg>
        </div>
      </div>
    )

    return (
      <div ref={this.ganttBodyRef} className={'gantt-body'} onScroll={this.scrollEvent}>
        <div className={'infinite-list-phantom'} style={{height: this.state.listHeight + 'px'}}></div>
        <div className={'gantt-body-wrap'} style={{transform: `translateY(${this.state.startOffset}px)`}}>
          <div
            className={'gantt-body-task'}
            style={{display: this.state.folder ? 'none': 'block'}}
            ref={this.ganttLeftRef}
            onScroll={this.handleLeftScroll}
            onDragOver={this.drag}
            onDragEnd={this.drop}>
            {rows}
          </div>
          <div
            className={'resize-line'}
            onMouseDown={this.mouseMoveSplit}></div>
          <div
            className={'gantt-body-main'}
            ref={this.ganttRightRef}
            onMouseDown={this.mouseMoveScroll}>
            <div
              className={'gantt-check-flag'}
              style={{left: todayFlagX - 3 +'px'}}
              ref={this.ganttFlagRef}>
              <div
                className={'flag-bar'}
                onMouseDown={this.mouseMoveFlag}
              >今天</div>
            </div>
            <div className={'gantt-check-flag-dashed'}>
              <div className={'flag-bar'}>2023-07-14</div>
            </div>
            <div className={'gantt-body-col'}> {colLine} </div>
            {contentElement}
          </div>
        </div>
      </div>
    )
  }
}

export default NetworkGantt
