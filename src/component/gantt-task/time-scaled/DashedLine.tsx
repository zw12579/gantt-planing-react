import React, {ReactElement} from "react";
import {DoubleData, VirtualNode} from "../../../types/bar-task";
import {getUuid} from "../helpers/bar-helper";

interface DashedLineProps {
  model: VirtualNode
}

export const DashedLine: React.FunctionComponent<DashedLineProps> = (
  {
    model
  }
) => {
  const svgEle: ReactElement[] = []

  let sX = (model?.sX || 0) - 5
  let sY = (model?.sY || 0)
  let eX = (model?.eX || 0) - 3
  let eY = (model?.eY || 0)

  let i = -33;
  if(sY > eY) i = -7;
  sY = sY - 21;
  eY = eY + i;

  let path = '';

  if(sY === eY) {
    path = `
     M ${sX} ${sY}
     h ${eX - sX}
    `
  } else {
    path = `
     M ${sX} ${sY}
     h ${eX - sX}
     v ${eY - sY}
    `
    if(model.flag) {
      path = `
       M ${sX} ${sY}
       h ${eX - sX}
       v ${eY - sY}
      `
    } else if(sX >= eX){
      path = `
        M ${sX} ${sY}
        h ${5}
        v ${(eY - sY)/2}
        h ${eX - sX}
        v ${(eY - sY)/2}
      `
    }
  }
  svgEle.push(<path key={getUuid()} strokeWidth="1.5" d={path} strokeDasharray="2 2" fill="none" />)
  return (
    <g className="arrow" fill="grey" stroke="grey">
      {svgEle}
    </g>
  )
}
