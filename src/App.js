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
//import file from './0.csv';
import './App.css';

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

const GROUPES = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"];
const GROUPES2 = ["1",     , "2",      , "3",      ,  "4"];

const GROUPES_2A = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "LP"];

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

var result = getWeekNumber(new Date());

const defaultYear = result[0];
const defaultWeek = result[1];

class WeekSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {value: this.props.value, year: defaultYear};
  }

  onWeekChanged(newValue) {
    if(!isNaN(newValue)) {
      let newYear = this.state.year;
      while(newValue < 2) {
        newValue += 50;
        newYear--;
      }
      while(newValue > 51) {
        newValue -= 50;
        newYear++;
      }
      this.setState({value: newValue, year: newYear});
      if(this.changeTimeout) {
        clearTimeout(this.changeTimeout);
      }
      this.changeTimeout = setTimeout(() => {
        this.props.onWeekChanged({week: this.state.value, year: this.state.year});
      }, 500);
    }
  }

  render() {
    return (
      <div>
        <button type="submit" onClick={(e) => this.onWeekChanged(this.state.value-1)}>◀</button>
        <input type="number" value={this.state.value} onChange={(e) => this.onWeekChanged(Number.parseInt(e.target.value))}></input>
        <button type="submit" onClick={(e) => this.onWeekChanged(this.state.value+1)}>▶</button>
        <p>Année : <span style={{fontWeight: "bold"}}>{this.state.year}</span></p>
      </div>
    )
  }
}

class ScheduleCase extends Component {
  constructor(props) {
    super(props);

    this.updateData = this.updateData.bind(this);
    this.updateData();
    
    this.classes = ["case"];
    if(this.props.isFirstLeft)
      this.classes.push("firstLeft");
    if(this.props.isFirstTop)
      this.classes.push("firstTop");
  }

  updateData() {
    var data = this.props.data;
    for(let i = 0; i < data.length; i++) {
      var lastVisibleIndex = 0;      // Peut-être source de bugs ?
      for(let j = 0; j < data[i].length; j++) {
        let current = data[i][j];

        current.columnStart = j+1;      // Pas forcément : Imaginons le groupe 4B, si les seuls filtres sont [0, 7],
                                        //                 ce groupe appraîtra en colonne 2 et non pas 7
        current.visible = this.props.filter.groups[i].includes(j);
        let c = Math.max(this.props.filter.groups[i].indexOf(j),this.props.filter.groups[i==0?1:0].indexOf(j))+1;
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
  }

  componentWillReceiveProps(props) {
    this.props = props;
    this.updateData();
  }

  render() {
    let filter = this.props.filter;
    var groupsAmount = Math.max(this.props.filter.groups[0].length, this.props.filter.groups[1].length);
    return (
      <div className={this.classes.join(" ")} style={{gridTemplateColumns: "repeat("+groupsAmount+", 1fr)"}}>
        {this.props.data.map((promos, row) => promos.map((groupe, column) => filter.groups[row].includes(column) && groupe.visible ? (
            <div style={{gridRow: groupe.row, gridColumnStart: groupe.columnStart,
            gridColumnEnd: groupe.columnEnd, backgroundColor: groupe.bgColor, color: groupe.txtColor,
            opacity: (filter.module == "TOUS" || filter.module == groupe.module) &&
                      (filter.profNom == "TOUS" || filter.profNom == groupe.profNom) &&
                      (filter.salle == "TOUTES" || filter.salle == groupe.salle) ? 1 : 0.3}} className="subCase">
                <div>
                <span>{groupe.module}</span>
                <span>{groupe.profNom}</span>
                <span>{groupe.salle}</span>
                </div>
            </div>): null /*(<div style={{gridRow: row+1, gridColumn: column+1}} className="subCase"></div>)*/))}
      </div>
    );
  }
}

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.hideMessageBox = this.hideMessageBox.bind(this);
    let groupsLabels = [];
    for(let index in this.props.filter.groups[0]) {
      groupsLabels.push(GROUPES[index]);
    }
    this.state = {
      msgBoxVisible: false,
      msgBoxLines: undefined,
      groupsLabels: groupsLabels
    };
    this.dayIndexes = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven."];
  }

  showMessageBox(lines) {
    console.log("click detected");
    this.setState({
      msgBoxVisible: true,
      msgBoxLines: lines
    });
  }

  hideMessageBox() {
    this.setState({
      msgBoxVisible: false
    });
  }

  render() {
    var debug = 1;
    const {firstDay} = this.props;
    console.log(firstDay);
    return (
      <div id="schedule">
        {this.props.days && this.dayIndexes.map((id, index) => 
          <div>
            <h2 key={id} style={{textAlign: "center"}}>{id+" "+this.props.days[index]}</h2>
          </div>)}
        {this.dayIndexes.map(id => 
          <div style={{display: "grid", gridTemplateColumns: "repeat("+this.props.filter.groups[0].length+", 1fr)"}}>
            {this.props.filter.groups[0].map(index => <span style={{textAlign: "center", overflow:"hidden"}} key={id+"-gr"+index}>{GROUPES[index]}</span>)}
          </div>)}
        {this.props.edt.map((jour, index) => jour.map((heure, index2) => index == 3 ? (
          <div key={index+";"+index2} className="infoCase">
            {heure.lines.length > 0 && this.props.isMobile ? <div key={index+";"+index2+"-i"} className="infoButton" onClick={() => this.showMessageBox(heure.lines)}><span>Infos</span></div> :
            heure.lines.map(line => line.url ? (
                    <a href={line.url} style={{backgroundColor: line.fillColor, color: line.txtColor}}>{line.txt}</a>
                  ) : (
                    <span style={{backgroundColor: line.fillColor, color: line.txtColor}}>{line.txt}</span>)
                  )}
          </div>
      ) : (
          <ScheduleCase isFirstTop={index == 0 || index == 4} isFirstLeft={index2 == 0} debug={debug-- == 1} filter={this.props.filter} data={heure}/>))
      )}
        {this.state.msgBoxVisible && <MessageBox onClose={this.hideMessageBox} lines={this.state.msgBoxLines}/>}
      </div>
    );
  }
}

class MessageBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const lines = this.props.lines;
    return (
      <div id="msgBoxBg" onClick={this.props.onClose}>
        <div id="msgBox">
        {lines.map((line,index) => line.url ? (
          <a key={"msgBoxLine-"+index} href={line.url} target="_blank">{line.txt}</a>
        ) : (
          <span key={"msgBoxLine-"+index}>{line.txt}</span>)
        )}
        </div>
      </div>
    );
  }
}

class FilterChooser extends Component{
  constructor(props) {
    super(props);
    this.state = {week: this.props.filter.week};
    this.currentWeekTimeout = undefined;
  }

  weekChosen(week) {
    this.setState({week: Number.parseInt(week)});
    if(this.currentWeekTimeout) {
      clearTimeout(this.currentWeekTimeout);
    }
    this.currentWeekTimeout = setTimeout(() => {
      this.props.onFilterChanged("week", this.state.week);
    }, 2000);
  }

  render() {
    return (
      <div id="filterBox">
        <h3>Filtres : </h3>
        <div id="groups">
          <h4>Groupe : </h4>
          <div>
            <h5>1ere année :</h5>
              <div className="groupChooser">
              {GROUPES.map((gr, index) => <div onClick={() => this.props.onFilterChanged("group", {promo: 0, group: index})} className={this.props.filter.groups[0].includes(index) && !this.props.firstFilter ? "selected" : ""}>{gr}</div>)}
              </div>
            </div>
          <div>
            <h5>2nde année :</h5>
            <div className="groupChooser">
              {GROUPES_2A.map((gr, index) => <div onClick={() => this.props.onFilterChanged("group", {promo: 1, group: index})} className={this.props.filter.groups[1].includes(index) && !this.props.firstFilter ? "selected" : ""}>{gr}</div>)}
            </div>
          </div>
        </div>
        <div>
          <h4>Semaine : </h4>
          <WeekSelector value={this.state.week} onWeekChanged={(value) => this.props.onFilterChanged("week", value)}/>
        </div>
        <div>
          <h4>Professeur : </h4>
          <select onChange={(e) => this.props.onFilterChanged("profNom", e.target.value)}>
            {profs.map(nom => <option value={nom}>{nom}</option>)}
          </select>
        </div>
        <div>
          <h4>Salle : </h4>
          <select onChange={(e) => this.props.onFilterChanged("salle", e.target.value)}>
            {salles.map(nom => <option value={nom}>{nom}</option>)}
          </select>
        </div>
        <div>
          <h4>Module : </h4>
          <select onChange={(e) => this.props.onFilterChanged("module", e.target.value)}>
            {modules.map(nom => <option value={nom}>{nom}</option>)}
          </select>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    
    this.onFilterChanged = this.onFilterChanged.bind(this);

    let groupFilter;
    
    var lastGroupFilter = localStorage.getItem("lastGroupFilter");

    if(lastGroupFilter) 
      groupFilter = JSON.parse(lastGroupFilter);
    else
      groupFilter = [[0, 1, 2, 3, 4, 5, 6, 7],
                    [0, 1, 2, 3, 4, 5, 6, 7]];

    this.state = {firstFilter: lastGroupFilter == undefined,
                  edtData: [],
                  filter: {
                    week: defaultWeek,
                    year: defaultYear,
                    groups: groupFilter,
                    module: "TOUS",
                    profNom: "TOUS",
                    salle: "TOUTES"
                  },
                  isMobile: false
                 };

    fetch("https://edt-relai.000webhostapp.com/fetch.php?infos=1&year="+defaultYear+"&week="+this.state.filter.week).then(data => data.text().then(txt => this.onDataLoaded(txt, defaultWeek, defaultYear))).catch(error => console.log(error));

    this.onWindowResized = this.onWindowResized.bind(this);

    window.addEventListener("resize", this.onWindowResized);

    /*
    Structuration : 
    Tableau a 5 colonnes (jours), 6 lignes (heures)  /!\ Colonnes avant lignes dans la structure pour que
    ce soit plus simple de récupérer qu'une colonne
    (cf. Mobiles)
    Chaque case est composée d'un tableau a 2 lignes (promo), 8 colonnes (groupes)
    Chaque case est composée de module, prof_nom, salle, bg_color, txt_color
    */
  }
  
  onWindowResized(e) {
    let isMobile = window.innerWidth < 529;
    if(this.state && this.state.isMobile != isMobile)
      this.setState({isMobile: isMobile});
  }

  onDataLoaded(data, week, year) {
    profs = ["TOUS"];
    modules = ["TOUS"];
    salles = ["TOUTES"];

    var showInfos = true;

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
    
    if(showInfos) {
      line = lines[++i];//=2];
      while(line) {
        infosTbl.push(line.split(","));
        line = lines[i++];
      }
    }

    for(let i = 0; i < 7; i++) {    // Creation heures
      edtData[i] = [];
      for(let j = 0; j < 5; j++) {    // Creation jours
        if(i == 3) {
          edtData[i][j] = {lines: []};
          continue;
        } else
          edtData[i][j] = [];
        for(let k = 0; k < 2; k++) {    // Creation promos
          edtData[i][j][k] = [];
          for(let l = 0; l < 8; l++) {    // Creation groupes
            edtData[i][j][k][l] = [];
          }
        }
      }
    }
    
    for(let i = 0; i < tbl.length; i++) {
      let jour = tbl[i][JOUR];
      let heure = tbl[i][HEURE];
      if(heure >= 3)
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
        groups[0] = GROUPES.indexOf(tbl[i][GPE_NOM]);
      } else {
        let grs = tbl[i][GPE_NOM].split("");
        for(let gr of grs) {
          let index = GROUPES2.indexOf(gr);
          groups.push(index);
          if(promo == 0 || (promo == 1 && gr != "4"))
            groups.push(index+1);
        }
      }
      for(let group of groups) {
        if(heure == 3)
          console.error("wtf");
        edtData[heure][jour][promo][group] = {module: tbl[i][MODULE],
          profNom: tbl[i][PROF_NOM],
          salle: tbl[i][ROOM],
          bgColor: tbl[i][COLOR_BG],
          txtColor: tbl[i][COLOR_TXT]};

          if(!profs.includes(tbl[i][PROF_NOM]))
            profs.push(tbl[i][PROF_NOM]);

          if(!salles.includes(tbl[i][ROOM]))
            salles.push(tbl[i][ROOM]);

          if(!modules.includes(tbl[i][MODULE]))
            modules.push(tbl[i][MODULE]);

        }
      }

      if(showInfos) {
        for(let i = 0; i < infosTbl.length; i++) {
          let column = Number.parseInt(infosTbl[i][1]);
          let line = Number.parseInt(infosTbl[i][3]) || 0;
          if(!edtData[3][column].lines[line])
            edtData[3][column].lines[line] = {};
          edtData[3][column].lines[line].txt = infosTbl[i][4];
          edtData[3][column].lines[line].fillColor = infosTbl[i][6];
          edtData[3][column].lines[line].txtColor = infosTbl[i][7];
          edtData[3][column].lines[line].url = infosTbl[i][5];
        }
      }

      let days = [];
      let d = getDateOfWeek(week, year);
      console.log(d);
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
      var firstFilter = this.state.firstFilter;
      if(prop == "group") {
        var promo = newValue.promo, group = newValue.group;
        if(this.state.firstFilter) {
          newFilter.groups[promo] = [group];
          newFilter.groups[promo==1?0:1] = [];
        }else {
          let index = newFilter.groups[promo].indexOf(group);
          if(index >= 0)
            newFilter.groups[promo].splice(index, 1);
          else
            newFilter.groups[promo].push(group);
          newFilter.groups[promo].sort();
        }
        localStorage.setItem("lastGroupFilter", JSON.stringify(newFilter.groups));
        firstFilter = false;
      } else if(prop == "week") {
        fetch("https://edt-relai.000webhostapp.com/fetch.php?infos=1&year="+newValue.year+"&week="+newValue.week).then(data => data.text().then(txt => this.onDataLoaded(txt, newValue.week, newValue.year))).catch(error => console.log(error));
      } else {
        newFilter[prop] = newValue;
      }
      this.setState({filter: newFilter, firstFilter: firstFilter});
    }

    render() {
      console.log(this.state.filter);
      return (
        <div className="App">
          <h1 id="title">Emploi du temps - IUT de Blagnac</h1>
          <div id="info">
            <p>Alpha 2.0</p>
            <a href="https://github.com/Feavy/EDT-React" target="_blank">Code Source</a>
          </div>
          <FilterChooser filter={this.state.filter} onFilterChanged={this.onFilterChanged}/>
          <Schedule days={this.state.days} isMobile={this.state.isMobile} filter={this.state.filter} edt={this.state.edtData} />
        </div>
        );
      }
    }
    
    export default App;
