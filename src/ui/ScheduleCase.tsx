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
        const height = {"INFO1": "50%", "INFO2" : "50%"};

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
                    if(!lastCase || lastCase.teacherName !== current.teacherName)
                        lastCase = current;
                }
            }
        }

        const groups:string[] = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]; 

        if(!filter.isPromoVisible("INFO1")) {
            height.INFO1 = "0%";
            height.INFO2 = "100%";
        }else if(!filter.isPromoVisible("INFO2")){
            height.INFO1 = "100%";
            height.INFO2 = "0%";
        }

        return (
            <div className="schedule-case">
                <div className="schedule-case-row" style={
                    {height: height["INFO1"]}
                }>
                {groups.map(group => <ScheduleSubCase width={maxWidth['INFO1']} data={data.getCaseData("INFO1", group)}/>)}
                </div>
                <div className="schedule-case-row" style={
                    {height: height["INFO2"]}
                }>
                {groups.map(group => <ScheduleSubCase width={maxWidth['INFO2']} data={data.getCaseData("INFO2", group)}/>)}
                </div>
            </div>
        );
    }

    private formatTime(time:number):string {
        const hours:number = Math.floor(time / 60);
        const min:number = time % 60;
        return ('0' + hours).slice(-2) + "h" + ('0' + min).slice(-2)
    }
}