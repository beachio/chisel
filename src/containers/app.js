import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './app.sss';



@CSSModules(styles, {allowMultiple: true})
class App extends React.Component {
  componentDidMount() {
    const {getLocalStorage} = this.props.userActions;
    getLocalStorage();
  }

  render() {
    return (
      <div>
        lalala
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