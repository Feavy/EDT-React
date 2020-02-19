import React, { Component } from "react";
import Filter from "../data/Filter";

export default class FilterChanger extends Component<{filter:Filter, onChange:(newFilter:Filter) => void}, {}> {

    private toggleGroup(promo:string, group:string) {
        if(this.props.filter.isGroupVisible(promo, group)) {
            this.props.filter.hideGroup(promo, group);
        } else {
            this.props.filter.showGroup(promo, group);
        }
        this.props.onChange(this.props.filter);
    }

    render() {
        return (
            <>
                {["INFO1", "INFO2"].map(promo => (
                    <>
                        <h2>{promo}</h2>
                        <div className="buttonGroup">
                        {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"].map(group => (
                            <input type="submit" onClick={() => this.toggleGroup(promo, group)} value={group}/>
                        ))}
                        </div>
                    </>
                ))}  
            </>
        );
    }
}