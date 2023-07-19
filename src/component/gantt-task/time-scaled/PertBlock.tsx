import React from "react";

interface ScaledProps {
  index: number
  model: any,
  offsetY?: boolean
}

interface styleProp {
  left: string,
  top?: string
}

export const PertBlock : React.FC<ScaledProps> = ({index,model, offsetY= false}) => {
  let style: styleProp = {left: model.x1 - 130 + 'px'}
  if(offsetY) {
    let top = model.y + 'px'
    style.top = `calc(32% + ${top})`
  }
  return (
    <div className={'gantt-task-circle'} style={style}>
      {/*<span>{index + 1}</span>*/}

      <div className='gantt-item-tooltip'>
        <div className={'tip-header'}>
          <span>{model.name}</span>
        </div>
        <div className={'tip-body'}>
          <p>开始日期：2023-02-21</p>
          <p>预计完成：2023-03-21</p>
          <p>任务时长：5天</p>
          <p>任务责任人：曾伟</p>
          <p>进展：进展中</p>
        </div>
      </div>

      {/*{
        offsetY && (
          <div className={'pert-tooltip'}>
            <div className={'tooltip-header'}>
              <div>ES</div>
              <div>DU</div>
              <div>EF</div>
            </div>
            <div className={'tooltip-middle'}>
              {model.name}
            </div>
            <div className={'tooltip-footer'}>
              <div>LS</div>
              <div>TF</div>
              <div>LF</div>
            </div>
          </div>
        )
      }*/}
    </div>
  )
}
