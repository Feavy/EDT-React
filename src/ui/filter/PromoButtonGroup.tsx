import React, { Component } from "react";
import App from "../../App";
import Filter from "../../data/Filter";

export default class PromoButtonGroup extends React.Component<{ promo: string, filter: Filter, groups: string[], style?: {} }, any> {
    private toggledButton: string = "undefined";

    private toggleGroup = (promo: string, group: string) => {
        if (this.props.filter.isGroupVisible(promo, group)) {
            this.props.filter.hideGroup(promo, group);
        } else {
            this.props.filter.showGroup(promo, group);
        }
        App.get().filterUpdated();
        //this.props.onChange(this.props.filter);
    }

    render() {
        const { promo, filter, groups, style } = this.props;
        return (
            <div className="filterBlock" style={style && {...style}}>
                <h2>{promo}</h2>
                <div className="buttonGroup">
                    {groups.map(group =>
                        <input key={promo+group} type="submit"
                            style={{width: 100/groups.length+"%"}}
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
                    )}
                </div>
            </div>
        )
    }
}