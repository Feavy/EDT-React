import React, {Component} from 'react';
import HourData from '../data/HourData';
import CaseData, { EMPTY } from '../data/CaseData';
import ScheduleSubCase from './ScheduleSubCase'
import Filter from '../data/Filter';
import NewsData from '../data/NewsData';

export default class ScheduleInfoCase extends Component<{data: NewsData}> {
    constructor(props: {data: NewsData, lineAmount?: number}) {
        super(props);
    }

    render() {
        const {data} = this.props;

        if(!data) {
            return (
                <div className="schedule-case schedule-info-case">
                </div>
            );
        }

        return (
            <div className="schedule-case schedule-info-case shadow" style={{backgroundColor: data.lines[0].bgColor, color: data.lines[0].txtColor}}>
                <div>
                    {data.lines.map(line => line.url ?
                    <a href={line.url} target="_blank" style={{color: line.txtColor}}>{line.content}</a>
                    :
                    <p style={{color: line.txtColor}}>{line.content}</p>)}
                </div>
            </div>
        );
    }
}