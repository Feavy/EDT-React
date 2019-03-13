import React, {Component} from 'react';
import { Icon } from '@material-ui/core';


export default class ThemeSelector extends Component {
    render() {
      return (
        <div id="themeSelector" onClick={() => this.props.onThemeChanged(!this.props.isDarkMode)}>
          {this.props.isDarkMode ? (<Icon>wb_sunny</Icon>) : (<Icon>brightness_3</Icon>)}
        </div>
      );
    }
}