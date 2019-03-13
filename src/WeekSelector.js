/** Week Selector Widget
 * 
 * Widget utilisé pour selectionner une semaine précise
 * 
 */

import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';

export default class WeekSelector extends Component {

    /**
     * props :
     * {value: semaine actuellement sélectionnée}
     */
    constructor(props) {
      super(props);
      this.state = {week: this.props.week, year: this.props.year};
    }
  
    /**
     * Callback appelé lorsqu'une nouvelle semaine est sélectionnée
     * @param {*} newWeek 
     */
    onWeekChanged(newWeek) {
      if(!isNaN(newWeek)) {
        let newYear = this.state.year;
        if(newWeek < 2) {
          newWeek += 50;
          newYear--;
        }
        if(newWeek > 51) {
          newWeek -= 50;
          newYear++;
        }
        this.setState({week: newWeek, year: newYear});
        if(this.changeTimeout) {
          clearTimeout(this.changeTimeout);
        }
        this.changeTimeout = setTimeout(() => {
          this.props.onWeekChanged({week: this.state.week, year: this.state.year});
        }, 500);
      }else{
        this.setState({week: newWeek});
      }
    }
  
    render() {
      return (
        <div class="weekSelector">
          <button onClick={(e) => this.onWeekChanged(this.state.week-1)}><Icon>arrow_left</Icon></button>
          <TextField InputProps={{
            classes: {
                root: this.props.isDarkMode ? "whiteTxt whiteBorder" : ""
            }
          }} className="input" type="number" min="-52" max="52" value={this.state.week} onChange={(e) => this.onWeekChanged(Number.parseInt(e.target.value))}/>
          <button class="button" onClick={(e) => this.onWeekChanged(this.state.week+1)}><Icon>arrow_right</Icon></button>
          <p>Année : <span style={{fontWeight: "bold"}}>{this.state.year}</span></p>
        </div>
      )
    }
  }