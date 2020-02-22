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

    private onInfoClick(elem: EventTarget) {
        const { data } = this.props;
        const modal: any = (<Modal target={elem as HTMLElement} color={data.lines[0].bgColor}>
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
                <div className="schedule-case schedule-info-case shadow" style={{ backgroundColor: data.lines[0].bgColor, color: data.lines[0].txtColor }} onClick={(e) => this.onInfoClick(e.target)}>
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