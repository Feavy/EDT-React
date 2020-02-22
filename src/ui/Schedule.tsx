import React, { Component } from 'react';
import ScheduleData from '../data/ScheduleData';
import ScheduleDay from './ScheduleDay';
import Filter from '../data/Filter';

import { getDateOfWeek } from '../utils/DateUtils';
import { generateBlanks } from '../utils/UIUtils';

type ScheduleProps = {
    data: ScheduleData;
    filter: Filter;
    week: number;
    year: number;
    dayMode: boolean;
}

export default class Schedule extends Component<ScheduleProps, {}> {
    constructor(props: ScheduleProps) {
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

        const { data, filter, week, year, dayMode } = this.props;

        const dates: Date[] = [];
        for (var i = 0; i < 5; i++) {
            const date = getDateOfWeek(week, year);
            date.setUTCDate(date.getUTCDate() + i + 1);
            dates[i] = date;
        }

        const hourElems: JSX.Element[] = [];
        const infoElems: JSX.Element[] = [];

        hours.forEach((hour,i) => {
            hourElems.push(<div className="schedule-case info">
                <p>{hour[0]}</p>
                <p>{hour[1]}</p>
            </div>);
                
            infoElems.push( <div className="schedule-case info">
                    <p>1A</p>
                    <p>2A&nbsp;LP</p>
                </div>);

            if(i == 2 && data.newsLineAmount > 0) {
                hourElems.push(generateBlanks(data.newsLineAmount));
                infoElems.push(generateBlanks(data.newsLineAmount));
            }
        });

        return (
            <div className="schedule">
                <div>
                    <h2 className="column-title">&nbsp;</h2>
                    {hourElems}
                </div>
                <div className="scheduleContainer" style={dayMode ? { whiteSpace: "nowrap", display: "block", overflowX: "scroll" } : {}}>
                    {data.daysData.map((day, i) => <ScheduleDay entireWidth={dayMode} news={data.newsData[i]} date={dates[i]} day={i} data={day} filter={filter} key={"day"+dates[i]} linesAmount={data.newsLineAmount} />)}
                </div>
                <div>
                    <h2 className="column-title">&nbsp;</h2>
                    {infoElems}
                </div>
            </div>
        );
    }
}