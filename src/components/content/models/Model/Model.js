import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import ModelsList from '../ModelsList/ModelsList';
import InlineSVG from 'svg-inline-react';

import styles from './Model.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Model extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div styleName="models">
        <div styleName="title">
          Models
        </div>
        <form>
          <ModelsList />

          <div styleName="create-new">
            <input styleName="input" placeholder="Create a new Content Type" />
            <InlineSVG styleName="plus" src={require("./plus.svg")} />
          </div>
        </form>
      </div>
    );
  }
}
