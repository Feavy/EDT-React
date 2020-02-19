import React, {Component} from 'react';
import CaseData from '../data/CaseData';

export default class ScheduleSubCase extends Component<{data: CaseData|undefined, width:number}> {
    constructor(props: {data:CaseData|undefined, width:number}) {
        super(props);
    }

    private _onClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        let target:HTMLDivElement = e.target as HTMLDivElement;
        target.style.transition = "none";
        target.style.visibility = "hidden";
        target.classList.remove("shadow");
        target.removeChild(target.lastChild!);
        let big:HTMLDivElement = document.createElement("div");
        big.style.position = "fixed";
        big.style.left = target.getBoundingClientRect().left+"px";
        big.style.top = target.getBoundingClientRect().top+"px";
        big.style.backgroundColor = target.style.backgroundColor;
        big.className = "big";
        big.style.width = target.clientWidth+"px";
        big.style.height = target.clientHeight+"px";
        big.style.zIndex = "11";
        big.style.borderRadius = "5px";
        big.style.transform = "scale(1.1)";
        big.style.transition = "all .5s";
        big.style.boxShadow = "0px 10px 10px rgba(0,0,0,0.3)"
        document.body.appendChild(big);
        console.log("click");
        setTimeout(function() {
            big.style.left = "calc(50% - 250px)";
            big.style.top = "30%";
            big.style.width = "500px";
            big.style.height = "40%";
        }, 0);
    };

    render() {
        const {data, width} = this.props;

        if(!data)
            return (
                <div className="schedule-sub-case">
                </div>
            );

        return (
            <div onClick={this._onClick} className={"schedule-sub-case "+ ((data.width && data.bgColor) && "shadow")}
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