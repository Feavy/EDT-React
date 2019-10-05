import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import FlOpDataFetcher from './io/FlOpDataFetcher'
import ScheduleData from './data/ScheduleData';
import Schedule from './ui/Schedule';
import Filter from './data/Filter';
import FilterChanger from './ui/FilterChanger';

type AppState = {
  scheduleData: ScheduleData,
  filter:Filter
}

export default class App extends Component<{}, AppState> {
  constructor(props: {}, state: AppState) {
    super(props, state);
    this.state = {
      scheduleData: new ScheduleData(),
      filter: new Filter()
    };
    FlOpDataFetcher.fetch(41, 2019, (data:ScheduleData) => {
      this.setState({scheduleData: data});
    });
  }

  private _onFilterChange = (newFilter:Filter) => {
        this.setState({filter: newFilter});
  }

  render() {
    const {scheduleData, filter} = this.state;

    return (
      <>  
        <h1>Emploi du temps - IUT de Blagnac</h1>
        <FilterChanger filter={filter} onChange={this._onFilterChange}/>
        <Schedule filter={filter} data={scheduleData}/>
      </>
    );
  }
}