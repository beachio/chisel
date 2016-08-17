import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import styles from './Sidebar.sss';
import User from 'components/sidebar/User/User';
import Sites from 'components/sidebar/Sites/Sites';

import {openPage} from 'ducks/nav';
import {setCurrentSite, addSite, updateSite} from 'ducks/models';


@CSSModules(styles, {allowMultiple: true})
export default class Sidebar extends Component {
  render() {
    const {models, user} = this.props;
    const {setCurrentSite, addSite, updateSite} = this.props.modelsActions;

    return (
      <div styleName="sidebar">
        <div>
          <User userData={user.userData} />
          <Sites sites={models.sites}
                 currentSite={models.currentSite}
                 setCurrentSite={setCurrentSite}
                 addSite={addSite}
                 updateSite={updateSite}/>
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
    user:   state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:     bindActionCreators({openPage}, dispatch),
    modelsActions:  bindActionCreators({setCurrentSite, addSite, updateSite}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
