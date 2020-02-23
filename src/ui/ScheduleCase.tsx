import React, {Component} from 'react';
import HourData from '../data/HourData';
import CaseData, { EMPTY } from '../data/CaseData';
import ScheduleSubCase from './ScheduleSubCase'
import Filter from '../data/Filter';
import Rooms from '../data/Rooms';
import Modal from './Modal';
import App from '../App';

export default class ScheduleCase extends Component<{data: HourData, filter:Filter}> {
    private availableRooms:string[] = [];

    constructor(props: {data:HourData, filter:Filter, style:{}}) {
        super(props);
    }

    private showAvailableRooms = (theDiv:HTMLDivElement) => {
        if(theDiv.classList.contains("schedule-sub-case") && theDiv.style.backgroundColor) {
            return;
        }
        if(!theDiv.classList.contains("schedule-case")) {
            this.showAvailableRooms(theDiv.parentElement! as HTMLDivElement);
            return;
        }
        console.log(theDiv);
        var modal:JSX.Element = <Modal target={theDiv} initialContent={<div></div>} color={document.body.style.backgroundColor || "white"} >
            <h2>Salles disponibles</h2>
            <p>{this.availableRooms.join(", ")}</p>
        </Modal>;
        App.get().addModal(modal);
    }

    render() {
        const {data, filter} = this.props;

        const maxWidth = {"INFO1": 0, "INFO2": 0};
        const height = {"INFO1": "50%", "INFO2" : "50%"};

        const busyRooms:string[] = [];

        for(let promo of ["INFO1", "INFO2"]) {
            var lastCase:CaseData|undefined = undefined;
            for(let group of ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]) {
                var current:CaseData = data.getCaseData(promo, group);

                if(filter.isGroupVisible(promo, group) || filter.isCaseVisible(current)) {
                    if(promo == "INFO1" || promo == "INFO2")
                        maxWidth[promo]++;

                    current.width = 1;
                    if(Rooms.roomgroups[current.roomName])
                    busyRooms.push(...Rooms.roomgroups[current.roomName]);
            
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
        
        this.availableRooms = Rooms.roomtypes.any.slice().filter(r => !busyRooms.includes(r)).sort();

        if(maxWidth.INFO1 === 0) {
            height.INFO1 = "0%";
            height.INFO2 = "100%";
        }else if(maxWidth.INFO2 === 0){
            height.INFO1 = "100%";
            height.INFO2 = "0%";
        }

        return (
            <div className="schedule-case" onClick={(e) => this.showAvailableRooms(e.target as HTMLDivElement)}>
                <div className="schedule-case-row" style={
                    {height: height["INFO1"]}
                }>
                {groups.map(group => <ScheduleSubCase availableRooms={this.availableRooms} key={"caseINFO1"+group} width={maxWidth['INFO1']} data={data.getCaseData("INFO1", group)}/>)}
                </div>
                <div className="schedule-case-row" style={
                    {height: height["INFO2"]}
                }>
                {groups.map(group => <ScheduleSubCase availableRooms={this.availableRooms} key={"caseINFO2"+group} width={maxWidth['INFO2']} data={data.getCaseData("INFO2", group)}/>)}
                </div>
            </div>
        );
    }
}