import React, {Component} from 'react';
import ScheduleData from '../data/ScheduleData';
import ScheduleDay from './ScheduleDay';

export default class Schedule extends Component<{data:ScheduleData}, {}> {
    constructor(props: {data:ScheduleData}) {
        super(props);
    }

    render() {
        const {data} = this.props;
        return (
            <div className="schedule">
                {data.daysData.map((day, i) => <ScheduleDay day={i} data={day} key={i}/>)}
            </div>
        );
    }
}