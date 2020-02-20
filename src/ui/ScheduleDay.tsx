import React, {Component} from 'react';
import DayData from '../data/DayData';
import {Day, dayToString} from '../data/Day';
import ScheduleCase from './ScheduleCase';
import Filter from '../data/Filter';

export default class ScheduleDay extends Component<{day:Day, data: DayData, filter:Filter}, {}> {
    constructor(props: {day:Day, data:DayData, filter:Filter}) {
        super(props);
    }

    render() {
        const {day, data, filter} = this.props;
        return (
            <div className="schedule-column">
                <h2 className="column-title">{dayToString(day)}</h2>
                <div className="groups">
                {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]
                .map(group => <div className="group" style={{
                    flex: !filter.isGroupVisible("INFO1", group) ? "0" : "",
                    width: !filter.isGroupVisible("INFO1", group) ? "0px" : ""
                }}>{group}</div>)}
                </div>
                {data.hoursData.map(hourData => <ScheduleCase data={hourData} filter={filter}/>)}
                <div className="groups">
                {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "LP"]
                .map(group =>  <div className="group" style={{
                    flex: !filter.isGroupVisible("INFO2", group) ? "0" : "",
                    width: !filter.isGroupVisible("INFO2", group) ? "0px" : ""
                }}>{group}</div>)}
                </div>
            </div>
        );
    }
}