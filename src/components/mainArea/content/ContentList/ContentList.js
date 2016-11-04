import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import {ContentItemData} from 'models/ContentData';

import styles from './ContentList.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentList extends Component {
  state = {
    items: [],
    itemTitle: ""
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
    
    let item = new ContentItemData();
    item.title = this.state.itemTitle;
    
    let red   = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue  = Math.floor(Math.random() * 256);
    item.color = `rgba(${red}, ${green}, ${blue}, 1)`;
    
    addItem(item);
    
    this.setState({itemTitle: ""});
  };
  
  onItemClick = item => {
    const {setCurrentContentItem} = this.props;
    setCurrentContentItem(item);
  };
  
  render() {
    const {isEditable} = this.props;
    
    return (
      <div className="g-container" styleName="ContentList">
        <div className="g-title">
          Content
        </div>
        <div>
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
    );
  }
}
