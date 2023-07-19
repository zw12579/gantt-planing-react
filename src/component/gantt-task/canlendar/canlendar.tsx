import React, {ReactChild} from "react";
import {DateSetup} from "../../../types/date-setup";
import {ScaleMode} from "../../../types/public-types";
import {getLocaleMonth, getWeekNumberISO8601} from "../helpers/date-helper";
import "./calendar.scss"

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  scaleMode: ScaleMode;
  headerHeight: number;
  columnWidth: number;
};

export const Calendar: React.FC<CalendarProps> = (
  {
    dateSetup,
    locale,
    scaleMode,
    columnWidth
  }
) => {

  const getCalendarValuesForMonth = () => {
    let headerTop: ReactChild[] = []
    let headerBottom: ReactChild[] = []

    const dates = dateSetup.dates;
    const sortedDates: Array<{label: string, dates: Array<string>}> = [];

    for (let i = 0; i < dates.length; i++) {
      const date = dateSetup.dates[i];
      const topValue = date.getFullYear().toString();
      const bottomValue = getLocaleMonth(date, locale);
      headerBottom.push(
        <div className={'month-item'} key={i}>{bottomValue}</div>
      )
      const monthObj = sortedDates.find(t => t.label === topValue)
      if (monthObj === undefined) {
        sortedDates.push({
          label: topValue,
          dates: [
            bottomValue
          ]
        })
      }
      monthObj?.dates.push(bottomValue);
    }
    headerTop = sortedDates.map((item,index) => {
      const width = {
        width : (columnWidth + 1) * item.dates.length - 1 + 'px'
      }
      return (
        <div className={'month-item'} key={index} style={width}>
          {item.label}年
        </div>
      )
    })
    return [headerTop, headerBottom]
  }

  const getCalendarValuesForWeek = () => {
    const headerTop: ReactChild[] = [];
    const headerBottom: ReactChild[] = [];
    let weeksCount: number = 1;
    const dates = dateSetup.dates;

    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = "";
      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        // top
        topValue = `${getLocaleMonth(date, locale)}`;
      }
      const bottomValue = `第${getWeekNumberISO8601(date)}周`;
      headerBottom.push(
        <div className={'week-item'} key={i}>{bottomValue}</div>
      )
      if(topValue){
        if (i !== dates.length - 1) {
          const width = {
            width : (columnWidth + 1) * weeksCount - 1 + 'px'
          }
          headerTop.push(
            <div className={'month-item'} key={i} style={width}>{topValue}</div>
          )
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [headerTop.reverse(), headerBottom.reverse()]
  }

  const getCalendarValuesForDay = () => {
    const dates = dateSetup.dates;
    const sortedDates: Array<{label: string, dates: Array<string>}> = [];
    const days: string[] = []
    dates.map(date => {
      const month = getLocaleMonth(date, locale);
      days.push(`${date.getDate().toString()}`)
      const monthObj = sortedDates.find(datesByMonth => datesByMonth.label === month)
      if (monthObj === undefined) {
        sortedDates.push({
          label: month,
          dates: [
            `${date.getDate().toString()}`
          ]
        })
        return;
      }
      monthObj.dates.push(`${date.getDate().toString()}`);
    })
    let headerTop: ReactChild[] = []
    let headerBottom: ReactChild[] = []

    headerTop = sortedDates.map((item,index) => {
      const width = {
        width : (columnWidth + 1) * item.dates.length - 1 + 'px'
      }
      return (
        <div className={'month-item'} key={index} style={width}>
          {item.label}
        </div>
      )
    })
    headerBottom = days.map((item, index) => {
      return (
        <div className={'day-item'} key={index}>
          {item}
        </div>
      )
    })

    return [headerTop, headerBottom]
  };

  let headerTop: ReactChild[] = []
  let headerBottom: ReactChild[] = []
  switch (scaleMode) {
    case ScaleMode.Day:
      [headerTop, headerBottom] = getCalendarValuesForDay();
      break;
    case ScaleMode.Week:
      [headerTop, headerBottom] = getCalendarValuesForWeek();
      break;
    case ScaleMode.Month:
      [headerTop, headerBottom] = getCalendarValuesForMonth();
      break;
  }

  return (
    <div className={'header'}>
     <div className={'header-top'}>
       {headerTop}
     </div>
     <div className={'header-bottom'}>
       {headerBottom}
     </div>
    </div>
  )
}
