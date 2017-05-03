import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';

import styles from './RadioControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class DropdownControl extends Component {

  render() {
    const { value, onRadioChange } = this.props;

    let RadioButtons = this.radioButtonsList.map(radioButton => {
      return (
        <div styleName="radio-button">
          <input styleName="radio"
                 type="radio"
                 id={ /* id инпута */ }
                 name="radio"
                 checked={ /* value инпута */ }
                 onChange={ /* onChange инпута */ } />
          <label styleName="radio-label" htmlFor={ /* id инпута */ }>
            { /* здесь должен быть текст лейбла */ }
          </label>
        </div>
      )
    });

    return (
      <div styleName="RadioControl">
        {RadioButtons}
      </div>
    );
  }
}
