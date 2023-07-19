import React, {useState} from "react";
import {Column} from "./column";
import {TreeColumn} from "../../types/public-types";
import "./row.scss"
import drag from '../../assets/images/drag.png';

export type RowProps = {
  isdraggable: boolean
  columns: TreeColumn[]
  model: any,
  activeTaskId: number,
  custom_field: {
    id: string,
    parent_id: string,
    order: string,
    children: string,
    open: string,
    checked: string,
    highlight: string,
  },
  onExpanderClick: Function,
  style?: React.CSSProperties
}


export const Row : React.FC<RowProps> = (
  {
    isdraggable = true,
    columns,
    model,
    custom_field,
    onExpanderClick,
    activeTaskId,
    style
  }
) => {
  const dragstart = (e: React.DragEvent<HTMLDivElement>) => {
    const el : any = e.target
    window.dragId = el.querySelector('.tree-row').getAttribute('tree-id');
    window.dragPId = el.querySelector('.tree-row').getAttribute('tree-p-id');
    window.dragParentNode = e.target;
    // el.style.opacity = String(0.8)
  }
  const dragend = (e: React.DragEvent) => {
    // const el = e.target as HTMLDivElement
    // el.style.opacity = String(1);
  }
  const toggle = () => {
    let expand = false
    if(model[custom_field.children] && model[custom_field.children].length){
      model[custom_field.open] = !model[custom_field.open]
      expand = true
    }
    onExpanderClick({ ...model },expand);
  }
  const columnEle = columns.map((item,index) => {
    return (<Column key={index} column={item} model={model}></Column>)
  })

  const rows = model[custom_field.children]?.map((item : TreeColumn, index : number) => {
    return (
      <Row
        key={index}
        columns={columns}
        model={item}
        isdraggable={isdraggable}
        custom_field={custom_field}
        onExpanderClick={onExpanderClick}
        activeTaskId={activeTaskId}
        style={{display: model[custom_field.open] ? 'block' : 'none'}} />
    )
  })
  let treeRowClass = 'tree-row'
  if(model.id === activeTaskId) {
    treeRowClass += ' tree-active'
  }

  return (
    <div
      style={style}
      className="tree-block"
      draggable={isdraggable}
      onDragStart={dragstart}
      onDragEnd={dragend}>
      <div className="tree-wrap">
        <div
          className={treeRowClass}
          onClick={toggle}
          data-level={model.level}
          tree-id={model[custom_field.id]}
          tree-p-id={model[custom_field.parent_id]}
        >
          <div className="row-drag">
            <img src={drag} alt=""/>
          </div>
          {columnEle}
        </div>
      </div>
      {rows}
    </div>
  )
}
