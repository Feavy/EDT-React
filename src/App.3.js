/**
 * <!> Attention <!>
 * 
 * Le code est pour l'instant mal organisé, il
 * sera refactorisé et commenté très prochainement.
 * 
 * 
 * Ci-dessous le code source d'une webapp servant à
 * l'affichage de l'emploi du temps du département
 * informatique de l'IUT de Blagnac.
 * 
 * 
 * Les emplois du temps sont générés automatiquement
 * par le logiciel libre FlopEDT :
 * 
 * http://www.flopedt.org/
 * 
 */


import React, { Component } from 'react';
import './App.css';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import Input from '@material-ui/core/Input';

import Icon from '@material-ui/core/Icon';

const ID_COURS = 0,
NUM_COURS = 1,
PROF_NOM = 2,
GPE_NOM = 3,
GPE_PROMO = 4,
MODULE = 5,
JOUR = 6,
HEURE = 7,
ROOM = 8,
ROOM_TYPE = 9,
COLOR_BG = 10,
COLOR_TXT = 11;

const GROUPES = [["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"],
                ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "LP"]];
const GROUPES2 = ["1",     , "2",      , "3",      ,  "4"];

const promos = ["1A", "2A   LP"];
const heures = [["08h00", "09h25"],
                ["09h30", "10h55"],
                ["11h05", "12h30"],
                [,],
                ["14h15", "15h40"],
                ["15h45", "17h10"],
                ["17h15", "18h40"]];

var profs = ["TOUS"];
var modules = ["TOUS"];
var salles = ["TOUTES"];

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

function getDateOfWeek(w, y) {
  var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

  return new Date(y, 0, d);
}

let d = new Date();
d.setUTCDate(d.getUTCDate()+2);

var result = getWeekNumber(d);

const defaultYear = result[0];
const defaultWeek = result[1];

/** Week Selector Widget
 * 
 * Widget utilisé pour selectionner une semaine précise
 * 
 */

class WeekSelector extends Component {

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
      <div>
        <button onClick={(e) => this.onWeekChanged(this.state.week-1)}><Icon>arrow_left</Icon></button>
        <TextField InputProps={{
          classes: {
              root: this.props.isDarkMode ? "whiteTxt" : ""
          }
        }} className="input" type="number" min="-52" max="52" value={this.state.week} onChange={(e) => this.onWeekChanged(Number.parseInt(e.target.value))}/>
        <button class="button" onClick={(e) => this.onWeekChanged(this.state.week+1)}><Icon>arrow_right</Icon></button>
        <p>Année : <span style={{fontWeight: "bold"}}>{this.state.year}</span></p>
      </div>
    )
  }
}

const centerStyle = {textAlign: "center"};

/**
 * NOK -> A simplifier
 */
class Schedule extends Component {
  constructor(props) {
    super(props);
    this.dayIndexes = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven."];
  }

  render() {
    var debug = 1;
    const headerPromo = this.props.filter.groups[0].length > 0 ? 0 : 1;
    const style = {textAlign: "center", overflow:"hidden"};

    const elems = [];

    console.log(this.props.edt);

    for(let i = 0; i < this.props.edt.length; i++) {  // A travers les heures
      console.log(i);
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
          elems.push(<ScheduleInfoCase data={this.props.edt[i][j]} isMobile={this.props.isMobile}/>)
        else
          elems.push(<ScheduleCase isDarkMode={this.props.isDarkMode} isFirstTop={i == 0 || i == 4}
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
      <div>
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
            <div style={{display: "grid", gridTemplateColumns: "repeat("+this.props.filter.groups[headerPromo].length+", 1fr)"}}>
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
            <div style={{display: "grid", gridTemplateColumns: "repeat("+this.props.filter.groups[1].length+", 1fr)"}}>
              {this.props.filter.groups[1].map(index =>
                    <span style={style} key={"2A"+id+"-gr"+index}>{GROUPES[1][index]}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

/**
 * NOK : Rajouter les keys
 */
class ScheduleInfoCase extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const heure = this.props.data;
    return (
      <div /*key={index+";"+index2}*/ className="infoCase">
      {heure.length > 0 && this.props.isMobile ? <div /*key={index+";"+index2+"-i"}*/ className="infoButton" onClick={() => MessageBox.show(heure)}><span>Infos</span></div> :
      heure.map(line => line.url ? (
              <a href={line.url} style={{backgroundColor: line.fillColor, color: line.txtColor}}>{line.txt}</a>
            ) : (
              <span style={{backgroundColor: line.fillColor, color: line.txtColor}}>{line.txt}</span>)
            )}
      </div>
    );
  }
}

class ScheduleCase extends Component {
  constructor(props) {
    super(props);
    
    this.classes = ["case"];

    if(props.isDarkMode) {
      this.classes.push("lightBorders");
    } else {
      this.classes.push("darkBorders");
    }

    if(props.isFirstLeft)
      this.classes.push("firstLeft");
    if(props.isFirstTop)
      this.classes.push("firstTop");

  }

  getOpacity(groupe) {
    const filter = this.props.filter;
    return  (filter.module == "TOUS" || filter.module == groupe.module) &&
            (filter.profNom == "TOUS" || filter.profNom == groupe.profNom) &&
            (filter.salle == "TOUTES" || filter.salle == groupe.salle) ? 1 : 0.3;
  }

  render() {
    const {filter} = this.props;

    const data = this.props.data;
    for(let i = 0; i < data.length; i++) {
      var lastVisibleIndex = 0;      // Peut-être source de bugs ?
      for(let j = 0; j < data[i].length; j++) {
        let current = data[i][j];
        
        current.visible = this.props.filter.groups[i].includes(j);
        let c = this.props.filter.groups[i].indexOf(j)+1;
        current.columnStart = c;
        current.columnEnd = c;
        current.row = i+1;
        if(current.row == 2 && this.props.filter.groups[0].length == 0)
          current.row = 1;
        if(j == 0) {
          if(current.visible)
          lastVisibleIndex = j;
          continue;
        }

        if(current.profNom && current.visible && current.profNom == data[i][lastVisibleIndex].profNom) {
          current.columnStart = data[i][lastVisibleIndex].visible ? data[i][lastVisibleIndex].columnStart : data[i][j].columnStart;
          data[i][lastVisibleIndex].visible = false;
          current.columnEnd++;    // Bricolage
        }

        if(current.visible)
          lastVisibleIndex = j;

      }
    }

    if(this.props.isDarkMode) {
      this.classes[1] = "lightBorders";
    } else {
      this.classes[1] = "darkBorders";
    }

    return (
      <div className={this.classes.join(" ")}>
        {this.props.data.map((promos, row) =>
        filter.groups[row].length != 0 ? (
          <div style={{display: "grid", gridTemplateColumns: "repeat("+filter.groups[row].length+", 1fr)"}}>
            {promos.map((groupe, column) => filter.groups[row].includes(column) && groupe.visible ? (
                <div className="subCase" style={{gridRow: groupe.row,
                                                gridColumnStart: groupe.columnStart, gridColumnEnd: groupe.columnEnd,
                                                backgroundColor: groupe.bgColor, color: groupe.txtColor,
                                                opacity: this.getOpacity(groupe)}}>
                    <div>
                      <span>{groupe.module}</span>
                      <span>{groupe.profNom}</span>
                      <span>{groupe.salle}</span>
                    </div>
                </div>) : null)
            }
          </div>
        ) : null)}
      </div>
    );
  }
}

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
    this.hide = this.hide.bind(this);
    MessageBox.instance = this;
  }

  static show(lines) {
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
      <div id="msgBoxBg" onClick={this.hide}>
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

/**
 * Le composant FilterChooser regroupe tous les sous-composants servant à filtrer les données de l'emploi du temps en terme d'affichage
 * FilterChooser component contains all the sub-components that are used for filtering the schedule data in terms of data display
 */
class FilterChooser extends Component {
  render() {
    return (
      <div id="filterBox">
        <h3>Filtres : </h3>
        <div id="groups">
          <h4>Groupe : </h4>
          <div>   {/* TODO : Transformer ces divs en un nouveau composant ? */}
            <h5>1ere année :</h5>
              <div className="groupChooser">
              {GROUPES[0].map((gr, index) => <div onClick={() => this.props.onFilterChanged("group", {promo: 0, group: index})} className={this.props.filter.groups[0].includes(index) && !this.props.isFirstFilter ? "selected" : ""}>{gr}</div>)}
              </div>
            </div>
          <div>
            <h5>2nde année :</h5>
            <div className="groupChooser">
              {GROUPES[1].map((gr, index) => <div onClick={() => this.props.onFilterChanged("group", {promo: 1, group: index})} className={this.props.filter.groups[1].includes(index) && !this.props.isFirstFilter ? "selected" : ""}>{gr}</div>)}
            </div>
          </div>
        </div>
        <div>
          <h4>Semaine : </h4>
          <WeekSelector isDarkMode={this.props.isDarkMode} week={this.props.filter.week} year={this.props.filter.year} onWeekChanged={(value) => this.props.onFilterChanged("week", value)}/>
        </div>
        <div>
          <h4>Professeur : </h4>
          <Select  classes={{root: this.props.isDarkMode ? "whiteTxt" : ""}} value={this.props.filter.profNom} onChange={(e) => this.props.onFilterChanged("profNom", e.target.value)}>
            {profs.map(nom => <MenuItem value={nom}>{nom}</MenuItem>)}
          </Select>
        </div>
        <div>
          <h4>Salle : </h4>
          <Select classes={{root: this.props.isDarkMode ? "whiteTxt" : ""}} value={this.props.filter.salle} onChange={(e) => this.props.onFilterChanged("salle", e.target.value)}>
            {salles.map(nom => <MenuItem value={nom}>{nom}</MenuItem>)}
          </Select>
        </div>
        <div>
          <h4>Module : </h4>
          <Select classes={{root: this.props.isDarkMode ? "whiteTxt" : ""}} value={this.props.filter.module} onChange={(e) => this.props.onFilterChanged("module", e.target.value)}>
            {modules.map(nom => <MenuItem value={nom}>{nom}</MenuItem>)}
          </Select>
        </div>
      </div>
    );
  }
}

class ThemeSelector extends Component {
  render() {
    if(this.props.isDarkMode) {
      return (
        <div id="themeSelector" className="lightBorders" onClick={() => this.props.onThemeChanged(false)}>
          <Icon>wb_sunny</Icon>
        </div>
      );
    }else{
      return (
        <div id="themeSelector" className="darkBorders" onClick={() => this.props.onThemeChanged(true)}>
          <Icon>brightness_3</Icon>
        </div>
      );
    }
  }
}

/**
 * Main Application :
 * - Load the Schedule data from IUT's server.
 * 
 */
class App extends Component {
  constructor(props) {
    super(props);
    
    this.onFilterChanged = this.onFilterChanged.bind(this);
    this.setTheme = this.setTheme.bind(this);

    let groupFilter;
    
    var lastGroupFilter = localStorage.getItem("lastGroupFilter");
    var lastBackup = localStorage.getItem("backup");
    var darkMode = localStorage.getItem("isDarkMode");

    if(lastGroupFilter) 
      groupFilter = JSON.parse(lastGroupFilter);
    else
      groupFilter = [[0, 1, 2, 3, 4, 5, 6, 7],
                    [0, 1, 2, 3, 4, 5, 6, 7]];

    console.error(darkMode);

    this.state = {isDarkMode: darkMode != undefined,
                  isFirstFilter: lastGroupFilter == undefined,
                  edtData: [],
                  filter: {       // Sortir ces attributs du filter ?
                    week: defaultWeek,
                    year: defaultYear,
                    groups: groupFilter,
                    module: "TOUS",   // Current selected module
                    profNom: "TOUS",  // Current selected prof
                    salle: "TOUTES"   // Current selected room
                  },
                  isMobile: false     // TRUE if screen width < 640
                 };

    if(lastBackup) {
      setTimeout(() => this.onDataLoaded(JSON.parse(lastBackup), defaultWeek, defaultYear, true), 0);
    }

    this.loadData(defaultWeek, defaultYear);

    this.onWindowResized = this.onWindowResized.bind(this);

    window.addEventListener("resize", this.onWindowResized);
    this.setTheme(darkMode != undefined);

    /*
    Structuration : 
    Tableau a 5 colonnes (jours), 6 lignes (heures)  /!\ Colonnes avant lignes dans la structure pour que
    ce soit plus simple de récupérer qu'une colonne
    (cf. Mobiles)
    Chaque case est composée d'un tableau a 2 lignes (promo), 8 colonnes (groupes)
    Chaque case est composée de module, prof_nom, salle, bg_color, txt_color
    */
  }
  
  /**
   * This function is used to track the screen width changes -> if the width goes under 640px, the mobile display is set
   * @param {*} e Window Resized Event
   */
  onWindowResized(e) {
    let isMobile = window.innerWidth < 640;
    if(this.state && this.state.isMobile != isMobile)
      this.setState({isMobile: isMobile});
    var r1 = this.adaptGroupsPreferredSelectedAmount(0);
    var r2 = this.adaptGroupsPreferredSelectedAmount(1);
    if(r1 || r2)
      this.setState({filter: this.state.filter}); // (lol)
  }

  loadData(week, year) {
    fetch("https://edt-relai.yo.fr/fetch.php?infos=1&year="+year+"&week="+week).then(data => data.text().then(txt => this.onDataLoaded(txt, week, year))).catch(error => console.log(error));
  }

  onDataLoaded(data, week, year, isBackup) {
    if(!isBackup)
      localStorage.setItem("backup", JSON.stringify(data));
    profs = ["TOUS"];   // A sortir du contexte global ?
    modules = ["TOUS"];
    salles = ["TOUTES"];

    var edtData = [];
    var lines = data.split("\n");
    lines.shift();
    var tbl = [];
    var infosTbl = [];
    let i = 0;
    let line = lines[i++];
    while(line) {
      tbl.push(line.split(","));
      line = lines[i++];
    }
    
    line = lines[++i];
    while(line) {
      infosTbl.push(line.split(","));
      line = lines[i++];
    }

    for(let i = 0; i < 7; i++) {    // Schedule lines creation (hours)
      edtData[i] = [];
      for(let j = 0; j < 5; j++) {    // Schedule columns creation (days)
          edtData[i][j] = [];
          if(i == 3)
            continue;
        for(let k = 0; k < 2; k++) {    // Schedule sub cases lines creation (promos)
          edtData[i][j][k] = [];
          for(let l = 0; l < 8; l++) {    // Schedule sub cases columns creation (groupes)
            edtData[i][j][k][l] = [];
          }
        }
      }
    }
    
    for(let i = 0; i < tbl.length; i++) {
      let jour = tbl[i][JOUR];
      let heure = tbl[i][HEURE];
      if(heure >= 3)  // bricolage
        heure++;
      let promo = Number.parseInt(tbl[i][GPE_PROMO].replace("INFO", ""))-1;
      let groups = [];

      if(tbl[i][GPE_NOM] == "LP"){
        promo = 1;
        groups[0] = 7;
      }else if(tbl[i][GPE_NOM] == "CE") {
        groups = [0, 1, 2, 3, 4, 5, 6];
        if(promo == 0)
          groups.push(7);
      } else if(tbl[i][GPE_NOM].length == 2) {
        groups[0] = GROUPES[0].indexOf(tbl[i][GPE_NOM]);
      } else {
        let grs = tbl[i][GPE_NOM].split("");
        for(let gr of grs) {
          let index = GROUPES2.indexOf(gr);
          groups.push(index);
          if(promo == 0 || (promo == 1 && gr != "4"))
            groups.push(index+1);           // 4A uniquement, pas 4B car 4B <=> LP
        }
      }

      for(let group of groups) {
        edtData[heure][jour][promo][group] = {
          module: tbl[i][MODULE],
          profNom: tbl[i][PROF_NOM],
          salle: tbl[i][ROOM],
          bgColor: tbl[i][COLOR_BG],
          txtColor: tbl[i][COLOR_TXT]
        };

        if(!profs.includes(tbl[i][PROF_NOM]))
          profs.push(tbl[i][PROF_NOM]);

        if(!salles.includes(tbl[i][ROOM]))
          salles.push(tbl[i][ROOM]);

        if(!modules.includes(tbl[i][MODULE]))
          modules.push(tbl[i][MODULE]);
        }
      }

      for(let i = 0; i < infosTbl.length; i++) {
        let column = Number.parseInt(infosTbl[i][1]);
        let line = Number.parseInt(infosTbl[i][3]) || 0;

        if(!edtData[3][column][line])
          edtData[3][column][line] = {};
        edtData[3][column][line].txt = infosTbl[i][4];
        edtData[3][column][line].fillColor = infosTbl[i][6];
        edtData[3][column][line].txtColor = infosTbl[i][7];
        edtData[3][column][line].url = infosTbl[i][5];
      }

      let days = [];
      let d = getDateOfWeek(week, year);
      for(let i = 0; i < 5; i++) {
        let day = d.getUTCDate();
        let month = d.getUTCMonth()+1;
        if(day < 10)
          day = "0"+day;
        if(month < 10)
          month = "0"+month;
        days[i] = day+"/"+month;
        d.setUTCDate(d.getUTCDate()+1);
      }

      this.setState({edtData: edtData, days: days});
      this.onWindowResized();
    }

    onFilterChanged(prop, newValue) {
      var newFilter = this.state.filter;
      var isFirstFilter = this.state.isFirstFilter;
      if(prop == "group") {
        var promo = newValue.promo, group = newValue.group;
        if(this.state.isFirstFilter) {
          newFilter.groups[promo] = [group];
          newFilter.groups[promo==1?0:1] = [];
        }else {
          let index = newFilter.groups[promo].indexOf(group);
          if(index >= 0)
            newFilter.groups[promo].splice(index, 1);
          else {
            newFilter.groups[promo].push(group);
            this.adaptGroupsPreferredSelectedAmount(promo);
          }
          newFilter.groups[promo].sort();
        }
        localStorage.setItem("lastGroupFilter", JSON.stringify(newFilter.groups));
        isFirstFilter = false;
      } else if(prop == "week") {
        this.loadData(newValue.week, newValue.year);
      } else {
        newFilter[prop] = newValue;
      }
      // this.state.filter === newFilter -> TRUE
      this.setState({filter: newFilter, isFirstFilter: isFirstFilter}); // Débile : this.setState({filter: this.state.filter})...
    }

    adaptGroupsPreferredSelectedAmount(promo) {
      console.log("adapt");
      var rep = false;
      while(this.state.filter.groups[promo].length*24*5+30+40 > window.innerWidth) {
        this.state.filter.groups[promo].shift();
        rep = true;
      }
      return rep;
    }

    setTheme(isDarkMode) {
      let body = document.getElementsByTagName("body")[0];
      if(isDarkMode) {
        localStorage.setItem("isDarkMode", true);
        body.style.backgroundColor = "#444";
        body.style.color = "white";
      } else {
        localStorage.removeItem("isDarkMode");
        body.style.backgroundColor = "white";
        body.style.color = "black";
      }
      this.setState((state, props) => ({
        isDarkMode: isDarkMode
      }));
    }

    render() {
      return (
        <div className="App">
          <h1 id="title">Emploi du temps - IUT de Blagnac</h1>
          <div id="info">
            <p>Alpha 3.0</p>
            <a href="https://github.com/Feavy/EDT-React" target="_blank">Code Source</a>
          </div>
          <ThemeSelector isDarkMode={this.state.isDarkMode} onThemeChanged={this.setTheme}/>
          <FilterChooser isDarkMode={this.state.isDarkMode} filter={this.state.filter} onFilterChanged={this.onFilterChanged}/>
          {this.state.days &&
          <Schedule isDarkMode={this.state.isDarkMode} filter={this.state.filter} days={this.state.days} isMobile={this.state.isMobile} edt={this.state.edtData} />
          }
          <MessageBox/>
        </div>
        );
    }
}

export default App;