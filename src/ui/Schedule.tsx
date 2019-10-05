import React, {Component} from 'react';
import ScheduleData from '../data/ScheduleData';
import ScheduleDay from './ScheduleDay';
import Filter from '../data/Filter';

export default class Schedule extends Component<{data:ScheduleData, filter:Filter}, {}> {
    constructor(props: {data:ScheduleData, filter:Filter}) {
        super(props);
    }

    render() {
        const {data, filter} = this.props;
        return (
            <div className="schedule">
                {data.daysData.map((day, i) => <ScheduleDay day={i} data={day} filter={filter} key={i}/>)}
            </div>
        );
    }
}