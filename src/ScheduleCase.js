import React, {Component} from 'react';
import MessageBox from './MessageBox';

export default class ScheduleCase extends Component {
    constructor(props) {
      super(props);
      
      this.classes = ["case"];
      this.busyRooms = [];

      const data = this.props.data;
      for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].length; j++) {
          if(!this.busyRooms.includes(data[i][j].salle) && data[i][j].salle)
            this.busyRooms.push(data[i][j].salle);
        }
      }
  
      if(props.isFirstLeft)
        this.classes.push("firstLeft");
      if(props.isFirstTop)
        this.classes.push("firstTop");
  
    }
  
    render() {
      const {filter} = this.props;
  
      var animation = this.props.animation ? "all .5s" : ""
  
      var visibles = [0, 0];

      const data = this.props.data;
      for(let i = 0; i < data.length; i++) {
        var lastIndex;      // Peut-être source de bugs ?
        for(let j = 0; j < data[i].length; j++) {
          var current = data[i][j];
          current.width = 0;
          current.visible = false;
  
          if(j == 0 || current.profNom != data[i][j-1].profNom) {
            lastIndex = j;
            current.visible = true;
          }
  
          if (this.props.filter.groups[i].includes(j) && this.props.filter.profNom == "TOUS" && this.props.filter.salle == "TOUTES"
          || this.props.filter.salle == current.salle || this.props.filter.profNom == current.profNom)
            data[i][lastIndex].width++
            if(this.props.filter.profNom != "TOUS" && this.props.filter.salle != "TOUTES")
              visibles[i]++;
        }
      }
  
      let selectedGroupAmount = 0;
      if(filter.groups[0].length > 0)
        selectedGroupAmount++;
      if(filter.groups[1].length > 0)
        selectedGroupAmount++;
  
      return (
        <div className={this.classes.join(" ")} onClick={() => MessageBox.show(["Salles occupées :", this.busyRooms.join(", ")])}>
          {this.props.data.map((promos, row) =>
          true ? (
            <div style={{display: "flex", transition: animation, flexGrow: filter.groups[row].length > 0 || filter.groups[row].length == 0 && visibles[row] > 0 ? 1 : 0}}>
              {promos.map((groupe, column) => groupe.visible ? (
                  <div className="subCase" style={{flexGrow: groupe.width, flexBasis: 0, transition: animation,
                                                  backgroundColor: groupe.bgColor, color: groupe.txtColor}}>
                      
                        <div style={{top: selectedGroupAmount == 1 ? "27%" : "0%", height: groupe.width === 0 ? "0px" : "40px", transition: animation}}>
                          <span>{groupe.module}</span>
                          <span>{groupe.profNom}</span>
                          <span>{groupe.salle === "A011" ? <strong>EXAMEN</strong> : groupe.salle}</span>
                        </div>
                  </div>) : null)
              }
            </div>
          ) : null)}
        </div>
      );
    }
  }