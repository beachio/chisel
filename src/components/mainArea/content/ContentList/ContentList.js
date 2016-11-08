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
    
    activeModel: null,
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
  
  onModelClick = (model = null) => {
    this.setState({activeModel: model});
  };
  
  onStatusClick = status => {
    this.setState({activeStatus: status});
  };
  
  getModelEye(model = null) {
    if (model == this.state.activeModel)
      return <img styleName="eye eye-gray" src={require("./eye-gray.png")} />;
    return <img styleName="eye"
                src={require("./eye.png")}
                onClick={() => this.onModelClick(model)} />;
  }
  
  getStatusEye(status) {
    if (status == this.state.activeStatus)
      return <img styleName="eye eye-gray" src={require("./eye-gray.png")} />;
    return <img styleName="eye"
                src={require("./eye.png")}
                onClick={() => this.onStatusClick(status)} />;
  }

  render() {
    const {isEditable, models} = this.props;
  
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
              <div styleName="filters-type">
                All
                {this.getModelEye()}
              </div>
              {
                models.map(model => {
                  let key = model.origin && model.origin.id ? model.origin.id : Math.random();
                  
                  return(
                    <div styleName="filters-type" key={key}>
                      {model.name}
                      {this.getModelEye(model)}
                    </div>
                  );
                })
              }
            </div>
            <div styleName="filters-item">
              <div styleName="filters-title filters-status">
                Status
              </div>
              <div styleName="filters-type">
                All
                {this.getStatusEye(STATUS_ALL)}
              </div>
              <div styleName="filters-type">
                Published
                {this.getStatusEye(STATUS_PUBLISHED)}
              </div>
              <div styleName="filters-type">
                Draft
                {this.getStatusEye(STATUS_DRAFT)}
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
                  if (this.state.activeModel && item.model != this.state.activeModel)
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
