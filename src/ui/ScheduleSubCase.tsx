import React, {Component, ComponentElement} from 'react';
import CaseData from '../data/CaseData';

import App from "../App";
import Modal from "./Modal";
import Teachers from '../data/Teachers';
import Rooms from '../data/Rooms';

export default class ScheduleSubCase extends Component<{data: CaseData|undefined, width:number, availableRooms:string[]}> {
    constructor(props: {data:CaseData|undefined, width:number, availableRooms:string[]}) {
        super(props);
    }

    private _onClick = (target:HTMLDivElement, data:CaseData) => {
        target.style.transition = "none";
        target.style.visibility = "hidden";
        target.classList.remove("shadow");

        const mod:React.ComponentElement<Modal, any> = (
        <Modal  target={target}
                color={target.style.backgroundColor!}
                initialContent={(
                    <div style={{textAlign: "center", color: data.txtColor}} className="">
                        <p>{data.unitName}</p>
                        <p>{data.teacherName}</p>
                        <p>{data.roomName}</p>
                    </div>
                )}>
            <div style={{color: data.txtColor}} className="">
                <h2>Cours</h2>
                <h3>Type : {data.roomType}</h3>
                <h3>Enseignant : {Teachers[data.teacherName].prenom} {Teachers[data.teacherName].nom}</h3>
                <h3>Salle(s) : {Rooms.roomgroups[data.roomName].join(", ")}</h3>
                <h2>Salles disponibles</h2>
                <h3>{this.props.availableRooms.join(", ")}</h3>
            </div>
        </Modal>);
        App.get().addModal(mod);
    };

    render() {
        const {data, width} = this.props;

        if(!data)
            return (
                <div className="schedule-sub-case">
                </div>
            );

        return (
            <div onClick={(e) => data.unitName && this._onClick(e.target as HTMLDivElement, data)} className={"schedule-sub-case "+ ((data.width && data.bgColor) && "shadow")}
            style={{backgroundColor: data.bgColor,
                    color: data.txtColor,
                    width: width === 0 ? 0 : (data.width/width)*100+"%",
                    border: data.roomType === "DS" && data.width > 0 ? "2px solid red" : ""
            }}>
                <div className="subCaseContent">
                    <p>{data.unitName}</p>
                    <p>{data.teacherName}</p>
                    <p>{data.roomName}</p>
                </div>
            </div>
        );
    }
}