import React, {ReactElement} from "react";
import {DoubleData} from "../../../types/bar-task";
import {getUuid} from "../helpers/bar-helper";

interface ArrowLineProps {
  model: DoubleData
}

export const ArrowLine: React.FunctionComponent<ArrowLineProps> = (
  {
    model
  }
) => {
  const svgEle: ReactElement[] = []

  let y = model.y - 21
  let sX = model?.sX || model.x1
  let sY = model?.sY || model.y
  let eX = model?.eX || model.x2
  let eY = model?.eY || model.y

  let x1 = sX + 16
  let x2 = eX - 16

  let tOffset = 12;
  let sN = 0;
  let lineN = Math.ceil(model.name.length / model.duration); // 换行数
  let textN = Math.ceil(model.name.length / lineN); // 一行字数
  let textY = y;
  let path = '';

  if(sY === model.y) {
    path = `
     M ${x1 - 6} ${sY - 21}
     h ${x2 - x1 + 6}
    `
    if(eY !== model.y){
      path = `
       M ${x1 - 6} ${sY - 21}
       h ${x2 - x1 - 10}
       v ${eY - model.y}
       h 16
      `
      if(model.virtual) {
        path = `
         M ${x1 - 6} ${sY - 21}
         h ${model.x2 - x1}
        `
      }
    }
  } else {
    path = `
     M ${x1 - 5} ${sY - 21}
     h ${5}
     v ${model.y - sY}
     h ${x2 - x1}
    `
    if(eY !== model.y){
      path = `
        M ${x1 - 5} ${sY - 21}
        h ${5}
        v ${model.y - sY}
        h ${x2 - x1 - 5}
        v ${eY - model.y}
        h 6
      `
    }
    if(model.virtual) {
      path = `
        M ${x1 - 5} ${sY - 21}
        h ${5}
        v ${model.y - sY}
        h ${model.x2 - x1}
      `
    }
  }

  if(sX > eX) {
    path = `
      M ${x1 - 5} ${sY - 21}
      h ${5}
      v ${(eY - sY)/2}
      h ${x2 - x1 - 5}
      v ${(eY - sY)/2}
      h ${5}
    `
  }

  const handleSelected = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(e, 22222)
  }

  svgEle.push(<path key={getUuid()} strokeWidth="1.5" d={path} fill="none" />)

  if (model.duration && lineN > 1) {
    let firstN = textY - (lineN * tOffset) + 6
    const tspanEle: ReactElement[] = []
    for (let i = 1; i <= lineN; i++) {
      let txt = model.name.substring(sN, textN * i)
      tspanEle.push(<tspan key={getUuid()} x={x1+2} y={firstN}>{txt}</tspan>)
      firstN = firstN + 12;
      sN = textN * i;
    }
    svgEle.push(<text key={getUuid()} x={x1+2} y={textY - 3} style={{fontSize: '10px', fontWeight: 'normal'}}>{tspanEle}</text>)
  } else {
    svgEle.push(<text key={getUuid()} x={x1+2} y={textY - 3} style={{fontSize: '10px', fontWeight: 'normal'}}>{model.name}</text>)
  }
  svgEle.push(<text key={getUuid()} x={x1+2} y={textY + 13} style={{fontSize: '10px',fontWeight: 'normal'}}>{model.duration}d</text>)


  return (
    <g className="arrow" fill="grey" stroke="grey" onClick={e=>{handleSelected(e)}} >
      {svgEle}
    </g>
  )
}
