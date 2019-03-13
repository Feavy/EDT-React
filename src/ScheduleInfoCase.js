import React, {Component} from 'react';
import MessageBox from './MessageBox';

/**
 * NOK : Rajouter les keys
 */
export default class ScheduleInfoCase extends Component {
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