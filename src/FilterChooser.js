import React, {Component} from 'react';
import { GROUPES } from './Globals';
import WeekSelector from './WeekSelector';
import { Select, MenuItem } from '@material-ui/core';

/**
 * Le composant FilterChooser regroupe tous les sous-composants servant à filtrer les données de l'emploi du temps en terme d'affichage
 * FilterChooser component contains all the sub-components that are used for filtering the schedule data in terms of data display
 */
export default class FilterChooser extends Component {
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
                {GROUPES[1].map((gr, index) => index < 7 && (<div onClick={() => this.props.onFilterChanged("group", {promo: 1, group: index})} className={this.props.filter.groups[1].includes(index) && !this.props.isFirstFilter ? "selected" : ""}>{gr}</div>))}
              </div>
            </div>
            <div id="lp">
              <div className="groupChooser">
                <div onClick={() => this.props.onFilterChanged("group", {promo: 1, group: 7})} className={this.props.filter.groups[1].includes(7) && !this.props.isFirstFilter ? "selected" : ""}>LP</div>
              </div>
            </div>
          </div>
          <div>
            <h4>Semaine : </h4>
            <WeekSelector isDarkMode={this.props.isDarkMode} week={this.props.filter.week} year={this.props.filter.year} onWeekChanged={(value) => this.props.onFilterChanged("week", value)}/>
          </div>
          <div>
            <h4>Professeur : </h4>
            <Select classes={{root: this.props.isDarkMode ? "whiteTxt whiteBorder" : "", icon: this.props.isDarkMode ? "whiteTxt" : ""}} value={this.props.filter.profNom} onChange={(e) => this.props.onFilterChanged("profNom", e.target.value)}>
              {global.profs.map(nom => <MenuItem value={nom}>{nom}</MenuItem>)}
            </Select>
          </div>
          <div>
            <h4>Salle : </h4>
            <Select classes={{root: this.props.isDarkMode ? "whiteTxt whiteBorder" : "", icon: this.props.isDarkMode ? "whiteTxt" : ""}} value={this.props.filter.salle} onChange={(e) => this.props.onFilterChanged("salle", e.target.value)}>
              {global.salles.map(nom => <MenuItem value={nom}>{nom}</MenuItem>)}
            </Select>
          </div>
          <div>
            <h4>Module : </h4>
            <Select classes={{root: this.props.isDarkMode ? "whiteTxt whiteBorder" : "", icon: this.props.isDarkMode ? "whiteTxt" : ""}} value={this.props.filter.module} onChange={(e) => this.props.onFilterChanged("module", e.target.value)}>
              {global.modules.map(nom => <MenuItem value={nom}>{nom}</MenuItem>)}
            </Select>
          </div>
        </div>
      );
    }
  }