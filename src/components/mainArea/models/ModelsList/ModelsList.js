import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import FlipMove from 'react-flip-move';

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

  site = null;

  activeInput = null;
  returnFocus = false;

  animate = true;


  constructor(props) {
    super(props);

    this.site = props.site;
    this.state.models = this.site.models.slice();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && this.returnFocus && this.activeInput) {
      this.returnFocus = false;
      setTimeout(() => this.activeInput.focus(), 1);
    }

    if (nextProps.site != this.site) {
      this.animate = false;
      this.setState({modelName: ""});
    }

    this.site = nextProps.site;
    this.setState({models: this.site.models.slice()});
  }

  componentDidUpdate() {
    this.animate = true;
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

    const error = checkModelName(this.state.modelName);
    if (error) {
      this.props.showAlert(getAlertForNameError(error));
      this.returnFocus = true;
    } else {
      this.props.addModel(this.state.modelName);
      this.setState({modelName: ""});
    }
  };

  onModelClick = model => {
    this.props.gotoModel(model);
  };
  
  onRemoveClick = (event, model) => {
    event.stopPropagation();
  
    let params;
    const contentCount = getContentForModel(model).length;
    if (contentCount) {
      params = {
        title: `Deleting <strong>${model.name}</strong> model`,
        type: ALERT_TYPE_ALERT,
        description: `There are ${contentCount} content items using the model. You should delete them first.`
      };
    } else {
      params = {
        title: `Deleting <strong>${model.name}</strong> model`,
        type: ALERT_TYPE_CONFIRM,
        description: "Are you sure?",
        onConfirm: () => this.props.deleteModel(model)
      };
    }
  
    this.props.showAlert(params);
    this.returnFocus = true;
  };

  render() {
    const {isEditable} = this.props;

    return (
      <ContainerComponent title='Models' backgroundOffset={110}>
        <div styleName="content">
          <div styleName="list">
            <FlipMove duration={250}
                      enterAnimation="accordionVertical"
                      leaveAnimation="accordionVertical"
                      maintainContainerHeight
                      disableAllAnimations={!this.animate}
                      easing="ease-out">
              {this.state.models.length > 0 &&
                <div styleName="list-item list-header">
                  <div styleName="colorLabel"></div>
                  <div styleName="type"></div>
                  <div styleName="fields">FIELDS</div>
                  <div styleName="updated">UPDATED</div>
                </div>
              }
              {this.state.models.map(model => {
                let updatedDate = model.origin.updatedAt;
                if (!updatedDate)
                  updatedDate = new Date();
                let updatedStr = getRelativeTime(updatedDate);

                let colorStyle = {background: model.color};

                return(
                  <div styleName="list-item"
                       key={model.name}
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
                                       src={require("assets/images/cross.svg")}/>
                          </div>
                        </div>
                    }
                  </div>
                );
              })}
              {isEditable &&
                <div styleName="input-wrapper">
                  <div styleName="input-wrapper-back"></div>
                  <div styleName="input">
                    <InputControl value={this.state.modelName}
                                  placeholder="Create a new Content Type"
                                  onChange={this.onModelNameChange}
                                  onKeyDown={this.onKeyDown}
                                  DOMRef={c => this.activeInput = c}
                                  icon="plus"
                                  autoFocus
                                  onIconClick={this.onAddModel} />
                  </div>
                </div>
              }
            </FlipMove>
          </div>
        </div>
      </ContainerComponent>
    );
  }
}
