import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import FlOpDataFetcher from './io/FlOpDataFetcher'
import ScheduleData from './data/ScheduleData';
import Schedule from './ui/Schedule';

type AppState = {
  scheduleData: ScheduleData
}

export default class App extends Component<{}, AppState> {
  constructor(props: {}, state: AppState) {
    super(props, state);
    this.state = {scheduleData: new ScheduleData()};
    FlOpDataFetcher.fetch(39, 2019, (data:ScheduleData) => {
      this.setState({scheduleData: data});
    });
  }

  render() {
    return (
      <>  
        <h1>Emploi du temps - IUT de Blagnac</h1>
        <Schedule data={this.state.scheduleData}/>
      </>
    );
  }
}