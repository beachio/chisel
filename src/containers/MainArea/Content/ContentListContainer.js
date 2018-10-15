import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {Helmet} from "react-helmet";
import InlineSVG from 'svg-inline-react';

import ContentList from 'components/mainArea/content/ContentList/ContentList';
import {ROLE_OWNER, ROLE_ADMIN, ROLE_DEVELOPER} from 'models/UserData';
import {addItem, deleteItem, filterModel, filterStatus} from 'ducks/content';
import {showAlert, URL_CONTENT, URL_ITEM, URL_USERSPACE, URL_SITE} from 'ducks/nav';


export class ContentListContainer extends Component {
  mainArea;
  lastScroll = 0;

  componentDidMount() {
    this.mainArea.scrollTop = 0;
    this.mainArea.addEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    this.lastScroll = this.mainArea.scrollTop;
  };

  componentWillUnmount() {
    this.mainArea.removeEventListener('scroll', this.onScroll);
  }

  keepScroll = () => {
    this.mainArea.scrollTop = this.lastScroll;
  };

  render() {
    const {models, content, nav} = this.props;
    const {addItem, deleteItem, filterModel, filterStatus} = this.props.contentActions;
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
            `/${URL_USERSPACE}/${URL_SITE}${curSite.nameId}/${URL_CONTENT}/${URL_ITEM}${modelId}~${itemId}`);
        };

        cmpContent = <ContentList items={items}
                                  models={curSite.models}
                                  gotoItem={gotoItem}
                                  addItem={addItem}
                                  deleteItem={deleteItem}
                                  keepScroll={this.keepScroll}
                                  showAlert={showAlert}
                                  alertShowing={nav.alertShowing}
                                  isEditable={models.role != ROLE_DEVELOPER}
                                  filteredModels={content.filteredModels}
                                  filteredStatuses={content.filteredStatuses}
                                  filterModel={filterModel}
                                  filterStatus={filterStatus} />;
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
    contentActions: bindActionCreators({addItem, deleteItem, filterModel, filterStatus}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentListContainer);
