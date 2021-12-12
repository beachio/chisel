import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet-async";
import InlineSVG from 'svg-inline-react';

import ContentList from 'components/mainArea/content/ContentList/ContentList';
import {ROLE_OWNER, ROLE_ADMIN, ROLE_DEVELOPER} from 'models/UserData';
import {addItem, deleteItem, filterModel, filterStatus, setVisibleField} from 'ducks/content';
import {showAlert, URL_CONTENT, URL_ITEM, URL_USERSPACE, URL_SITE} from 'ducks/nav';

import ImageHammer from 'assets/images/hammer.svg';


export class ContentListContainer extends Component {
  render() {
    const {models, content, nav, history} = this.props;
    const {addItem, deleteItem, filterModel, filterStatus, setVisibleField} = this.props.contentActions;
    const {showAlert} = this.props.navActions;
    
    let cmpContent = (
      <div className="start-working">
        <InlineSVG className="hammer" src={ImageHammer}/>
        There are no models.
      </div>
    );
  
    let site = models.currentSite;
    if (!site)
      return null;
    
    let title = `Content - Site: ${site.name} - Chisel`;
    
    if (site.models.length) {
      let items = [];
      for (let item of content.items) {
        if (item.model.site == site)
          items.push(item);
      }

      if (!items.length && models.role == ROLE_DEVELOPER) {
        cmpContent = (
          <div className="start-working">
            <InlineSVG className="hammer" src={ImageHammer}/>
            There are no items.
          </div>
        );

      } else {
        let gotoItem = item => {
          let modelId = item.model.nameId;
          let itemId = item.origin.id;
          history.push(
            `/${URL_USERSPACE}/${URL_SITE}${site.nameId}/${URL_CONTENT}/${URL_ITEM}${modelId}~${itemId}`);
        };

        cmpContent = <ContentList items={items}
                                  models={site.models}
                                  gotoItem={gotoItem}
                                  addItem={addItem}
                                  deleteItem={deleteItem}
                                  showAlert={showAlert}
                                  alertShowing={nav.alertShowing}
                                  isEditable={models.role != ROLE_DEVELOPER}
                                  filteredModels={content.filteredModels}
                                  filteredStatuses={content.filteredStatuses}
                                  visibleFields={content.visibleFields}
                                  filterModel={filterModel}
                                  filterStatus={filterStatus}
                                  setVisibleField={setVisibleField} />;
      }

    } else if (models.role == ROLE_OWNER || models.role == ROLE_ADMIN) {
      cmpContent = (
        <div className="start-working">
          <InlineSVG className="hammer" src={ImageHammer}/>
          There are no models. Add any model to start creating content.
        </div>
      );
    }
    
    return <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {cmpContent}
    </>;
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
    contentActions: bindActionCreators({addItem, deleteItem, filterModel, filterStatus, setVisibleField}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentListContainer);
