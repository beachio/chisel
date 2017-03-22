import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import ContentList from 'components/mainArea/content/ContentList/ContentList';
import {ROLE_OWNER, ROLE_ADMIN, ROLE_DEVELOPER} from 'models/UserData';
import {addItem, setCurrentItem, deleteItem} from 'ducks/content';
import {showAlert} from 'ducks/nav';
import InlineSVG from 'svg-inline-react';

import styles from './ContentListContainer.sss';


@CSSModules(styles, {allowMultiple: true})
export class ContentListContainer extends Component  {
  render() {
    const {models, content, nav} = this.props;
    const {addItem, deleteItem, setCurrentItem} = this.props.contentActions;
    const {showAlert} = this.props.navActions;
    
    let curSite = models.currentSite;
    
    let cmpContent = null;
    if (curSite) {
      if (curSite.models.length) {
        let items = [];
        for (let item of content.items) {
          if (item.model.site == curSite)
            items.push(item);
        }
        cmpContent = (
          <ContentList items={items}
                       models={curSite.models}
                       setCurrentItem={setCurrentItem}
                       addItem={addItem}
                       deleteItem={deleteItem}
                       showAlert={showAlert}
                       alertShowing={nav.alertShowing}
                       isEditable={models.role != ROLE_DEVELOPER}/>
        );
      } else if (models.role == ROLE_OWNER || models.role == ROLE_ADMIN) {
        cmpContent = (
          <div styleName="start-working">
            <InlineSVG styleName="hammer" src={require("./hammer.svg")}/>
            There are no models. Add any model to start creating content.
          </div>
        );
      } else {
        cmpContent = (
          <div styleName="start-working">
            <InlineSVG styleName="hammer" src={require("./hammer.svg")}/>
            There are no models.
          </div>
        );
      }
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
    contentActions: bindActionCreators({addItem, setCurrentItem, deleteItem}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentListContainer);
