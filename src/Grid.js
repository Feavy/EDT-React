import React, {Component} from 'react';

class Grid extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    if(!this.props.children)
      return null;
    const linesAmount = this.props.children.length || 1;
    let columnsAmount;
    
    var childs = [];

    for(let i = 0; i < this.props.children.length; i++) {
        if(!this.props.children[i])
            continue;
        childs[i] = [];
        for(let j = 0; j < this.props.children[i].length; j++) {
            childs[i][j] = this.props.children[i][j];
        }
    }

    var xPos = [];

    var rows = [];

    for(let i = 0; i < linesAmount; i++) {
        xPos[i] = [];
      var columns = [];
      let rowWidth = 0;
      let currentChild = linesAmount == 1 ? this.props.children : this.props.children[i];
      if(!currentChild.props)
        continue;
      columnsAmount = currentChild.props.children.length;   // PB : Les childs 'false' sont aussi comptés
      if(columnsAmount) {
        for(let j = 0; j < columnsAmount; j++) {
            xPos[i][j] = rowWidth+1
            if(!currentChild.props.children[j]) {
                rowWidth++;
                continue;
            }
          rowWidth += currentChild.props.children[j].props.width || 1;
          columns.push(currentChild.props.children[j]);
        }
        rows[i] = columns;
        rows[i].width = rowWidth;
      } else {
          xPos[i][0] = 1;
        rows[i] = [this.props.children[i].props.children];
        rows[i].width = 1;
      }
    }
    
    return (
      <div class="grid">
        {rows.map((row, i) => (
          <div style={{display: "grid", gridTemplateColumns: "repeat("+row.width+", 1fr)"}}>
            {row.map((column, j) => (
              <div style={{gridColumnStart: xPos[i][j],
                           gridColumnEnd: xPos[i][j]+(column.props.width ? column.props.width : 0)}}>
                {column}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Grid;