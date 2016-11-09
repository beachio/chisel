import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import styles from './ContentList.sss';


const STATUS_ALL        = "STATUS_ALL";
const STATUS_DRAFT      = "STATUS_DRAFT";
const STATUS_PUBLISHED  = "STATUS_PUBLISHED";


@CSSModules(styles, {allowMultiple: true})
export default class ContentList extends Component {
  state = {
    items: [],
    itemTitle: "",
    
    activeModels: new Set(),
    activeStatus: STATUS_ALL
  };
  activeInput = null;

  componentWillMount() {
    this.setState({items: this.props.items});
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.alertShowing && this.activeInput)
      this.activeInput.focus();
    this.setState({items: nextProps.items});
    if (nextProps.items != this.state.items)
      this.setState({itemTitle: ""});
  }

  onItemTitleChange = event => {
    let title = event.target.value;
    this.setState({itemTitle: title});
  };

  onKeyDown = event => {
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

  onAddItem = event => {
    if (event)
      event.preventDefault();

    if (!this.state.itemTitle)
      return;

    const {addItem} = this.props;
    addItem(this.state.itemTitle);
    this.setState({itemTitle: ""});
  };

  onItemClick = item => {
    const {setCurrentItem} = this.props;
    setCurrentItem(item);
  };
  
  onModelClick = model => {
    let models = this.state.activeModels;
    if (models.has(model))
      models.delete(model);
    else
      models.add(model);
    this.setState({activeModels: models});
  };
  
  onStatusClick = status => {
    if (this.state.activeStatus == status)
      this.setState({activeStatus: STATUS_ALL});
    else
      this.setState({activeStatus: status});
  };
    
  render() {
    const {isEditable, models} = this.props;
  
    let eyeDisabled = <img styleName="eye" src={require("./eye-gray.png")} />;
    let eyeEnabled = <img styleName="eye eye-active" src={require("./eye.png")} />;
  
    return (
      <div className="g-container" styleName="ContentList">
        <div className="g-title">
          Content
        </div>
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
                  if (this.state.activeModels.has(model)) {
                    eye = eyeEnabled;
                    styleName = "filters-type";
                  }
                  
                  return(
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
              <div styleName={this.state.activeStatus == STATUS_PUBLISHED ? "filters-type" : "filters-type filters-typeHidden"}
                   onClick={() => this.onStatusClick(STATUS_PUBLISHED)}>
                Published
                {this.state.activeStatus == STATUS_PUBLISHED ? eyeEnabled : eyeDisabled}
              </div>
              <div styleName={this.state.activeStatus == STATUS_DRAFT ? "filters-type" : "filters-type filters-typeHidden"}
                   onClick={() => this.onStatusClick(STATUS_DRAFT)}>
                Draft
                {this.state.activeStatus == STATUS_DRAFT ? eyeEnabled : eyeDisabled}
              </div>
            </div>
          </div>
          <div styleName="content">
            <div styleName="list">
              {
                this.state.items.length > 0 &&
                  <div styleName="list-item list-header">
                    <div styleName="colorLabel"></div>
                    <div styleName="type"></div>
                    <div styleName="updated">UPDATED</div>
                  </div>
              }
              {
                this.state.items.map(item => {
                  if (this.state.activeModels.size && !this.state.activeModels.has(item.model))
                    return;
                  if (this.state.activeStatus != STATUS_ALL &&
                      (this.state.activeStatus == STATUS_PUBLISHED) != item.published)
                    return;
                  
                  let updatedDate = item.origin.updatedAt;
                  if (!updatedDate)
                    updatedDate = new Date();
                  let updatedStr = updatedDate.toLocaleString("en-US",
                    {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'});

                  let colorStyle = {background: item.color};
                  let key = item.origin && item.origin.id ? item.origin.id : Math.random();

                  return(
                    <div styleName="list-item"
                         key={key}
                         onClick={() => this.onItemClick(item)} >
                      <div styleName="colorLabel" style={colorStyle}></div>
                      <div styleName="type">
                        <div styleName="name">{item.title}</div>
                        <div styleName="description">{item.model.name}</div>
                      </div>
                      <div styleName="updated">{updatedStr}</div>
                    </div>
                  );
                })
              }
            </div>
            {
              isEditable &&
                <div styleName="create-new">
                  <input styleName="input"
                         placeholder="Create a new Content Type"
                         value={this.state.itemTitle}
                         autoFocus={true}
                         onChange={this.onItemTitleChange}
                         onKeyDown={this.onKeyDown}
                         ref={c => this.activeInput = c} />
                  <InlineSVG styleName="plus"
                             src={require("./plus.svg")}
                             onClick={this.onAddItem} />
                </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
