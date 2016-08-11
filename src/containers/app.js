import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './app.sss';

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import Content from 'containers/Content/Content';
import Sign from 'containers/Sign/Sign';
import SiteLoader from 'components/modals/SiteLoader/SiteLoader';
import {getLocalStorage} from '../ducks/user';


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  componentDidMount() {
    const {getLocalStorage} = this.props.userActions;
    getLocalStorage();
  }

  render() {
    const {user, initialize} = this.props;

    let Page = (
      <div>
        <SiteLoader />
      </div>
    );

    if (initialize.initialized) {
      Page = (
        <div className="container">
          <Sign />
        </div>
      );

      if (user.authorized) {
        Page = (
          <div>
            <Header />
            <div styleName="wrapper-inner">
              <Sidebar />
              <Content />
            </div>
          </div>
        );
      }
    }

    return (
      <div styleName="wrapper">
        {Page}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    initialize: state.initialize,
    user:       state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions:  bindActionCreators({getLocalStorage}, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
