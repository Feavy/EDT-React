import React, {Component} from 'react';

export default class MessageBox extends Component {
    constructor(props) {
      super(props);
      this.state = {visible: false};
      this.hide = this.hide.bind(this);
      MessageBox.instance = this;
    }
  
    static show(lines) {
      if(!lines[0].txt)
        lines = lines.map(line => {return {txt: line};});
      MessageBox.instance.show(lines);
    }
  
    show(lines) {
      this.setState({visible: true, lines: lines});
    }
  
    hide() {
      this.setState({visible: false});
    }
  
    render() {
      const lines = this.state.lines;
      return this.state.visible ? (
        <div id="msgBoxContainer">
          <div id="msgBoxBg" onClick={this.hide}>
          </div>
          <div id="msgBox">
          {lines.map((line,index) => line.url ? (
            <a key={"msgBoxLine-"+index} href={line.url} target="_blank">{line.txt}</a>
          ) : (
            <span key={"msgBoxLine-"+index}>{line.txt}</span>)
          )}
          </div>
        </div>
  
      ) : null;
    }
  }