import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import FlipMove from 'react-flip-move';

import {checkModelName, getAlertForNameError, getContentForModel} from 'utils/data';
import {getRelativeTime} from 'utils/strings';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from 'components/elements/InputControl/InputControl';
import {ALERT_TYPE_CONFIRM, ALERT_TYPE_ALERT} from 'components/modals/AlertModal/AlertModal';

import styles from './ModelsList.sss';

import ImageIconDelete from 'assets/images/icons/delete.svg';


@CSSModules(styles, {allowMultiple: true})
export default class ModelsList extends Component {
  state = {
    site: this.props.site,
    modelName: "",
    animate: true
  };

  activeInput = null;
  returnFocus = false;



  static getDerivedStateFromProps(props, state) {
    if (props.site == state.site)
      return null;

    return {
      modelName: "",
      animate: false,
      site: props.site
    };
  }

  componentDidUpdate() {
    if (!this.props.alertShowing && this.returnFocus && this.activeInput) {
      this.returnFocus = false;
      setTimeout(() => this.activeInput.focus(), 1);
    }

    if (this.state.animate == false)
      this.setState({animate: true});
  }

  onModelNameChange = name => {
    this.setState({modelName: name});
  };

  onKeyDown = event => {
    event.stopPropagation();

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
    } else {
      this.props.addModel(this.state.modelName);
      this.setState({modelName: ""});
    }
    this.returnFocus = true;
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
    const {models} = this.state.site;

    return (
      <ContainerComponent title='Models'>
        <div styleName="content">
          <div styleName="list">
            <FlipMove duration={250}
                      enterAnimation="accordionVertical"
                      leaveAnimation="accordionVertical"
                      maintainContainerHeight
                      disableAllAnimations={!this.state.animate}
                      easing="ease-out">
              {models.length > 0 &&
                <div styleName="list-item list-header" key="header!">
                  <div styleName="colorLabel"></div>
                  <div styleName="name-head">Name</div>
                  <div styleName="fields">Fields</div>
                  <div styleName="updated">Updated</div>
                </div>
              }
              {models.map(model => {
                let updatedDate = model.origin.updatedAt;
                if (!updatedDate)
                  updatedDate = new Date();
                let updatedStr = getRelativeTime(updatedDate);

                let colorStyle = {background: model.color};

                return(
                  <div styleName="list-item" key={model.nameId} onClick={() => this.onModelClick(model)}>
                    <div styleName="colorLabel" style={colorStyle}></div>
                    <div styleName="type">
                      <div styleName="name">{model.name}</div>
                      <div styleName="description">{model.description}</div>
                    </div>
                    <div styleName="fields">{model.fields.length}</div>
                    <div styleName="updated">{updatedStr}</div>
                    {isEditable &&
                      <div styleName="controls">
                        <div styleName="remove control-icon" onClick={event => this.onRemoveClick(event, model)}>
                          <InlineSVG styleName="cross"
                                    src={ImageIconDelete}/>
                        </div>
                      </div>
                    }
                  </div>
                );
              })}
            </FlipMove>
          </div>
          {isEditable &&
              <div styleName="input-wrapper" key="input!">
                <div styleName="input-wrapper-align">
                  <InputControl value={this.state.modelName}
                                label="Add a New Content Type"
                                placeholder=""
                                onChange={this.onModelNameChange}
                                onKeyDown={this.onKeyDown}
                                DOMRef={c => this.activeInput = c}
                                icon="plus"
                                autoFocus
                                onIconClick={this.onAddModel} />
                </div>
              </div>
            }
        </div>
      </ContainerComponent>
    );
  }
}
