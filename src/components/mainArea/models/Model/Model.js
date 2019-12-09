import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import {browserHistory} from 'react-router';

import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from 'components/elements/InputControl/InputControl';
import EditableTitleControl from 'components/elements/EditableTitleControl/EditableTitleControl';
import JSONView from 'components/elements/JSONView/JSONView';
import {removeOddSpaces} from 'utils/strings';
import {getNameId, checkModelName, checkFieldName, getAlertForNameError, getContentForModel, NAME_ERROR_OTHER} from 'utils/data';
import {MODAL_TYPE_FIELD} from 'ducks/nav';
import {ALERT_TYPE_CONFIRM, ALERT_TYPE_ALERT} from 'components/modals/AlertModal/AlertModal';
import {ModelFieldData} from 'models/ModelData';

import styles from './Model.sss';

import ImageIconDelete from 'assets/images/icons/delete.svg';


const DragHandle = SortableHandle(({color}) =>
  (<div className={styles.listItemColor} style={{background: color}}></div>)
);

const SortableItem = SortableElement(({field, isEditable, onFieldClick, onRemoveClick}) => {
  let style = [styles.listItem];
  if (field.isDisabled)
    style.push(styles.listItemDisabled);

  return (
    <div className={style.join(' ')} onClick={() => onFieldClick(field)}>
      <div className={styles.listItemName}>{field.name}</div>
      <div className={styles.listItemType}>
        {field.type} - {field.appearance}
      </div>
      <div className={styles.listButtons}>
        {field.isTitle &&
          <div className={styles.titleButton}>Title</div>
        }
        {(!field.isTitle && field.isRequired) &&
          <div className={styles.requiredButton}>Required</div>
        }
      </div>
      {isEditable &&
        <div className={styles.controls}>
          <div className={styles.controlIcon} onClick={event => onRemoveClick(event, field)}>
            <InlineSVG className={styles.cross}
                      src={ImageIconDelete}/>
          </div>
        </div>
      }
    </div>
  );
});

const SortableList = SortableContainer(({fields, isEditable, onFieldClick, onRemoveClick}) => {
  return (
    <div>
      {fields.map((field, index) => (
        <SortableItem key={field.origin.id}
                      index={index}
                      field={field}
                      isEditable={isEditable}
                      onFieldClick={onFieldClick}
                      onRemoveClick={onRemoveClick} />
      ))}
    </div>
  );
});


@CSSModules(styles, {allowMultiple: true})
export default class Model extends Component {
  state = {
    fields: this.props.model.fields,
    fieldName: "",
    jsonVisibility: false
  };

  activeInput = null;
  returnFocus = false;
  titleActive = false;


  //TODO вопрос: в какой ситуации понадобится обновлять модель? Не могу понять.
  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && !nextProps.modalShowing) {
      if (this.titleActive) {
        this.titleActive = false;
        this.controlTitle.onEditClick();

      } else if (this.activeInput && this.returnFocus) {
        this.returnFocus = false;
        setTimeout(() => this.activeInput.focus(), 1);
      }
    }

    this.setState({fields: nextProps.model.fields});
  }

  onFieldNameChange = name => {
    this.setState({fieldName: name});
  };

  onAddKeyDown = event => {
    if (this.props.modalShowing || this.props.alertShowing)
      return;

    //Enter pressed
    if (event.keyCode == 13) {
      this.onAddField();
    //Esc pressed
    } else if (event.keyCode == 27) {
      this.setState({fieldName: ""});
    }
  };

  onAddField = event => {
    if (event)
      event.preventDefault();

    if (!this.state.fieldName)
      return;

    this.returnFocus = true;

    const {showAlert, showModal, model} = this.props;

    const name = removeOddSpaces(this.state.fieldName);
    const error = checkFieldName(name);
    if (error) {
      showAlert(getAlertForNameError(error));
      return;
    }

    const field = new ModelFieldData();
    field.model = model;
    field.name = name;
    field.nameId = getNameId(name, model.fields);
    showModal(MODAL_TYPE_FIELD, field);

    this.setState({fieldName: ""});
  };

  onRemoveClick = (event, field) => {
    event.stopPropagation();

    let params;

    const contentCount = getContentForModel(this.props.model).length;
    if (field.isDisabled || !contentCount) {
      params = {
        title: `Deleting <strong>${field.name}</strong> field`,
        type: ALERT_TYPE_CONFIRM,
        description: "Are you sure?",
        onConfirm: () => this.props.deleteField(field)
      };
    } else {
      params = {
        title: `Deleting <strong>${field.name}</strong> field`,
        type: ALERT_TYPE_ALERT,
        description: `There are ${contentCount} content items using the model. You should disable this field first.`
      };
    }

    this.props.showAlert(params);
    this.returnFocus = true;
  };

  onFieldClick = field => {
    if (!this.props.isEditable)
      return;

    this.returnFocus = true;
    this.props.showModal(MODAL_TYPE_FIELD, field);
  };

  onJSONClick = () => {
    this.setState({
      jsonVisibility: !this.state.jsonVisibility
    });
  };

  renderTitle() {
    const {name} = this.props.model;

    if (name)
      return (
        <span>
          <span styleName="back-link" onClick={browserHistory.goBack}>Models</span>
          <span> / </span>
          <span styleName="model-title">{name}</span>
        </span>
      );

    return 'Models';
  }

  updateModelName = (name, callback, silent) => {
    const {model, showAlert, updateModel} = this.props;

    if (name == model.name)
      return;

    const error = checkModelName(name);
    if (!error) {
      model.name = name;
      updateModel(model);

    } else if (error != NAME_ERROR_OTHER) {
      if (!silent) {
        this.returnFocus = true;
        showAlert(getAlertForNameError(error));
        this.titleActive = true;
      } else if (callback != undefined) {
        callback(model.name);
      }
    }
  };

  updateModelDescription = description => {
    const {model} = this.props;

    if (description == model.description)
      return;

    model.description = description;
    this.props.updateModel(model);
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    const {updateField} = this.props;

    let fields = arrayMove(this.state.fields, oldIndex, newIndex);

    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      field.order = i;
      updateField(field);
    }

    this.setState({fields});
  };

  render() {
    const {model, isEditable, alertShowing} = this.props;

    let content;
    if (this.state.jsonVisibility) {
      content = <JSONView model={model} />;

    } else {
      content = (
        <div>
          <div styleName="list">
            <div styleName="head">
              <div styleName="listItemName">Name</div>
              <div styleName="listItemType">Type</div>
            </div>

            <SortableList onSortEnd={this.onSortEnd}
                          useDragHandle={true}
                          fields={this.state.fields}
                          isEditable={isEditable}
                          onFieldClick={this.onFieldClick}
                          onRemoveClick={this.onRemoveClick} />
          </div>
          {isEditable &&
            <div styleName="input-wrapper">
              <InputControl placeholder=""
                            label="Add a Field"
                            value={this.state.fieldName}
                            onKeyDown={this.onAddKeyDown}
                            onChange={this.onFieldNameChange}
                            DOMRef={c => this.activeInput = c}
                            icon="plus"
                            titled
                            autoFocus
                            onIconClick={this.onAddField} />
            </div>
          }
        </div>
      );
    }

    let titles = (
      <div>
        <EditableTitleControl text={model.name}
                              ref={cmp => this.controlTitle = cmp}
                              placeholder={"Model name"}
                              alertShowing={alertShowing}
                              required
                              update={isEditable ? this.updateModelName : null} />
        {/* <EditableTitleControl text={model.description}
                              placeholder={"Model description"}
                              isSmall={true}
                              alertShowing={alertShowing}
                              update={isEditable ? this.updateModelDescription : null} /> */}
      </div>
    );

    return (
      <ContainerComponent hasTitle2={true}
                          titles={titles}
                          title={this.renderTitle()}
                          onClickRlink={this.onJSONClick}
                          rLinkTitle={this.state.jsonVisibility ? 'Fields' : 'JSON'}>
        {content}
      </ContainerComponent>
    );
  }
}
