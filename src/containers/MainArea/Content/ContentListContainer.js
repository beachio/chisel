import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {browserHistory} from 'react-router';

import ContentList from 'components/mainArea/content/ContentList/ContentList';
import {ROLE_OWNER, ROLE_ADMIN, ROLE_DEVELOPER} from 'models/UserData';
import {addItem, deleteItem} from 'ducks/content';
import {showAlert} from 'ducks/nav';
import InlineSVG from 'svg-inline-react';
import {USERSPACE_URL, SITE_URL, CONTENT_URL, ITEM_URL} from 'middleware/routing';

import styles from './ContentListContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export class ContentListContainer extends Component  {
  render() {
    const {models, content, nav} = this.props;
    const {addItem, deleteItem} = this.props.contentActions;
    const {showAlert} = this.props.navActions;
    
    let cmpContent = (
      <div styleName="start-working">
        <InlineSVG styleName="hammer" src={require("./hammer.svg")}/>
        There are no models.
      </div>
    );
  
    let curSite = models.currentSite;
    if (!curSite)
      return null;
    
    if (curSite.models.length) {
      let items = [];
      for (let item of content.items) {
        if (item.model.site == curSite)
          items.push(item);
      }

      let gotoItem = item => {
        let modelId = item.model.nameId;
        let itemId = item.origin.id;
        browserHistory.push(
          `${USERSPACE_URL}${SITE_URL}${curSite.nameId}${CONTENT_URL}${ITEM_URL}${modelId}~${itemId}`);
      };
      
      cmpContent = <ContentList items={items}
                                models={curSite.models}
                                gotoItem={gotoItem}
                                addItem={addItem}
                                deleteItem={deleteItem}
                                showAlert={showAlert}
                                alertShowing={nav.alertShowing}
                                isEditable={models.role != ROLE_DEVELOPER}/>;
      
    } else if (models.role == ROLE_OWNER || models.role == ROLE_ADMIN) {
      cmpContent = (
        <div styleName="start-working">
          <InlineSVG styleName="hammer" src={require("./hammer.svg")}/>
          There are no models. Add any model to start creating content.
        </div>
      );
    }
    
    return cmpContent;
  }
}

function mapStateToProps(state) {
  return {
    models:   state.models,
    content:  state.content,
    nav:      state.nav
  };
}

function mapDispatchToProps(dispatch) {
  return {
    contentActions: bindActionCreators({addItem, deleteItem}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentListContainer);
