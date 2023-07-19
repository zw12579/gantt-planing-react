import { Task } from "./public-types";
import {Interface} from "readline";

export interface BarTask extends Task {
  index: number;
  x1: number;
  x2: number;
  y: number;
}

export interface FlatTask extends Task{
  index: number;
  x1: number;
  x2: number;
  y: number;
}

export interface AdmData {
  id: number,
  name: string,
  x1: number,
  x2: number,
  y: number,
  level: number,
  duration: number,
  number: number[],
  dashed?: number,
  dependencies: string[]
}

export interface CircleCode {
  id: number,
  code: number,
  x: number,
  y: number,
}
export interface ArrowCode {
  id: number,
  name: string,
  duration: number,
  sX: number,
  sY: number,
  eX: number,
  eY: number,
  x1: number,
  x2: number,
  y: number,
}


export interface DoubleData {
  id: number,
  level: number,
  name: string,
  duration: number,
  x1: number,
  x2: number,
  y: number,
  startNode?: number,
  endNode?: number,
  sX?: number,
  sY?: number,
  eX?: number,
  eY?: number,
  initNum?: number, // 首次编号
  virtual?: boolean, // 是否包含虚活动节点
}

export interface VirtualNode {
  startNode: number,
  endNode: number,
  sX?: number,
  sY?: number,
  eX?: number,
  eY?: number,
  flag?: boolean,
}

/*
[
  {id: 1, name: '施工准备', dependencies: [],start: '2023-06-08',end: '2023-06-18'},
  {id: 2, name: '预制场预制锁型预制块', dependencies: ["1"],start: '2023-06-19',end: '2023-07-18'},
  {id: 3, name: '河道清理工程', dependencies: ["1"],start: '2023-06-19',end: '2023-07-23'},
  {id: 4, name: '堤防清基、土方开挖', dependencies: ["2","3"],start: '2023-07-24',end: '2023-08-17'},
  {id: 5, name: '狮山涵拆出重建工程', dependencies: ["2","3"],start: '2023-07-24',end: '2023-09-16'},
  {id: 6, name: '小毛河桥拆除重建工程', dependencies: ["2","3"],start: '2023-07-24',end: '2023-10-11'},
  {id: 7, name: '土方回填碾压', dependencies: ["4"],start: '2023-08-18',end: '2023-09-04'},
  {id: 8, name: '预制块护坡工程', dependencies: ["7"],start: '2023-09-05',end: '2023-10-09'},
  {id: 9, name: '浆砌石基脚、压顶、隔埂工程', dependencies: ["7"],start: '2023-09-05',end: '2023-10-04'},
  {id: 10, name: '新建泥结石防汛道路工程', dependencies: ["5","8","9"],start: '2023-10-10',end: '2023-10-30'},
  {id: 11, name: '草皮护坡工程', dependencies: ["5","8","9"],start: '2023-10-10',end: '2023-10-29'},
  {id: 12, name: '整理资料、完工清场', dependencies: ["6","10","11"],start: '2023-10-31',end: '2023-11-17'},
]
*/
