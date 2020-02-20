import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import FlOpDataFetcher from './io/FlOpDataFetcher'
import ScheduleData from './data/ScheduleData';
import Schedule from './ui/Schedule';
import Filter from './data/Filter';
import FilterChanger from './ui/FilterChanger';

import Modal from "./ui/Modal";

type AppState = {
  scheduleData: ScheduleData;
  filter:Filter;
  modals:React.ComponentElement<any, Modal>[];
}

export default class App extends Component<{}, AppState> {
  private static app:App;
  
  constructor(props: {}, state: AppState) {
    super(props, state);
    this.state = {
      scheduleData: new ScheduleData(),
      filter: new Filter(),
      modals: []
    };
    FlOpDataFetcher.fetch(9, 2020, (data:ScheduleData) => {
      this.setState({scheduleData: data});
    });

    App.app = this;
  }

  private _onFilterChange = (newFilter:Filter) => {
    this.setState({filter: newFilter});
  }

  public static get():App {
    return App.app;
  }

  public addModal(modal:React.ComponentElement<any, Modal>) {
    this.setState((prevState) => {
      prevState.modals.push(modal);
      return prevState;
    });
    console.log("added", modal);
  }

  removeModal(modal:any) {
    this.setState((prevState) => {
      prevState.modals.splice(prevState.modals.indexOf(modal), 1);
      return prevState;
    });
  }

  render() {
    const {scheduleData, filter, modals} = this.state;

    return (
      <div>
        <div id="status"><a href="https//github.com/feavy/EDT-React">Code Source</a> v 1.0</div>
        <h1>Emploi du temps - IUT de Blagnac</h1>
        <p id="reloaded">RELOADED</p>
        <FilterChanger filter={filter} onChange={this._onFilterChange}/>
        <Schedule filter={filter} data={scheduleData}/>
        {modals.map(modal => (
            modal
        ))}
      </div>
    );
  }
}