export enum ScaleMode {
  Hour = "Hour",
  QuarterDay = "Quarter Day",
  HalfDay = "Half Day",
  Day = "Day",
  /** ISO-8601 week */
  Week = "Week",
  Month = "Month",
  QuarterYear = "QuarterYear",
  Year = "Year",
}

export enum ViewMode {
  GanttViewer = "Gantt", // 甘特图
  TimeViewer = "Time",  // 时标网络图
  AdmViewer = "ADM",  // 箭线图（双代号）
  PdmViewer = "PDM" // 前导图（单代号、PERT图）
}

export type TaskType = "task" | "milestone" | "project";
export interface Task {
  id: number;
  wbs?: string;
  _index?: number;
  level?: number;
  parent_id: number;
  type: string;
  name: string;
  duration: number
  start: Date;
  end: Date;
  progress: number;
  isDisabled?: boolean;
  project?: string;
  dependencies?: string[];
  hideChildren?: boolean;
  display?: boolean;
  color?: string;
  datas?: { id: string, type: string }[];
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
  children: Task[]
}

export interface TreeData {
  columns: TreeColumn[],
  lists: TreeRow[]
}

export interface TreeColumn {
  type?: string,
  title: string,
  field: string,
  width?: number,
  align: string,
}
export interface TreeRow {
  id: number,
  parent_id: number,
  order: number,
  name: string,
  open?: boolean,
  start_date: string
  lists: TreeRow[] | null
}

export interface EventOption {
  /**
   * Time step value for date changes.
   */
  timeStep?: number;
  /**
   * Invokes on bar select on unselect.
   */
  onSelect?: (task: Task, isSelected: boolean) => void;
  /**
   * Invokes on bar double click.
   */
  onDoubleClick?: (task: Task) => void;
  /**
   * Invokes on bar click.
   */
  onClick?: (task: Task) => void;
  /**
   * Invokes on end and start time change. Chart undoes operation if method return false or error.
   */
  onDateChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on progress change. Chart undoes operation if method return false or error.
   */
  onProgressChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on delete selected task. Chart undoes operation if method return false or error.
   */
  onDelete?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on expander on task list
   */
  onExpanderClick?: (task: Task) => void;
}

export interface DisplayOption {
  scaleMode?: ScaleMode;
  viewMode?: ViewMode;
  viewDate?: Date;
  preStepsCount?: number;
  /**
   * Specifies the month name language. Able formats: ISO 639-2, Java Locale
   */
  locale?: string;
  rtl?: boolean;
}

export interface StylingOption {
  headerHeight?: number;
  columnWidth?: number;
  listCellWidth?: string;
  rowHeight?: number;
  ganttHeight?: number;
  barCornerRadius?: number;
  handleWidth?: number;
  fontFamily?: string;
  fontSize?: string;
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  barFill?: number;
  barProgressColor?: string;
  barProgressSelectedColor?: string;
  barBackgroundColor?: string;
  barBackgroundSelectedColor?: string;
  projectProgressColor?: string;
  projectProgressSelectedColor?: string;
  projectBackgroundColor?: string;
  projectBackgroundSelectedColor?: string;
  milestoneBackgroundColor?: string;
  milestoneBackgroundSelectedColor?: string;
  arrowColor?: string;
  arrowIndent?: number;
  todayColor?: string;
  TooltipContent?: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
  TaskListHeader?: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }>;
  TaskListTable?: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    /**
     * Sets selected task by id
     */
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
  }>;
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  taskData: Task[];
  columnData: TreeColumn[];
}

export interface GroupScaled {
  id: number,
  data: number[]
}

export interface ProjectTask {
  id: number,
  project_id: number,
  task_unique_id: number,
  parent: string,
  task_type: string,
  task_outline_level: number,
  text: string,
  duration: number,
  start_date: string,
  task_finish_date: string,
  task_predecessors: string,
  task_operator: unknown,
  progress: number,
  datas: { id: string, type: string }[],
  dependencies: string[],
  children: ProjectTask[]
}
