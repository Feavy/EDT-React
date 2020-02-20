import React, { Component } from 'react';
import './App.css';

import FlOpDataFetcher from './io/FlOpDataFetcher'
import ScheduleData from './data/ScheduleData';
import Schedule from './ui/Schedule';
import Filter from './data/Filter';
import FilterChanger from './ui/FilterChanger';

import ToggleLightDark from './ui/ToggleLightDark';

import Modal from "./ui/Modal";

type AppState = {
  scheduleData: ScheduleData;
  filter:Filter;
  modals:React.ComponentElement<any, Modal>[];
  week: number;
  year: number;
}

export default class App extends Component<{}, AppState> {
  private static app:App;
  
  constructor(props: {}, state: AppState) {
    super(props, state);
    this.state = {
      scheduleData: new ScheduleData(),
      filter: new Filter(),
      modals: [],
      week: 9,
      year: 2020
    };
    FlOpDataFetcher.fetch(this.state.week, this.state.year, (data:ScheduleData) => {
      this.setState({scheduleData: data});
    });

    window.addEventListener("resize", this.onWindowResized);
    this.onWindowResized();

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
  }

  public removeModal(modal:any) {
    this.setState((prevState) => {
      prevState.modals.splice(prevState.modals.indexOf(modal), 1);
      return prevState;
    });
  }

  public nextWeek() {
    this.setState(prev => {
      FlOpDataFetcher.fetch(prev.week+1, this.state.year, (data:ScheduleData) => {
        this.setState({scheduleData: data});
      });
      return {week: prev.week+1};
    });
  }

  public previousWeek() {
    this.setState(prev => {
      FlOpDataFetcher.fetch(prev.week-1, this.state.year, (data:ScheduleData) => {
        this.setState({scheduleData: data});
      });
      return {week: prev.week-1};
    });
  }

  public filterUpdated() {
    this.setState(this.state);
  }

  private onWindowResized = () => {
    let isMobile = window.innerWidth < 640;
    //if(this.state && this.state.isMobile != isMobile)
     // this.setState({isMobile: isMobile});
    var r1 = this.adaptGroupsPreferredSelectedAmount("INFO1");
    var r2 = this.adaptGroupsPreferredSelectedAmount("INFO2");
    if(r1 || r2)
      this.setState({filter: this.state.filter}); // (lol)
  }

  private adaptGroupsPreferredSelectedAmount(promo:string) {
    var rep = false;
    const groups = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"];
    while((8-this.state.filter.hiddenGroupsAmount(promo))*24*5+30+40 > window.innerWidth) {
      this.state.filter.hideGroup(promo, groups.pop()!);
      rep = true;
    }
    return rep;
  }

  render() {
    const {scheduleData, filter, modals, week, year} = this.state;

    return (
      <div>
        <ToggleLightDark/>
        <div id="status"><a href="https://github.com/feavy/EDT-React" target="_blank">Code Source</a> v 1.0</div>
        <h1>Emploi du temps - IUT de Blagnac</h1>
        <p id="reloaded">RELOADED</p>
        <FilterChanger filter={filter} onChange={this._onFilterChange} week={week}
        roomsName={scheduleData.roomsName}
        teachersName={scheduleData.teachersName}
        unitsName={scheduleData.unitsName}/>
        <Schedule filter={filter} data={scheduleData} week={week} year={year}/>
        {modals.map(modal => (
            modal
        ))}
      </div>
    );
  }
}