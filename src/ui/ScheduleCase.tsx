import React, {Component} from 'react';
import HourData from '../data/HourData';
import CaseData, { EMPTY } from '../data/CaseData';
import ScheduleSubCase from './ScheduleSubCase'
import Filter from '../data/Filter';

export default class ScheduleCase extends Component<{data: HourData, filter:Filter}> {
    constructor(props: {data:HourData, filter:Filter}) {
        super(props);
    }

    render() {
        const {data, filter} = this.props;

        const maxWidth = {"INFO1": 0, "INFO2": 0};

        for(let promo of ["INFO1", "INFO2"]) {
            var lastCase:CaseData|undefined = undefined;
            for(let group of ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]) {
                var current:CaseData = data.getCaseData(promo, group);

                if(filter.isGroupVisible(promo, group)) {
                    if(promo == "INFO1" || promo == "INFO2")
                        maxWidth[promo]++;

                    current.width = 1;
            
                    if(lastCase && lastCase.teacherName === current.teacherName) {
                        lastCase.width++;
                        current.width = 0; 
                    } else {
                        lastCase = current;
                    }
                } else {
                    current.width = 0;
                    lastCase = current;
                }
            }
        }

        const groups:string[] = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]; 

        return (
            <div className="schedule-case">
                {groups.map(group => <ScheduleSubCase width={maxWidth['INFO1']} data={data.getCaseData("INFO1", group)}/>)}
                <br/>
                {groups.map(group => <ScheduleSubCase width={maxWidth['INFO2']} data={data.getCaseData("INFO2", group)}/>)}
            </div>
        );
    }

    private formatTime(time:number):string {
        const hours:number = Math.floor(time / 60);
        const min:number = time % 60;
        return ('0' + hours).slice(-2) + "h" + ('0' + min).slice(-2)
    }
}