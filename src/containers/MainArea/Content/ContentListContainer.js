import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";
import InlineSVG from 'svg-inline-react';

import ContentList from 'components/mainArea/content/ContentList/ContentList';
import {ROLE_OWNER, ROLE_ADMIN, ROLE_DEVELOPER} from 'models/UserData';
import {addItem, deleteItem} from 'ducks/content';
import {showAlert, CONTENT_URL, ITEM_URL, USERSPACE_URL, SITE_URL} from 'ducks/nav';


export class ContentListContainer extends Component {
  mainArea;

  componentDidMount() {
    this.mainArea.scrollTop = 0;
  }

  render() {
    const {models, content, nav} = this.props;
    const {addItem, deleteItem} = this.props.contentActions;
    const {showAlert} = this.props.navActions;
    
    let cmpContent = (
      <div className="start-working">
        <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
        There are no models.
      </div>
    );
  
    let curSite = models.currentSite;
    if (!curSite)
      return null;
    
    let title = `Content - Site: ${curSite.name} - Chisel`;
    
    if (curSite.models.length) {
      let items = [];
      for (let item of content.items) {
        if (item.model.site == curSite)
          items.push(item);
      }

      if (!items.length && models.role == ROLE_DEVELOPER) {
        cmpContent = (
          <div className="start-working">
            <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
            There are no items.
          </div>
        );

      } else {
        let gotoItem = item => {
          let modelId = item.model.nameId;
          let itemId = item.origin.id;
          browserHistory.push(
            `/${USERSPACE_URL}/${SITE_URL}${curSite.nameId}/${CONTENT_URL}/${ITEM_URL}${modelId}~${itemId}`);
        };

        cmpContent = <ContentList items={items}
                                  models={curSite.models}
                                  gotoItem={gotoItem}
                                  addItem={addItem}
                                  deleteItem={deleteItem}
                                  showAlert={showAlert}
                                  alertShowing={nav.alertShowing}
                                  isEditable={models.role != ROLE_DEVELOPER}/>;
      }

    } else if (models.role == ROLE_OWNER || models.role == ROLE_ADMIN) {
      cmpContent = (
        <div className="start-working">
          <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
          There are no models. Add any model to start creating content.
        </div>
      );
    }
    
    return (
      <div className="mainArea" ref={c => this.mainArea = c}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {cmpContent}
      </div>
    );
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
