import React, { Component } from "react";
import { Color } from "csstype";

type ModalProps = {
    left: string;
    top: string;
    width: string;
    height: string;
    color: Color;
}

export default class Modal extends Component<ModalProps, any> {
    constructor(props: ModalProps) {
        super(props);
        this.state = props;
        setTimeout(() => {
            this.setState({
                left: "calc(50% - 250px)",
                top: "30%",
                width: "500px",
                height: "40%"
            });
        }, 0);
    }

    render() {
        const {children} = this.props;
        const {left, top, width, height, color} = this.state;
        return (
            <div className="modal" style={{
                left: left,
                top: top,
                width: width,
                height: height,
                backgroundColor: color
            }}>
                {children}
            </div>
        );
    }
}