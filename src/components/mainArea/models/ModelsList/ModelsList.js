import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {checkModelName, getAlertForNameError, getContentForModel} from 'utils/data';
import {getRelativeTime} from 'utils/common';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from 'components/elements/InputControl/InputControl';
import {ALERT_TYPE_CONFIRM, ALERT_TYPE_ALERT} from 'components/modals/AlertModal/AlertModal';

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

    let error = checkModelName(this.state.modelName);
    if (error) {
      const {showAlert} = this.props;
      showAlert(getAlertForNameError(error));
      return;
    }

    const {addModel} = this.props;
    addModel(this.state.modelName);

    this.setState({modelName: ""});
  };

  onModelClick = model => {
    const {gotoModel} = this.props;
    gotoModel(model);
  };
  
  onRemoveClick = (event, model) => {
    event.stopPropagation();
    const {showAlert, deleteModel} = this.props;
  
    let params;
    let contentCount = getContentForModel(model).length;
    if (contentCount) {
      params = {
        type: ALERT_TYPE_ALERT,
        title: `Deleting ${model.name} model`,
        description: `There are ${contentCount} content items using the model. You should delete them first.`
      };
    } else {
      params = {
        type: ALERT_TYPE_CONFIRM,
        title: `Deleting ${model.name} model`,
        description: "Are you sure?",
        onConfirm: () => deleteModel(model)
      };
    }
     
    showAlert(params);
  };

  render() {
    const {isEditable} = this.props;

    return (
      <ContainerComponent title='Models'>
        <div styleName="content">
          <div styleName="list">
            {
              this.state.models.length > 0 &&
                <div styleName="list-item list-header">
                  <div styleName="colorLabel"></div>
                  <div styleName="type"></div>
                  <div styleName="fields">FIELDS</div>
                  <div styleName="updated">UPDATED</div>
                </div>
            }
            {
              this.state.models.map(model => {
                let updatedDate = model.origin.updatedAt;
                if (!updatedDate)
                  updatedDate = new Date();
                let updatedStr = getRelativeTime(updatedDate);

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
                    {
                      isEditable &&
                        <div styleName="hidden-controls">
                          <div styleName="hidden-remove" onClick={event => this.onRemoveClick(event, model)}>
                            <InlineSVG styleName="cross"
                                       src={require("./cross.svg")}/>
                          </div>
                        </div>
                    }
                  </div>
                );
              })
            }
          </div>
          {
            isEditable &&
              <div styleName="input-wrapper">
                <InputControl value={this.state.modelName}
                              autoFocus={true}
                              placeholder="Create a new Content Type"
                              onChange={this.onModelNameChange}
                              onKeyDown={this.onKeyDown}
                              DOMRef={c => this.activeInput = c}
                              icon="plus"
                              onIconClick={this.onAddModel} />
              </div>
          }
        </div>
      </ContainerComponent>
    );
  }
}
