import React, { Component } from 'react';
import HourData from '../data/HourData';
import CaseData, { EMPTY } from '../data/CaseData';
import ScheduleSubCase from './ScheduleSubCase'
import Filter from '../data/Filter';
import NewsData from '../data/NewsData';
import Modal from './Modal';
import App from '../App';
import { Color } from 'csstype';

export default class ScheduleInfoCase extends Component<{ data: NewsData }> {
    constructor(props: { data: NewsData, lineAmount?: number }) {
        super(props);
    }

    private onInfoClick(elem: HTMLDivElement) {
        const { data } = this.props;
        if(!elem.classList.contains("schedule-info-case")) {
            this.onInfoClick(elem.parentElement! as HTMLDivElement);
            return;
        }
        const modal: any = (<Modal
            target={elem}
            color={data.lines[0].bgColor}
            initialContent={<p style={{ fontSize: "16px" }}>INFOS</p>}>
            <div style={{ textAlign: "center", color: data.lines[0].txtColor }}>
                {data.lines.map(line => line.url ?
                    <a key={line.content} href={line.url} target="_blank" style={{ color: line.txtColor }}>{line.content}</a>
                    :
                    <p key={line.content} style={{ color: line.txtColor }}>{line.content}</p>)}
            </div>
        </Modal>);
        App.get().addModal(modal);
    }

    render() {
        const { data } = this.props;

        if (!data) {
            return (
                <div className="schedule-case schedule-info-case">
                </div>
            );
        }

        if (window.innerWidth < 640) {
            return (
                <div className="schedule-case schedule-info-case shadow" style={{ backgroundColor: data.lines[0].bgColor, color: data.lines[0].txtColor }} onClick={(e) => this.onInfoClick(e.target as HTMLDivElement)}>
                    <div>
                        {data.lines.map(line => <p key={line.content} style={{ color: line.txtColor }}>{"INFOS"}</p>)}
                    </div>
                </div>
            );
        }

        return (
            <div className="schedule-case schedule-info-case shadow" style={{ backgroundColor: data.lines[0].bgColor, color: data.lines[0].txtColor }}>
                <div>
                    {data.lines.map(line => line.url ?
                        <a key={line.content} href={line.url} target="_blank" style={{ color: line.txtColor }}>{line.content}</a>
                        :
                        <p key={line.content} style={{ color: line.txtColor }}>{line.content}</p>)}
                </div>
            </div>
        );
    }
}