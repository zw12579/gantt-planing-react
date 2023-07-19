import React, {ReactElement, useRef, useState} from "react";
import './column.scss'
import {TreeColumn} from "../../types/public-types";
import store from "../../redux/store";

export type ColumnProps = {
  column: TreeColumn;
  model?: any;
  isHeader?: Boolean;
  border?: String;
  onResizeX?: Function
}

export const Column : React.FC<ColumnProps> = (
  {
    column,
    model,
    isHeader,
    border,
    onResizeX
  }
) => {
  const columnRef: any = useRef()
  const [editable,setEditable] = useState(false)
  const className = border !== undefined
    ? 'tree-column border' : 'tree-column'

  const divStyle: React.CSSProperties = {
    width: column.width + 'px'
  }
  const columResize = (e: React.MouseEvent) => {}
  const checkAll = (e: React.MouseEvent) => {}
  const showInput = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    setEditable(true)
  }
  const onChange = () => {
    // 表单值改变
  }
  const onBlur = () => {
    // 表单值改变
    setEditable(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 表单值改变
    if (e.key === 'Enter') {
      store.dispatch({type: 'enter', taskModel: model})
      // 回车增加数据
      console.log(model.id, '回车新增一条空数据')
    }
  }

  const onMoveResize = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    const target = e.target;
    const data = target.getBoundingClientRect()
    document.onmousemove = (e) => {
      e.stopPropagation()
      e.preventDefault()
      const moveX = e.clientX
      const moveWidth = moveX - Math.floor(data.left)
      if(onResizeX) {
        let width = columnRef.current.clientWidth
        onResizeX(column,width + moveWidth)
      }
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
    }
  }

  let renderEle: ReactElement = (<div></div>)
  if (isHeader) {
    const checkboxOrText = column.type == 'checkbox'
      ? <input type="checkbox" className="checkbox" onClick={($event) => checkAll($event)}></input>
      : <span> {column.title} </span>

    renderEle = <div>
      {checkboxOrText}
      <div
        className="resize-line"
        onMouseDown={($event) => columResize($event)}>
      </div>
    </div>
  } else {
    let spaceData: React.ReactElement[] = []
    for (let i = 0; i < model.level - 1; i++) {
      const spaceItem: React.ReactElement = <span className="space" key={i}></span>
      spaceData.push(spaceItem)
    }
    let field = column.field
    let arrow = "zip-icon"
    if(model.children && model.children.length){
      arrow += model.hideChildren ? ' arrow-bottom' : ' arrow-right'
    } else {
      arrow += ' arrow-transparent'
    }
    if(column.type === 'selection'){
      renderEle = (<div className={"space-container"}>
        {spaceData}
        <span className={arrow}></span>
        <span className={'click-area'} onClick={showInput}>{model[field]}</span>
      </div>)
      if(editable) {
        renderEle = (
          <div className={"space-container"}>
          {spaceData}
            <span className={arrow}></span>
            <div className={'wrap-input'}>
              <input
                className={'column-input'}
                type="text"
                autoFocus={true}
                value={model[field]}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={$event=>onKeyDown($event)} />
            </div>
          </div>
        )
      }
    } else if(column.type === 'checkbox'){
      renderEle = <input type="checkbox" />
    } else {
      renderEle = <span className={'click-area'} onClick={showInput}>{model[field]}</span>
      if(editable) {
        renderEle = <div className={'wrap-input'}>
          <input
            className={'column-input'}
            type="text"
            autoFocus={true}
            value={model[field]}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={$event=>onKeyDown($event)} />
        </div>
      }
    }
  }

  return (
    <div
      ref={columnRef}
      className={className}
      style={divStyle}
      onMouseDown={onMoveResize}
    >{renderEle}</div>
  )
}
