import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {ModelData} from '../../../../models/ModelData';

import styles from './ModelsList.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ModelsList extends Component {
  state = {
    models: [],
    modelName: ""
  };
  
  componentWillReceiveProps(nextProps) {
    this.setState({models: nextProps.modelsCurrent});
  }
  
  onModelNameChange = event => {
    let name = event.target.value;
    name = name.replace(/\s+/g, '');
    this.setState({modelName: name});
  };
  
  onAddModel = () => {
    if (!this.state.modelName)
      return;
    
    const {addModel} = this.props;
  
    let model = new ModelData();
    model.name = this.state.modelName;
  
    let red   = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue  = Math.floor(Math.random() * 256);
    model.color = `rgba(${red}, ${green}, ${blue}, 1)`;
  
    addModel(model);
  };

  render() {
    return (
      <div className="g-container" styleName="models">
        <div className="g-title">
          Models
        </div>
        <form>
          <div styleName="list">
            <div styleName="list-item list-header">
              <div styleName="type">
              </div>
              <div styleName="fields">
                FIELDS
              </div>
              <div styleName="updated">
                UPDATED
              </div>
            </div>
  
            {
              this.state.models.map(model => {
                let updatedDate = model.origin.updatedAt;
                if (!updatedDate)
                  updatedDate = new Date();
                let updatedStr = updatedDate.toLocaleString("en-US", {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'});
                
                return(
                  <div styleName="list-item" key={model.name}>
                    <div styleName="type">
                      <div styleName="name">{model.name}</div>
                      <div styleName="description">{model.description}</div>
                    </div>
                    <div styleName="fields">{model.fields.length}</div>
                    <div styleName="updated">{updatedStr}</div>
                  </div>
                );
              })
            }
          </div>
          <div styleName="create-new">
            <input styleName="input"
                   value={this.state.modelName}
                   placeholder="Create a new Content Type"
                   onChange={this.onModelNameChange} />
            <InlineSVG styleName="plus" src={require("./plus.svg")} onClick={this.onAddModel} />
          </div>
        </form>
      </div>
    );
  }
}
