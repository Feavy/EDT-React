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

        for(let promo of ["INFO1", "INFO2"]) {
            var lastCase:CaseData|undefined = undefined;
            for(let group of ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]) {
                var current:CaseData|undefined = data.getCaseData(promo, group);
                if(current) {
                    current.width = 1;
                    current.visible = false;
            
                    if(lastCase && lastCase!.teacherName === current.teacherName) {
                        lastCase!.width++;
                        current.width = 0; 
                    } else{
                        lastCase = current;
                    }
            
                }
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