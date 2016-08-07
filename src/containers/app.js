import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './app.sss';

import Header from 'containers/Header/Header';
import Sidebar from 'containers/Sidebar/Sidebar';
import Content from 'containers/Content/Content';

@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div>
        <div styleName="wrapper">
          <Header />
          <div styleName="wrapper-inner">
            <Sidebar />
            <Content />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
