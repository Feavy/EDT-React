import React, {Component, ComponentElement} from 'react';
import CaseData from '../data/CaseData';

import App from "../App";
import Modal from "./Modal";

export default class ScheduleSubCase extends Component<{data: CaseData|undefined, width:number}> {
    constructor(props: {data:CaseData|undefined, width:number}) {
        super(props);
    }

    private _onClick = (target:HTMLDivElement, data:CaseData) => {
        target.style.transition = "none";
        target.style.visibility = "hidden";
        target.classList.remove("shadow");
        target.removeChild(target.lastChild!);
        const mod:React.ComponentElement<Modal, any> = (
        <Modal  left={target.getBoundingClientRect().left+"px"}
                top={target.getBoundingClientRect().top+"px"}
                width={target.clientWidth+"px"}
                height={target.clientHeight+"px"}
                color={target.style.backgroundColor!}>
            <div style={{textAlign: "center", color: data.txtColor}}>
                <h1>{data.unitName}</h1>
                <h1>{data.teacherName}</h1>
                <h1>{data.roomName}</h1>
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
            <div onClick={(e) => this._onClick(e.target as HTMLDivElement, data)} className={"schedule-sub-case "+ ((data.width && data.bgColor) && "shadow")}
            style={{backgroundColor: data.bgColor,
                    color: data.txtColor,
                    width: width === 0 ? 0 : (data.width/width)*100+"%",
            }}>
                <p>{data.unitName}</p>
                <p>{data.teacherName}</p>
                <p>{data.roomName}</p>
            </div>
        );
    }
}