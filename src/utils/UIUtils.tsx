import React, {Component} from "react";

export function generateBlanks(lineAmount: number):JSX.Element {
    const blanks: JSX.Element[] = [];
    for (var j = 0; j < lineAmount; j++) {
        blanks.push(<p>&nbsp;</p>)
    }
    return(
        <div className="schedule-info-case">
            {blanks}
        </div>
    );
}