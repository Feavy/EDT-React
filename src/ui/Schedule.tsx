import React, {Component} from 'react';
import ScheduleData from '../data/ScheduleData';
import ScheduleDay from './ScheduleDay';
import Filter from '../data/Filter';

export default class Schedule extends Component<{data:ScheduleData, filter:Filter}, {}> {
    constructor(props: {data:ScheduleData, filter:Filter}) {
        super(props);
    }

    render() {
        const hours = [["08h00", "09h25"],
        ["09h30", "10h55"],
        ["11h05", "12h30"],
        //[,],
        ["14h15", "15h40"],
        ["15h45", "17h10"],
        ["17h15", "18h40"]];

        const {data, filter} = this.props;
        return (
            <div className="schedule">
                <div>
                    <h2>&nbsp;</h2>
                    {hours.map(hour => (
                        <div className="schedule-case info">
                            <p>{hour[0]}</p>
                            <p>{hour[1]}</p>
                        </div>
                    ))}
                </div>
                {data.daysData.map((day, i) => <ScheduleDay day={i} data={day} filter={filter} key={i}/>)}
                <div>
                    <h2>&nbsp;</h2>
                    {hours.map(hour => (
                        <div className="schedule-case info">
                            <p>1A</p>
                            <p>2A LP</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}