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
  filter: Filter;
  modals: React.ComponentElement<any, Modal>[];
  week: number;
  year: number;
}

export default class App extends Component<{}, AppState> {
  private static app: App;
  private isMobile:boolean = false;
  private weekTimeout: NodeJS.Timeout | undefined;

  private wasTooManyGroups:boolean = true;

  constructor(props: {}, state: AppState) {
    super(props, state);
    this.state = {
      scheduleData: new ScheduleData(),
      filter: new Filter(),
      modals: [],
      week: 9,
      year: 2020
    };
    FlOpDataFetcher.fetch(this.state.week, this.state.year, (data: ScheduleData) => {
      this.setState({ scheduleData: data });
    });

    const groups = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"];
    var lastGroup:string = "";
    while(this.tooManyGroupSelected()) {
      lastGroup = groups.pop()!;
      this.state.filter.hideGroup("INFO1", lastGroup);
      this.state.filter.hideGroup("INFO2", lastGroup);
    }

    this.filterUpdated();

    window.addEventListener("resize", (e) => {
      if(this.wasTooManyGroups != this.tooManyGroupSelected())
        this.forceUpdate();
    });

    App.app = this;
  }

  private _onFilterChange = (newFilter: Filter) => {
    this.setState({ filter: newFilter });
  }

  public static get(): App {
    return App.app;
  }

  public addModal(modal: React.ComponentElement<any, Modal>) {
    this.setState((prevState) => {
      prevState.modals.push(modal);
      return prevState;
    });
  }

  public removeModal(modal: any) {
    this.setState((prevState) => {
      prevState.modals.splice(prevState.modals.indexOf(modal), 1);
      return prevState;
    });
  }

  public setWeek(week: number) {
    var yearAdd:number = 0;
    if(week <= 0) {
      week += 52;
      yearAdd = -1;
    }else if(week > 52) {
      week -= 52;
      yearAdd = 1;
    }
    
    if (this.weekTimeout)
      clearTimeout(this.weekTimeout);

    this.weekTimeout = setTimeout(() => {
      FlOpDataFetcher.fetch(week, this.state.year, (data: ScheduleData) => {
        this.setState({ scheduleData: data });
      });
    }, 500);

    this.setState(prevState => {return { week: week, year: prevState.year + yearAdd }; });
  }

  public filterUpdated() {
    this.setState(this.state);
  }

  private tooManyGroupSelected():boolean {
    return (8 - this.state.filter.hiddenGroupsAmount("INFO1")) * 24 * 5 + 30 + 40 > window.innerWidth ||
    (8 - this.state.filter.hiddenGroupsAmount("INFO2")) * 24 * 5 + 30 + 40 > window.innerWidth ;
  }

  render() {
    const { scheduleData, filter, modals, week, year } = this.state;
    this.wasTooManyGroups = this.tooManyGroupSelected();
    return (
      <div>
        <ToggleLightDark />
        <div id="status"><a href="https://github.com/feavy/EDT-React" target="_blank">Code Source</a> v 1.0</div>
        <h1>Emploi du temps - IUT de Blagnac</h1>
        <p id="reloaded">RELOADED</p>
        <FilterChanger filter={filter} onChange={this._onFilterChange} week={week}
          roomsName={scheduleData.roomsName}
          teachersName={scheduleData.teachersName}
          unitsName={scheduleData.unitsName} />
        <Schedule dayMode={this.tooManyGroupSelected()} filter={filter} data={scheduleData} week={week} year={year} />
        {modals.map(modal => (
          modal
        ))}
      </div>
    );
  }
}