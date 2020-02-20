import React, {Component} from 'react';
import DayData from '../data/DayData';
import {Day, dayToString} from '../data/Day';
import ScheduleCase from './ScheduleCase';
import Filter from '../data/Filter';

import {dateToString} from "../utils/DateUtils";

type ScheduleDayProps = {
    day:Day;
    data: DayData;
    filter:Filter;
    date: Date;
}

export default class ScheduleDay extends Component<ScheduleDayProps, {}> {
    constructor(props: ScheduleDayProps) {
        super(props);
    }

    render() {
        const {day, data, filter, date} = this.props;
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
                {data.hoursData.map((hourData, i) => <ScheduleCase data={hourData} filter={filter} style={{backgroundColor: i%2 === 0 ? "rgba(0,0,0,0.05)" : ""}}/>)}
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