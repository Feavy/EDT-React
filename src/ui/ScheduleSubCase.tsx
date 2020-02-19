import React, {Component} from 'react';
import CaseData from '../data/CaseData';

export default class ScheduleSubCase extends Component<{data: CaseData|undefined, width:number}> {
    constructor(props: {data:CaseData|undefined, width:number}) {
        super(props);
    }

    render() {
        const {data, width} = this.props;

        if(!data)
            return (
                <div className="schedule-sub-case">
                </div>
            );

        return (
            <div className="schedule-sub-case"
            style={{backgroundColor: data.bgColor,
                    color: data.txtColor,
                    width: width === 0 ? 0 : (data.width/width)*100+"%",
                    borderTop: data.width && data.bgColor ? "2px solid "+data.lighterBgColor : "",
                    borderLeft: data.width && data.bgColor ? "2px solid "+data.lighterBgColor : "",
                    borderBottom: data.width && data.bgColor ? "3px solid "+data.darkerBgColor : "",
                    borderRight: data.width && data.bgColor ? "3px solid "+data.darkerBgColor : "",
                    boxSizing: "border-box",
                    borderRadius: "2px"
            }}>
                <p>{data.unitName}</p>
                <p>{data.teacherName}</p>
                <p>{data.roomName}</p>
            </div>
        );
    }
}