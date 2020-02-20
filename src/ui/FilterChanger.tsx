import React, { Component } from "react";
import Filter from "../data/Filter";

import App from "../App";

type FilterChangerProps = {
    filter: Filter;
    week: number;
    onChange: (newFilter: Filter) => void;
    teachersName:string[];
    unitsName:string[];
    roomsName:string[];
}

export default class FilterChanger extends Component<FilterChangerProps, {}> {

    private toggledButton: string = "undefined";

    constructor(props:FilterChangerProps) {
        super(props);
        setInterval(function () {

        }, 200);
    }

    private toggleGroup(promo: string, group: string) {
        if (this.props.filter.isGroupVisible(promo, group)) {
            this.props.filter.hideGroup(promo, group);
        } else {
            this.props.filter.showGroup(promo, group);
        }
        this.props.onChange(this.props.filter);
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

    render() {
        const { filter, week, teachersName, unitsName, roomsName } = this.props;
        unitsName.sort();
        teachersName.sort();
        roomsName.sort();
        return (
            <div id="filters">
                {["INFO1", "INFO2"].map(promo => (
                    /* GROUP SELECTION */
                    <div className="filterBlock">
                        <h2>{promo}</h2>
                        <div className="buttonGroup">
                            {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"].map(group => {
                                return !(promo == "INFO2" && group == "4B") && (
                                    <input type="submit"
                                        onMouseDown={(e) => this.toggleGroup(promo, group)}
                                        onMouseEnter={(e) => {
                                            if (e.buttons == 1)
                                                this.toggleGroup(promo, group);
                                        }}
                                        onTouchMove={(e) => {
                                            const elem: Element | null = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
                                            if (elem instanceof HTMLInputElement) {
                                                const button: HTMLInputElement = elem as HTMLInputElement;
                                                if (button.value != this.toggledButton) {
                                                    this.toggledButton = button.value;
                                                    button.dispatchEvent(new Event("mousedown", { bubbles: true }));
                                                }
                                            }
                                        }}
                                        value={group}
                                        className={filter.isGroupVisible(promo, group) ? "active" : ""} />
                                )
                            })}
                        </div>
                    </div>

                ))}
                <div className="filterBlock">
                    <h2>LP</h2>
                    <div className="buttonGroup">
                        <input type="submit"
                            onMouseDown={(e) => this.toggleGroup("INFO2", "4B")}
                            onMouseEnter={(e) => {
                                if (e.buttons == 1)
                                    this.toggleGroup("INFO2", "4B");
                            }}
                            onTouchMove={(e) => {
                                const elem: Element | null = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
                                if (elem instanceof HTMLInputElement) {
                                    const button: HTMLInputElement = elem as HTMLInputElement;
                                    if (button.value != this.toggledButton) {
                                        this.toggledButton = button.value;
                                        button.dispatchEvent(new Event("mousedown", { bubbles: true }));
                                    }
                                }
                            }}
                            value="LP"
                            className={filter.isGroupVisible("INFO2", "4B") ? "active" : ""} />
                    </div>
                </div>
                {/* WEEK SELECTION */}
                <div className="filterBlock">
                    <h2>Semaine</h2>
                    <div className="buttonGroup">
                        <input type="submit" value="◀" className="active" onClick={() => App.get().previousWeek()} />
                        <span id="weekLbl">{week}</span>
                        <input type="submit" value="▶" className="active" onClick={() => App.get().nextWeek()} />
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