import React, {Component} from 'react';
import DayData from '../data/DayData';
import {Day, dayToString} from '../data/Day';
import ScheduleCase from './ScheduleCase';
import Filter from '../data/Filter';

import {dateToString} from "../utils/DateUtils";
import NewsData from '../data/NewsData';
import ScheduleInfoCase from './ScheduleInfoCase';

type ScheduleDayProps = {
    day:Day;
    data: DayData;
    news: NewsData;
    filter:Filter;
    date: Date;
    linesAmount: number;
}

export default class ScheduleDay extends Component<ScheduleDayProps, {}> {
    constructor(props: ScheduleDayProps) {
        super(props);
    }

    render() {
        const {day, data, filter, date, news, linesAmount} = this.props;
        console.log(dateToString(date),news);
        const elems:JSX.Element[] = [];
        data.hoursData.map((hourData, i) => {
                elems.push(<ScheduleCase data={hourData} filter={filter} style={{backgroundColor: i%2 === 0 ? "rgba(0,0,0,0.05)" : ""}}/>);
                if(i == 2) {
                    if(news)
                        elems.push(<ScheduleInfoCase data={news}/>);
                    else if(linesAmount > 0) {
                        const blanks:JSX.Element[] = [];
                        for(var j = 0; j < linesAmount; j++) {
                            blanks.push(<p>&nbsp;</p>)
                        }
                        elems.push(
                        <div className="schedule-case schedule-info-case">
                            {blanks}
                        </div>
                        );
                    }
                }
            }
        );
        return (
            <div className="schedule-column">
                <h2 className="column-title">{dayToString(day) + " "+dateToString(date)}</h2>
                <div className="groups">
                {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]
                .map(group => <div className="group" style={{
                    flex: !filter.isGroupVisible("INFO1", group) ? "0" : "",
                    width: !filter.isGroupVisible("INFO1", group) ? "0px" : ""
                }}>{group}</div>)}
                </div>
                {elems}
                <div className="groups">
                {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]
                .map(group =>  <div className="group" style={{
                    flex: !filter.isGroupVisible("INFO2", group) ? "0" : "",
                    width: !filter.isGroupVisible("INFO2", group) ? "0px" : ""
                }}>{group == "4B" ? "LP" : group}</div>)}
                </div>
            </div>
        );
    }
}