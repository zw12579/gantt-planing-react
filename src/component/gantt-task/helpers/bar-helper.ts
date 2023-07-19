import {GroupScaled, ProjectTask, Task} from "../../../types/public-types";
import {AdmData, ArrowCode, BarTask, CircleCode, DoubleData, VirtualNode} from "../../../types/bar-task";

export const convertToBarTasks = (
  tasks: Task[],
  dates: Date[],
  columnWidth: number,
  rowHeight: number
) => {
  let taskBarIndex: number = 0;

  function transformData (task: Task): BarTask {
    const haveChildren = Array.isArray(task.children) && task.children.length > 0;
    const taskBarItemData = convertToBar(task,dates,taskBarIndex,columnWidth,rowHeight)
    taskBarIndex = taskBarIndex + 1;
    const taskBarItem =  {
      ...taskBarItemData,
      children: haveChildren ? task.children.map(t=>transformData(t)) : []
    }
    return taskBarItem
  }

  return tasks.map(t=>transformData(t))
}

export const convertFlatTasks = (
  tasks: Task[],
  dates: Date[],
  columnWidth: number,
  rowHeight: number
) => {
  return tasks.map((item,index) => {
    return convertToBar(item,dates,index,columnWidth,rowHeight)
  })
}

export const convertToBar = (
  task: Task,
  dates: Date[],
  index: number,
  columnWidth: number,
  rowHeight: number,
  reset: boolean = false
): BarTask => {
  let x1: number;
  let x2: number;
  let y: number;

  x1 = taskXCoordinateRTL(task.start, dates, columnWidth);
  x2 = taskXCoordinateRTL(task.end, dates, columnWidth);
  y = taskYCoordinate(index, rowHeight);
  if(reset) y = 0
  x1 = Math.floor(x1)
  x2 = Math.floor(x2)

  return {...task, x1, x2, y, index}
}
export const taskXCoordinate = (xDate: Date, dates: Date[], columnWidth: number) => {
  const index = dates.findIndex(d => d.getTime() >= xDate.getTime()) - 1;
  const remainderMillis = xDate.getTime() - dates[index].getTime();
  const percentOfInterval = remainderMillis / (dates[index + 1].getTime() - dates[index].getTime());
  const x = index * (columnWidth + 1) - 1 + percentOfInterval * (columnWidth + 1);
  return x;
};
export const taskXCoordinateRTL = (
  xDate: Date,
  dates: Date[],
  columnWidth: number
) => {
  let x = taskXCoordinate(xDate, dates, columnWidth);
  x += columnWidth + 1;
  return x;
};
const taskYCoordinate = (
  index: number,
  rowHeight: number
) => {
  const y = index * rowHeight;
  return y;
};

export const dateByX = (
  x: number,
  taskX: number,
  taskDate: Date,
  xStep: number,
  timeStep: number
) => {
  let newDate = new Date(((x - taskX) / xStep) * timeStep + taskDate.getTime());
  newDate = new Date(
    newDate.getTime() +
    (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000
  );
  return newDate;
};

export const getHideChildren = (tasks: Task[], hideId: number[] = []) => {
  for (let item of tasks){
    if(!item.hideChildren){
      if(item.children && item.children.length>0){
        for (let ele of item.children){
          hideId.push(ele.id)
          ele.hideChildren = item.hideChildren
        }
        getHideChildren(item.children, hideId)
      }
    }
  }
  return hideId
}

export const findTreeNode = (tree: Task[], func: Function) : Task | null => {
  for (const node of tree) {
    if (func(node)) return node
    if (node.children) {
      const res: Task | null = findTreeNode(node.children, func)
      if (res) return res
    }
  }
  return null
}

/**
 * @desc: 防抖
 * @param {Function} func
 * @param {Number} delay 延迟时长 (毫秒)
 */
export function debounce(func: any, delay: number) {
  let timeout: any;
  return function () {
    // @ts-ignore
    let context = this; // 指向全局
    let args = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(context, args); // context.func(args)
    }, delay);
  };
}

export const getUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 数组对象按某个属性值排序
 * sort(sortBy('value',false))
 * @param property
 * @param asc
 */
export const sortBy = (property: string, asc: boolean = true) => {
  return function (value1: any, value2:any) {
    let a = value1[property]
    let b = value2[property]
    // 默认升序
    return asc ? a-b : b-a
  }
}

/**
 * 设置WBS编号
 * @param data
 */
export const setWbsIndex = (data: Task[]) => {
  let queue = [...data];
  let loop = 0;
  while (queue.length > 0) {
    loop++
    [...queue].forEach((child, i) => {
      queue.shift()
      if (loop === 1) {
        child.wbs = i + 1 + "";
      }
      if (child.children && child.children.length > 0) {
        for (let ci = 0; ci < child.children.length; ci++) {
          child.children[ci].wbs = child.wbs + "." + (ci + 1)
        }
        queue.push(...child.children)
      }
    })
  }
  return data;
}

/**
 * Project标准数据预处理
 * @param originalData
 */
export const preprocessTasks = (originalData: ProjectTask[]) => {
  let optionData = [];
  function mapTree (data: ProjectTask): Task {
    const haveChildren = Array.isArray(data.children) && data.children.length > 0;
    if(data.start_date === data.task_finish_date) {
      data.start_date = data.start_date + ' 00:00:00'
      data.task_finish_date = data.task_finish_date + ' 23:59:59'
    }
    return {
      id: data.id,
      level: data.task_outline_level || 1,
      parent_id: parseInt(data.parent),
      name: data.text,
      duration: data.duration,
      progress: data.progress,
      type: data.task_type || 'task',
      dependencies: data.dependencies || [],
      hideChildren: true,
      display: true,
      start: new Date(data.start_date),
      end: new Date(data.task_finish_date),
      children: haveChildren ? data.children.map(i => mapTree(i)) : []
    }
  }
  optionData = originalData.map(item => mapTree(item))
  return optionData
}

/**
 * 摊平树形数据，保留children引用类型，方便展开收起
 * @param data
 */
export const flatTreeToList = (data: Task[]) => {
  let resList: Task[] = []
  function travelTree(tree: Task[]) {
    tree.forEach((item) => {
      item.display = true
      resList.push({...item,children: []})
      if (item.children && item.children.length) travelTree(item.children)
    })
  }
  travelTree(data)
  return resList
}

/**
 * 扁平数据转树形数据
 * @param data
 * @param parentId
 */
export const transListToTreeData = (data: Task[]) => {
  let map: any = {};
  data.forEach((node) => {
    map[node.id] = { ...node, children: [] };
  });
  let roots: Task[] = [];
  data.forEach((node) => {
    if (node.parent_id !== null && map[node.parent_id]?.children) {
      map[node.parent_id].children.push(map[node.id]);
    } else {
      roots.push(map[node.id]);
    }
  });
  return roots;
}
/**
 * 树形数据转扁平数据
 * @param data
 * @param parentId
 */
export const transTreeToListData = (data: Task[]) => {
  let resList: Task[] = []
  const travelTree = (tree: Task[]) => {
    tree.forEach((item) => {
      resList.push(item)
      if (item.children && item.children.length) travelTree(item.children)
    })
  }
  travelTree(data)
  return resList
}

/**
 * 查找树结构的指定节点，新增子节点
 * @param id
 * @param tree
 * @param obj
 */
export const appendNodeInTree = (id: number, tree: Task[], obj: Task) => {
  tree.forEach((ele:Task, index: number) => {
    if (ele.id === id) {
      tree.splice(index+1,0,obj)
    } else {
      if (ele.children) {
        appendNodeInTree(id, ele.children, obj)
      }
    }
  })
  return tree
}

export const removeNodeInTree=(treeList: Task[], id: number)=> { // 通过id从数组（树结构）中移除元素
  if (!treeList || !treeList.length) {
    return treeList
  }
  for (let i = 0; i < treeList.length; i++) {
    if (treeList[i].id === id) {
      treeList.splice(i, 1);
      break;
    }
    removeNodeInTree(treeList[i].children, id)
  }
  return treeList
}

export const updateNodeInTree=(treeList: Task[],id: number, obj: Task)=> {
  if (!treeList || !treeList.length) {
    return;
  }
  for (let i = 0; i < treeList.length; i++) {
    if (treeList[i].id == id) {
      treeList[i]= obj;
      break;
    }
    updateNodeInTree(treeList[i].children,id,obj);
  }
}

export const findNodeInTree = (data: Task[], id: number, callback: Function) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      return callback(data[i], i, data)
    }
    if (data[i].children) {
      findNodeInTree (data[i].children, id, callback)
    }
  }
}
