import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import FlipMove from 'react-flip-move';

import {ContentItemData, STATUS_DRAFT, STATUS_PUBLISHED, STATUS_UPDATED, STATUS_ARCHIVED} from 'models/ContentData';
import DropdownControl from 'components/elements/DropdownControl/DropdownControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';
import InputControl from 'components/elements/InputControl/InputControl';
import {getModelByName, checkUniqueFieldValue} from 'utils/data';
import {getRelativeTime} from 'utils/strings';
import {ALERT_TYPE_CONFIRM, ALERT_TYPE_ALERT} from 'components/modals/AlertModal/AlertModal';

import styles from './ContentList.sss';

import ImageEye from './eye.png';
import ImageEyeGray from './eye-gray.png';
import ImageIconEdit from 'assets/images/icons/edit.svg';
import ImageIconDelete from 'assets/images/icons/delete.svg';


const allStatuses = [STATUS_DRAFT, STATUS_PUBLISHED, STATUS_UPDATED, STATUS_ARCHIVED];

@CSSModules(styles, {allowMultiple: true})
export default class ContentList extends Component {
  state = {
    itemTitle: "",

    searchText: '',

    currentModel: this.props.models[0]
  };

  activeInput;
  searchInput;
  returnFocus = false;


  componentDidUpdate() {
    if (!this.props.alertShowing && this.returnFocus && this.activeInput) {
      this.returnFocus = false;
      setTimeout(() => this.activeInput.focus(), 1);
    }
  }

  //TODO криво как-то
  onChangeModel = name => {
    let model = getModelByName(name);
    this.setState({currentModel: model});
  };

  onItemTitleChange = title => {
    this.setState({itemTitle: title});
  };

  onNewKeyDown = event => {
    if (this.props.alertShowing)
      return;

    //Enter pressed
    if (event.keyCode == 13) {
      this.onAddItem();
    //Esc pressed
    } else if (event.keyCode == 27) {
      this.setState({itemTitle: ""});
    }
  };

  onSearch = searchText => {
    this.setState({searchText});
  };

  onSearchClear = () => {
    this.setState({searchText: ''});
    this.searchInput.focus();
  };

  onSearchKeyDown = event => {
    if (this.props.alertShowing)
      return;

    //Esc pressed
    if (event.keyCode == 27)
      this.setState({searchText: ``});
  };

  onAddItem = event => {
    if (event)
      event.preventDefault();

    this.returnFocus = true;

    let item = new ContentItemData();
    item.model = this.state.currentModel;
    item.title = this.state.itemTitle;

    let titleField = this.state.currentModel.getTitle();
    if (titleField && titleField.isUnique) {
      if (checkUniqueFieldValue(titleField, item)) {
        this.props.showAlert({
          title: "Warning",
          description: "There is a content item with same title. The title must be unique. Please, change it."
        });
        return;
      }
    }

    this.props.addItem(item);
    this.setState({itemTitle: ""});
  };

  onItemClick = item => {
    this.props.gotoItem(item);
  };

  onModelClick = model => {
    this.props.filterModel(model);
    this.setState({currentModel: model});
  };

  onStatusClick = status => {
    this.props.filterStatus(status);
  };

  onRemoveClick = (event, item) => {
    event.stopPropagation();

    const {showAlert, deleteItem} = this.props;
    const title = item.title ? item.title : 'content item';

    let params;
    if (item.status == STATUS_DRAFT || item.status == STATUS_ARCHIVED)
      params = {
        type: ALERT_TYPE_CONFIRM,
        title: `Deleting <strong>${title}</strong>`,
        description: "Are you sure that you'd like to delete this?",
        onConfirm: () => deleteItem(item)
      };
    else
      params = {
        type: ALERT_TYPE_ALERT,
        title: `Deleting <strong>${title}</strong>`,
        description: "Please archive the item before deleting it"
      };
    showAlert(params);
    this.returnFocus = true;
  };

  render() {
    const {isEditable, models, filteredModels, filteredStatuses, items} = this.props;

    const eyeDisabled = <img styleName="eye" src={ImageEyeGray} />;
    const eyeEnabled = <img styleName="eye eye-active" src={ImageEye} />;

    const visibleItems = items
        .filter(item => !filteredModels.size || filteredModels.has(item.model))
        .filter(item => !filteredStatuses.size || filteredStatuses.has(item.status))
        .filter(item => {
          const sText = this.state.searchText;
          if (!sText.length)
            return true;

          const title = item.draft ? item.draft.title : item.title;
          return title && title.toLowerCase().indexOf(sText.toLowerCase()) != -1;
        });
    return (
      <ContainerComponent title="Content">
        <div styleName="content-wrapper">
          <div styleName="filters">
            <div styleName="filters-item">
              <div styleName="filters-title">
                Content Types
              </div>
              {
                models.map(model => {
                  let key = model.origin && model.origin.id ? model.origin.id : Math.random();

                  let eye = eyeDisabled;
                  let styleName = "filters-type filters-typeHidden";
                  if (filteredModels.has(model)) {
                    eye = eyeEnabled;
                    styleName = "filters-type";
                  }

                  return (
                    <div styleName={styleName} key={key} onClick={() => this.onModelClick(model)}>
                      {model.name}
                      {eye}
                    </div>
                  );
                })
              }
            </div>
            <div styleName="filters-item">
              <div styleName="filters-title filters-status">
                Status
              </div>
              {
                allStatuses.map(status => {
                  let eye = eyeDisabled;
                  let styleName = "filters-type filters-typeHidden";
                  if (filteredStatuses.has(status)) {
                    eye = eyeEnabled;
                    styleName = "filters-type";
                  }

                  return(
                    <div styleName={styleName} key={status} onClick={() => this.onStatusClick(status)}>
                      {status}
                      {eye}
                    </div>
                  );
                })
              }
            </div>
          </div>

          <div styleName="list-wrapper">
            <div styleName="list">
              <div styleName="inputs-wrapper search">
                <InputControl placeholder=""
                              autoFocus
                              DOMRef={c => this.searchInput = c}
                              icon={this.state.searchText ? "cross" : "search"}
                              onIconClick={this.state.searchText ? this.onSearchClear : null}
                              value={this.state.searchText}
                              onKeyDown={this.onSearchKeyDown}
                              onChange={this.onSearch} />
              </div>
              {visibleItems.length <= 0 &&
                <div styleName="list-no-items">
                  There are no items here.
                </div>
              }
              <div styleName="items">
                <FlipMove duration={250}
                          enterAnimation="accordionVertical"
                          leaveAnimation="accordionVertical"
                          maintainContainerHeight
                          easing="ease-out">
                  {visibleItems.length > 0 &&
                    <div styleName="list-item list-header" key="header!">
                      <div styleName="colorLabel"></div>
                      <div styleName="name">Name</div>
                      <div styleName="model">Model</div>
                      <div styleName="updated">Updated</div>
                    </div>
                  }
                  {visibleItems
                    .map((item, key) => {
                      const title = item.draft ? item.draft.title : item.title;

                      let updatedDate = item.draft ? item.draft.origin.updatedAt : item.origin.updatedAt;
                      if (!updatedDate)
                        updatedDate = new Date();
                      const updatedStr = getRelativeTime(updatedDate);

                      const colorStyle = {
                        [STATUS_DRAFT]:     {background: '#DCC191'},
                        [STATUS_PUBLISHED]: {background: '#297AD6'},
                        [STATUS_UPDATED]:   {background: '#B1560F'},
                        [STATUS_ARCHIVED]:  {background: '#AFAFAF'}
                      };

                      return(
                        <div styleName={`list-item`}
                             key={key}
                             onClick={() => this.onItemClick(item)}>
                          <div styleName="colorLabel" style={colorStyle[item.status]}></div>
                          {title ?
                            <div styleName="name">{title}</div>
                          :
                            <div styleName="name untitled">Untitled</div>
                          }
                          <div styleName="model">{item.model.name}</div>
                          <div styleName="updated">{updatedStr}</div>
                          {isEditable &&
                            <div styleName="controls">
                              <div styleName="control-icon edit">
                                <InlineSVG styleName="cross"
                                           src={ImageIconEdit}/>
                              </div>
                              <div styleName="remove control-icon" onClick={event => this.onRemoveClick(event, item)}>
                                <InlineSVG styleName="cross"
                                           src={ImageIconDelete}/>
                              </div>
                            </div>
                          }
                        </div>
                      );
                    })
                  }
                </FlipMove>
              </div>
              {isEditable &&
                <div styleName="inputs-wrapper bottom-inputs" key="input!">
                  <div styleName="dropdown-wrapper">
                    <DropdownControl list={models.map(m => m.name)}
                                     onSuggest={this.onChangeModel}
                                     current={this.state.currentModel.name} />
                  </div>
                  <div styleName="input-wrapper">
                    <InputControl placeholder="Create a new content item"
                                  value={this.state.itemTitle}
                                  icon="plus"
                                  DOMRef={c => this.activeInput = c}
                                  onIconClick={this.onAddItem}
                                  onChange={this.onItemTitleChange}
                                  onKeyDown={this.onNewKeyDown} />
                  </div>
                </div>
              }
            </div>

          </div>
        </div>
      </ContainerComponent>
    );
  }
}
