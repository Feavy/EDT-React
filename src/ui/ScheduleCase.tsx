import React, {Component} from 'react';
import HourData from '../data/HourData';
import CaseData from '../data/CaseData';
import ScheduleSubCase from './ScheduleSubCase'

export default class ScheduleCase extends Component<{data: HourData}> {
    constructor(props: {data:HourData}) {
        super(props);
    }

    render() {
        const {data} = this.props;

        const hourData:Map<string, Map<string, CaseData>> = data.data;

        for(let promo of ["INFO1", "INFO2"]) {
            var lastGroup:string = "1A";
            var last:string|undefined;
            for(let group of ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]) {
                var current:CaseData|undefined = data.getCaseData(promo, group);
                if(current) {
                    current.width = 0;
                    current.visible = false;
            
                    if(group === "1A" || last && current && data.getCaseData(promo, last) &&  current.teacherName != data.getCaseData(promo, last)!.teacherName) {
                        lastGroup = group;
                        current.visible = true;
                    }
            
                    current.width++;
                }
                last = group;
            }
        }

        const groups:string[] = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]; 

        return (
            <div className="schedule-case">
                {groups.map(group => <ScheduleSubCase data={data.getCaseData("INFO1", group)}/>)}
                <br/>
                {groups.map(group => <ScheduleSubCase data={data.getCaseData("INFO2", group)}/>)}
            </div>
        );
    }

    private formatTime(time:number):string {
        const hours:number = Math.floor(time / 60);
        const min:number = time % 60;
        return ('0' + hours).slice(-2) + "h" + ('0' + min).slice(-2)
    }
}