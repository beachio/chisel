import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {ModelData} from 'models/ModelData';
import {checkModelName} from 'utils/data';

import styles from './ModelsList.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ModelsList extends Component {
  state = {
    models: [],
    modelName: ""
  };
  activeInput = null;


  componentWillMount() {
    this.setState({models: this.props.models});
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && this.activeInput)
      this.activeInput.focus();
    this.setState({models: nextProps.models});
    if (nextProps.models != this.state.models)
      this.setState({modelName: ""});
  }

  onModelNameChange = event => {
    let name = event.target.value;
    this.setState({modelName: name});
  };

  onKeyDown = event => {
    if (this.props.alertShowing)
      return;
    //Enter pressed
    if (event.keyCode == 13) {
      this.onAddModel();
    //Esc pressed
    } else if (event.keyCode == 27) {
      this.setState({modelName: ""});
    }
  };

  onAddModel = event => {
    if (event)
      event.preventDefault();

    if (!this.state.modelName)
      return;

    if (!checkModelName(this.state.modelName)) {
      const {showAlert} = this.props;
      let params = {
        title: "Warning",
        description: "This name is already using. Please, select another one.",
        buttonText: "OK"
      };
      showAlert(params);
      return;
    }

    const {addModel} = this.props;

    let model = new ModelData();
    model.name = this.state.modelName;

    let red   = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue  = Math.floor(Math.random() * 256);
    model.color = `rgba(${red}, ${green}, ${blue}, 1)`;

    addModel(model);

    this.setState({modelName: ""});
  };

  onModelClick = model => {
    const {setCurrentModel} = this.props;
    setCurrentModel(model);
  };

  render() {
    return (
      <div className="g-container" styleName="models">
        <div className="g-title">
          Models
        </div>
        <div>
          <div styleName="list">
            <div styleName="list-item list-header">
              <div styleName="colorLabel"></div>
              <div styleName="type"></div>
              <div styleName="fields">FIELDS</div>
              <div styleName="updated">UPDATED</div>
            </div>

            {
              this.state.models.map(model => {
                let updatedDate = model.origin.updatedAt;
                if (!updatedDate)
                  updatedDate = new Date();
                let updatedStr = updatedDate.toLocaleString("en-US",
                  {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'});

                let colorStyle = {background: model.color};
                let key = model.origin && model.origin.id ? model.origin.id : Math.random();

                return(
                  <div styleName="list-item"
                       key={key}
                       onClick={() => this.onModelClick(model)}>
                    <div styleName="colorLabel" style={colorStyle}></div>
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
                   autoFocus={true}
                   placeholder="Create a new Content Type"
                   onChange={this.onModelNameChange}
                   onKeyDown={this.onKeyDown}
                   ref={c => this.activeInput = c} />
            <InlineSVG styleName="plus"
                       src={require("./plus.svg")}
                       onClick={this.onAddModel} />
          </div>
        </div>
      </div>
    );
  }
}
