/**
 * <!> Attention <!>
 * 
 * Le code est pour l'instant hideux, il
 * sera refactorisé et commenté très prochainement (lol).
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

import Schedule from './Schedule';
import ThemeSelector from './ThemeSelector';
import FilterChooser from './FilterChooser';
import MessageBox from './MessageBox';
import { GROUPES, GROUPES2 } from './Globals';

const version = "Alpha 3.2";

global.profs = ["TOUS"];
global.modules = ["TOUS"];
global.salles = ["TOUTES"];

const ID_COURS = 0,
NUM_COURS = 1,
PROF_NOM = 2,
GPE_NOM = 3,
GPE_PROMO = 4,
MODULE = 5,
ROOM_TYPE = 6,
ROOM = 7,

COLOR_BG = 9,
COLOR_TXT = 10,
JOUR = 11,
HEURE = 12;

const JOURS = {'m': 0, 'tu': 1, 'w': 2, 'th': 3, 'f': 4};
var HEURES = [];
for(let heure of [8, 9.5, 11, 14.25, 15.75, 17.25]) {
  HEURES.push(heure * 60);
}

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
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

let d = new Date();
d.setUTCDate(d.getUTCDate()+2);

var result = getWeekNumber(d);

const defaultYear = result[0];
const defaultWeek = result[1];

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
    var lastWeek = localStorage.getItem("week");
    var darkMode = localStorage.getItem("isDarkMode");

    if(lastGroupFilter) 
      groupFilter = JSON.parse(lastGroupFilter);
    else
      groupFilter = [[0, 1, 2, 3, 4, 5, 6, 7],
                    [0, 1, 2, 3, 4, 5, 6, 7]];

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

    this.selectedWeek = defaultWeek;

    if(lastBackup && lastWeek == defaultWeek)
      setTimeout(() => this.onDataLoaded(JSON.parse(lastBackup), defaultWeek, defaultYear, true), 0);

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
    var self = this;
    var xml = new XMLHttpRequest();
    xml.open("GET", "https://edt-relai.yo.fr/fetch.php?infos=1&year="+year+"&week="+week);
    xml.send();
    xml.addEventListener("loadend", function(req, e) {
      if(xml.status == 200) {
        self.onDataLoaded(xml.responseText, week, year);
      }
    });
  }

  onDataLoaded(data, week, year, isBackup) {
    if(!isBackup && week == defaultWeek) {
      localStorage.setItem("backup", JSON.stringify(data));
      localStorage.setItem("week", defaultWeek+"")
    }
    if(week != this.selectedWeek)
      return;
    global.profs = ["TOUS"];   // A sortir du contexte global ?
    global.modules = ["TOUS"];
    global.salles = ["TOUTES"];

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
      let jour = JOURS[tbl[i][JOUR]];
      let heure = HEURES.indexOf(Number.parseInt(tbl[i][HEURE]));
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
        if(!global.profs.includes(tbl[i][PROF_NOM]))
          global.profs.push(tbl[i][PROF_NOM]);

        if(!global.salles.includes(tbl[i][ROOM]))
          global.salles.push(tbl[i][ROOM]);

        if(!global.modules.includes(tbl[i][MODULE]))
          global.modules.push(tbl[i][MODULE]);
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
      d.setUTCDate(d.getUTCDate()+1);
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
        this.selectedWeek = newValue.week;
        this.loadData(newValue.week, newValue.year);
      } else {
        newFilter[prop] = newValue;
      }
      this.setState({filter: newFilter, isFirstFilter: isFirstFilter}); // Débile : this.setState({filter: this.state.filter})...
    }

    adaptGroupsPreferredSelectedAmount(promo) {
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
        <div className="App" style={{borderColor: this.state.isDarkMode ? "white" : "#444"}}>
          <h1 id="title">Emploi du temps - IUT de Blagnac</h1>
          <div id="info">
            <p>{version}</p>
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