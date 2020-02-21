import React, { Component } from "react";
import { Color } from "csstype";
import App from "../App";

type ModalProps = {
    left: string;
    top: string;
    width: string;
    height: string;
    color: Color;
    onHide?: () => void;
}

export default class Modal extends Component<ModalProps, any> {
    private initialLeft: string = "0px";
    private initialTop: string = "0px";
    private initialWidth: string = "0px";
    private initialHeight: string = "0px";

    constructor(props: ModalProps) {
        super(props);
        
        this.initialLeft = props.left;
        this.initialTop = props.top;
        this.initialWidth = props.width;
        this.initialHeight = props.height;

        this.state = props;
        setTimeout(() => {
            this.setState({
                left: "calc(50% - 250px)",
                top: "30%",
                width: "500px",
                height: "40%",
                opacity: 0.33,
                finalState: true
            });
        }, 0);
    }

    private hide = () => {
        setTimeout(() => {
            this.setState({
                left: this.initialLeft,
                top: this.initialTop,
                width: this.initialWidth,
                height: this.initialHeight,
                opacity: 0,
                finalState: false
            });
        }, 0);
        setTimeout(() => {
            if(this.props.onHide)
                this.props.onHide();
            App.get().removeModal(this);
        }, 500)
    }

    render() {
        const {children} = this.props;
        const {left, top, width, height, color, opacity, finalState} = this.state;
        return (
            <>
            <div className="modal" style={{
                left: left,
                top: top,
                width: width,
                height: height,
                backgroundColor: color
            }}>
                <div className="modalContent" style={{top: finalState ? "10px" : "", transform: finalState ? "translateY(0)" : ""}}>
                {children}
                </div>
            </div>
            <div id="modalBg" style={{background: "rgba(0, 0, 0, "+opacity+")"}} onClick={() => this.hide()}></div>
            </>
        );
    }
}