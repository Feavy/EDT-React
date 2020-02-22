import React, { Component } from "react";
import { Color } from "csstype";
import App from "../App";

type ModalProps = {
    target: HTMLElement;
    color: Color;
    initialContent: JSX.Element;
}

export default class Modal extends Component<ModalProps, any> {
    private initialLeft: string = "0px";
    private initialTop: string = "0px";
    private initialWidth: string = "0px";
    private initialHeight: string = "0px";

    constructor(props: ModalProps) {
        super(props);

        const { target } = this.props;

        target.style.transition = "none";
        target.style.visibility = "hidden";
        target.classList.remove("shadow");

        this.initialLeft = target.getBoundingClientRect().left + "px";
        this.initialTop = target.getBoundingClientRect().top + "px";
        this.initialWidth = target.clientWidth + "px";
        this.initialHeight = target.clientHeight + "px";

        this.state = { left: this.initialLeft, top: this.initialTop, width: this.initialWidth, height: this.initialHeight, color: props.color };
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
        const { target } = this.props;

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
            App.get().removeModal(this);
            target.style.transform = "scale(1.1)"
            target.style.visibility = "";
            target.classList.add("shadow");
    
            setTimeout(function () {
                target.style.transition = "all .5s";
                target.style.transform = ""
            }, 0);
        }, 500)
    }

    render() {
        const { children } = this.props;
        const { left, top, width, height, color, opacity, finalState } = this.state;
        return (
            <>
                <div className="modal" style={{
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    backgroundColor: color
                }}>
                    <div className="modalContent" style={{ fontSize: !finalState ? "10px" : "", top: finalState ? "10px" : "", transform: finalState ? "translateY(0)" : "" }}>
                        <div style={{ textAlign: "center" }}>
                            {this.props.initialContent}
                        </div>
                    </div>
                </div>
                <div id="modalBg" style={{ background: "rgba(0, 0, 0, " + opacity + ")" }} onClick={() => this.hide()}></div>
            </>
        );
    }
}