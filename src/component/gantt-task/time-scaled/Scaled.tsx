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

export const Scaled : React.FC<ScaledProps> = ({index,model, offsetY= false}) => {
  let style: styleProp = {left: model.x1 - 16 + 'px'}
  if(offsetY) {
    let top = model.y + 'px'
    style.top = `calc(40% + ${top})`
  }
  return (
    <div className={'gantt-task-circle'} style={style}>
      <span>{index + 1}</span>
      {
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
      }
    </div>
  )
}
