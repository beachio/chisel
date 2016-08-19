import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import User from 'components/sidebar/User/User';
import Sites from 'components/sidebar/Sites/Sites';
import {showAlert} from 'ducks/nav';
import {setCurrentSite, addSite, updateSite} from 'ducks/models';

import styles from './Sidebar.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Sidebar extends Component {
  render() {
    const {models, nav, user} = this.props;
    const {setCurrentSite, addSite, updateSite} = this.props.modelsActions;
    const {showAlert} = this.props.navActions;

    return (
      <div styleName="sidebar">
        <div>
          <User userData={user.userData} />
          <Sites sites={models.sites}
                 currentSite={models.currentSite}
                 setCurrentSite={setCurrentSite}
                 addSite={addSite}
                 updateSite={updateSite}
                 showAlert={showAlert}
                 alertShowing={nav.alertShowing}/>
        </div>
        <div styleName="answer-wrapper">
          <div styleName="answer-question">
            <InlineSVG styleName="icon" src={require("./question.svg")} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    models: state.models,
    nav:    state.nav,
    user:   state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    modelsActions:  bindActionCreators({setCurrentSite, addSite, updateSite}, dispatch),
    navActions:     bindActionCreators({showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
