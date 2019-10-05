import React, { Component } from "react";
import Filter from "../data/Filter";

export default class FilterChanger extends Component<{filter:Filter, onChange:(newFilter:Filter) => void}, {}> {
    private _onClick = (e:React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        var input:HTMLInputElement = e.target as HTMLInputElement;
        if(this.props.filter.isGroupVisible("INFO1", input.value)) {
            this.props.filter.hideGroup("INFO1", input.value);
            input.style.backgroundColor =  "0xFFFFFF";
        } else {
            this.props.filter.showGroup("INFO1", input.value);
            input.style.backgroundColor = "";
        }
        this.props.onChange(this.props.filter);
    };

    render() {
        return (
            <>
                {["INFO1"].map(promo => (
                    <>
                        <h2>{promo}</h2>
                        {["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"].map(group => (
                            <input type="submit" value={group} onClick={this._onClick}/>
                        ))}
                    </>
                ))}
            </>
        );
    }
}