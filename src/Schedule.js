import React, {Component} from 'react';
import ScheduleCase from './ScheduleCase';
import ScheduleInfoCase from './ScheduleInfoCase';
import { GROUPES, centerStyle } from './Globals';

const promos = ["1A", "2A   LP"];
const heures = [["08h00", "09h25"],
                ["09h30", "10h55"],
                ["11h05", "12h30"],
                [,],
                ["14h15", "15h40"],
                ["15h45", "17h10"],
                ["17h15", "18h40"]];

/**
 * NOK -> A simplifier
 */
export default class Schedule extends Component {
    constructor(props) {
      super(props);
      this.dayIndexes = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven."];
    }
  
    render() {
      var debug = 1;
      const headerPromo = this.props.filter.groups[0].length > 0 ? 0 : 1;
      const style = {textAlign: "center", overflow:"hidden", flexGrow: 1};
  
      const elems = [];
  
      for(let i = 0; i < this.props.edt.length; i++) {  // A travers les heures
        for(let j = 0; j < this.props.edt[i].length; j++) { // A travers les jours
          if(j == 0)
            if(i != 3) {
            elems.push(
              <div className="promos">
                {this.props.filter.groups[0].length > 0 && (
                <div>
                <span>{promos[0]}</span>
                </div>)}
                {this.props.filter.groups[1].length > 0 && (
                <div>
                <span>{promos[1]}</span>
                </div>)}
              </div>
            )
            }else
              elems.push(<div></div>);
          if(i == 3)
            elems.push(<ScheduleInfoCase data={this.props.edt[i][j]} isDarkMode={this.props.isDarkMode} isMobile={this.props.isMobile}/>)
          else
            elems.push(<ScheduleCase animation={!this.props.isMobile} isDarkMode={this.props.isDarkMode} isFirstTop={i == 0 || i == 4}
              isFirstLeft={j == 0} debug={debug-- == 1} filter={this.props.filter} data={this.props.edt[i][j]}/>)
          if(j == this.props.edt[i].length-1)
            elems.push(
              <div className="heures">
                  <div className="start">{heures[i][0]}</div>
                  <div className="end">{heures[i][1]}</div>
              </div>
            );
        }
      }
  
      return (
        <div id="schedule">
          
          <div></div>
          {// Affichage des dates : 
          this.dayIndexes.map((id, index) => 
            <div>
              <h2 key={id} style={centerStyle}>{id+" "+this.props.days[index]}</h2>
            </div>
          )}
          <div></div>
  
          <div></div>
          {// Affichage des labels de groupes 1ere année :
          this.dayIndexes.map(id => 
            <div style={{display: "flex"}}>
              {this.props.filter.groups[headerPromo].map(index =>
                    <span style={style} key={"1A"+id+"-gr"+index}>{GROUPES[headerPromo][index]}</span>
              )}
            </div>
          )}
          <div></div>
          
          {// Affichage des cases :
            elems
          }
  
          <div></div>
          {// Affichage des labels de groupes 2nde année :
            this.props.filter.groups[0].length > 0 &&
            this.dayIndexes.map(id => 
            <div style={{display: "flex"}}>
              {this.props.filter.groups[1].map(index =>
                    <span style={style} key={"2A"+id+"-gr"+index}>{GROUPES[1][index]}</span>
              )}
            </div>
          )}
        </div>
      );
    }
  }