import React, { Component } from "react";
import Filter from "../data/Filter";

export default class FilterChanger extends Component<{filter:Filter, onChange:(newFilter:Filter) => void}, {}> {

    private toggledButton:string = "undefined";

    constructor(props:{filter:Filter, onChange:(newFilter:Filter) => void}) {
        super(props);
        setInterval(function() {
            
        }, 200);
    }

    private toggleGroup(promo:string, group:string) {
        if(this.props.filter.isGroupVisible(promo, group)) {
            this.props.filter.hideGroup(promo, group);
        } else {
            this.props.filter.showGroup(promo, group);
        }
        this.props.onChange(this.props.filter);
    }



    render() {
        const {filter} = this.props;
        return (
            <div id="filters">
                {["INFO1", "INFO2"].map(promo => (
                    /* GROUP SELECTION */
                    <div className="filterBlock">
                        <h2>{promo}</h2>
                        <div className="buttonGroup">
                        {["1A", "1B", "2A", "2B", "3A", "3B", "4A"].map(group => (
                            <input type="submit"
                            onMouseDown={(e) => this.toggleGroup(promo, group)}
                            onMouseEnter={(e) => {
                                if(e.buttons == 1)
                                this.toggleGroup(promo, group);
                            }}
                            onTouchMove={(e) => {
                                const elem:Element|null = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
                                if(elem instanceof HTMLInputElement) {
                                    const button:HTMLInputElement = elem as HTMLInputElement;
                                    if(button.value != this.toggledButton) {
                                        this.toggledButton = button.value;
                                        button.dispatchEvent(new Event("mousedown", {bubbles: true}));
                                    }
                                }
                            }}
                            value={group}
                            className={filter.isGroupVisible(promo, group) ? "active" : ""}/>
                        ))}
                        </div>
                    </div>

                ))}
                <div className="filterBlock">
                    <h2>LP</h2>
                    <div className="buttonGroup">
                        <input type="submit"
                        onMouseDown={(e) => this.toggleGroup("INFO2", "4B")}
                        onMouseEnter={(e) => {
                            if(e.buttons == 1)
                            this.toggleGroup("INFO2", "4B");
                        }}
                        onTouchMove={(e) => {
                            const elem:Element|null = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
                            if(elem instanceof HTMLInputElement) {
                                const button:HTMLInputElement = elem as HTMLInputElement;
                                if(button.value != this.toggledButton) {
                                    this.toggledButton = button.value;
                                    button.dispatchEvent(new Event("mousedown", {bubbles: true}));
                                }
                            }
                        }}
                        value="LP"
                        className={filter.isGroupVisible("INFO2", "4B") ? "active" : ""}/>
                    </div>
                </div>
                {/* WEEK SELECTION */}
                <div className="filterBlock">
                    <h2>Semaine</h2>
                    <div className="buttonGroup">
                    <input type="submit" value="◀" className="active"/>
                    <span id="weekLbl">9</span>
                    <input type="submit" value="▶" className="active"/>
                    </div>
                </div>

                <div className="filterBlock">
                    <h2>Prof</h2>
                    <select>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                    </select>
                </div>

                <div className="filterBlock">
                    <h2>Salle</h2>
                    <select>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                    </select>
                </div>

                <div className="filterBlock">
                    <h2>Module</h2>
                    <select>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                        <option value="test">Test</option>
                    </select>
                </div>
            </div>
        );
    }
}