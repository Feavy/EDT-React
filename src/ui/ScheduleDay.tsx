import React, {Component} from 'react';
import DayData from '../data/DayData';
import {Day, dayToString} from '../data/Day';
import ScheduleCase from './ScheduleCase';
import Filter from '../data/Filter';

import {dateToString} from "../utils/DateUtils";
import NewsData from '../data/NewsData';
import ScheduleInfoCase from './ScheduleInfoCase';
import { generateBlanks } from '../utils/UIUtils';

type ScheduleDayProps = {
    day:Day;
    data: DayData;
    news: NewsData;
    filter:Filter;
    date: Date;
    linesAmount: number;
    entireWidth?:boolean;
}

export default class ScheduleDay extends Component<ScheduleDayProps, {}> {
    constructor(props: ScheduleDayProps) {
        super(props);
    }

    render() {
        const {day, data, filter, date, news, linesAmount, entireWidth} = this.props;
        const elems:JSX.Element[] = [];
        data.hoursData.map((hourData, i) => {
                elems.push(<ScheduleCase key={day+""+i} data={hourData} filter={filter}/>);
                if(i == 2) {
                    if(news)
                        elems.push(<ScheduleInfoCase key={day+"info"} data={news}/>);
                    else if(linesAmount > 0) {
                        elems.push(generateBlanks(linesAmount));
                    }
                }
            }
        );
        return (
            <div className="schedule-column" style={entireWidth ? {width: "100%", display: "inline-block"} : {}}>
                <h2 className="column-title">{dayToString(day) + " "+dateToString(date)}</h2>
                <div className="groups">
                {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]
                .map(group => <div key={"grINFO1"+group} className="group" style={{
                    flex: !filter.isGroupVisible("INFO1", group) ? "0" : "",
                    width: !filter.isGroupVisible("INFO1", group) ? "0px" : ""
                }}>{group}</div>)}
                </div>
                {elems}
                <div className="groups">
                {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]
                .map(group =>  <div key={"grINFO2"+group} className="group" style={{
                    flex: !filter.isGroupVisible("INFO2", group) ? "0" : "",
                    width: !filter.isGroupVisible("INFO2", group) ? "0px" : ""
                }}>{group == "4B" ? "LP" : group}</div>)}
                </div>
            </div>
        );
    }
}