import React, {Component} from 'react';
import CaseData from '../data/CaseData';

export default class ScheduleSubCase extends Component<{data: CaseData|undefined}> {
    constructor(props: {data:CaseData|undefined}) {
        super(props);
    }

    render() {
        const {data} = this.props;

        if(!data)
            return (
                <div className="schedule-sub-case">
                </div>
            );

        return (
            <div className="schedule-sub-case" style={{backgroundColor: data.bgColor, color: data.txtColor, width: (data.width/8)*100+"%"}}>
                <p>{data.unitName}</p>
                <p>{data.teacherName}</p>
                <p>{data.roomName}</p>
            </div>
        );
    }
}