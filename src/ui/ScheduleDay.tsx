import React, {Component} from 'react';
import DayData from '../data/DayData';
import {Day, dayToString} from '../data/Day';
import ScheduleCase from './ScheduleCase';

export default class ScheduleDay extends Component<{day:Day, data: DayData}, {}> {
    constructor(props: {day:Day, data:DayData}) {
        super(props);
    }

    render() {
        const {day, data} = this.props;
        return (
            <div className="schedule-column">
                <h2 className="column-title">{dayToString(day)}</h2>
                {data.hoursData.map(hourData => <ScheduleCase data={hourData}/>)}
            </div>
        );
    }
}