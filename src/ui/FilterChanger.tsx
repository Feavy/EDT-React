import React, { Component } from "react";
import Filter from "../data/Filter";

import App from "../App";
import PromoButtonGroup from "./filter/PromoButtonGroup";

type FilterChangerProps = {
    filter: Filter;
    week: number;
    onChange: (newFilter: Filter) => void;
    teachersName:string[];
    unitsName:string[];
    roomsName:string[];
}

export default class FilterChanger extends Component<FilterChangerProps, {}> {
    private week:number = 0;
    private weekTimeout:NodeJS.Timeout|undefined;

    constructor(props:FilterChangerProps) {
        super(props);
        this.week = props.week;
    }

    private onUnitSelected(unit:string) {
        this.props.filter.unit = unit;
        App.get().filterUpdated();
    }

    private onTeacherSelected(teacher:string){
        this.props.filter.teacher = teacher;
        App.get().filterUpdated();
    }

    private onRoomSelected(room:string){
        this.props.filter.room = room;
        App.get().filterUpdated();
    }

    private previousWeek = () => {
        App.get().setWeek(this.props.week - 1);
    }

    private nextWeek() {
        App.get().setWeek(this.props.week + 1);
    }

    render() {
        const { filter, week, teachersName, unitsName, roomsName } = this.props;
        unitsName.sort();
        teachersName.sort();
        roomsName.sort();
        return (
            <div id="filters">
                <div className="promoButtonGroup">
                    <PromoButtonGroup promo={"INFO1"} filter={filter} groups={["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]}/>
                </div>
                <div className="promoButtonGroup" id="promo2group">
                    <PromoButtonGroup promo={"INFO2"} filter={filter} groups={["1A", "1B", "2A", "2B", "3A", "3B", "4A"]}/>
                    <PromoButtonGroup style={{maxWidth: "40px"}} promo={"LP"} filter={filter} groups={["LP"]}/>
                </div>

                {/* WEEK SELECTION */}
                <div className="filterBlock">
                    <h2>Semaine</h2>
                    <div className="buttonGroup">
                        <input type="submit" value="◀" className="active" onClick={() => this.previousWeek()} />
                        <span id="weekLbl">{week}</span>
                        <input type="submit" value="▶" className="active" onClick={() => this.nextWeek()} />
                    </div>
                </div>

                <div className="filterBlock">
                    <h2>Prof</h2>
                    <select onChange={e => this.onTeacherSelected(e.target.value)}>
                        <option value={undefined} selected={!filter._teacher}>Tous</option>
                        {teachersName.map(name => <option value={name} selected={filter._teacher === name}>{name}</option>)}
                    </select>
                </div>

                <div className="filterBlock">
                    <h2>Salle</h2>
                    <select onChange={e => this.onRoomSelected(e.target.value)}>
                        <option value={undefined} selected={!filter._room}>Toutes</option>
                        {roomsName.map(name => <option value={name} selected={filter._room === name}>{name}</option>)}
                    </select>
                </div>

                <div className="filterBlock">
                    <h2>Module</h2>
                    <select onChange={e => this.onUnitSelected(e.target.value)}>
                        <option value={undefined} selected={!filter._unit}>Tous</option>
                        {unitsName.map(name => <option value={name} selected={filter._unit === name}>{name}</option>)}
                    </select>
                </div>
            </div>
        );
    }
}