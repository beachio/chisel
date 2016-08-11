import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './app.sss';

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import Content from 'containers/Content/Content';
import Sign from 'containers/Sign/Sign';


@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  componentDidMount() {
  }

  render() {
    const {user} = this.props;

    let Page = (
      <div>
        <Header />
        <div styleName="wrapper-inner">
          <Sidebar />
          <Content />
        </div>
      </div>
    );

    if (!user.authorized) {
      Page = (
        <div className="container">
          <Sign />
        </div>
      );
    }

    return (
      <div>
        <div styleName="wrapper">
          {Page}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user:     state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
