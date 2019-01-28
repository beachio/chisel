import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import InlineSVG from 'svg-inline-react';

import InputControl from 'components/elements/InputControl/InputControl';

import styles from './DropdownControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class DropdownControl extends Component {
  state = {
    value: '',
    listVis: false,
    disabled: false
  };
  list = [];
  onSuggest = null;


  constructor(props) {
    super(props);

    const {list, onSuggest, current, disabled} = props;
    this.onSuggest = onSuggest;
    if (list)
      this.list = list;

    this.state.disabled = disabled;

    if (this.list.indexOf(current) != -1 || current === undefined)
      this.state.value = current;
  }

  componentWillReceiveProps(nextProps) {
    const {list, current, disabled} = nextProps;

    this.list = list;

    if (list.indexOf(current) != -1 || current === undefined)
      this.setState({value: current, disabled});
    else
      this.setState({value: '', disabled});
  }

  onSuggestionClick = item => {
    this.setState({
      value: item,
      listVis: false
    });
    this.onSuggest(item);
  };

  onInputClick = () => {
    this.setState({
      listVis: !this.state.listVis
    });
  };

  onBlur = () => {
    this.setState({
      listVis: false
    });
  };

  render() {
    const {label, type, titled} = this.props;

    let {value} = this.state;
    if (value == '')
      value = '(empty)';
    else if (!value)
      value = '(undefined)';

    if (this.state.disabled)
      return <InputControl label={label}
                           icon="lock"
                           value={value}
                           titled={titled}
                           dropdown={true}
                           readOnly={true} />;

    const wrapperClasses = classNames({
      'input-wrapper type-wrapper': true,
      'dropdown-big': type === 'big'
    });

    const inputClasses = classNames({
      'input': true,
      'suggestions-visible': this.state.listVis,
      'empty': !this.state.value,
      'input-titled': titled
    });

    const arrowClasses = classNames({
      'arrow-down': true,
      'arrow-rotated': this.state.listVis
    });

    let icon = <InlineSVG styleName={arrowClasses} src={require("assets/images/icon-triangular-arrow.svg")} />;
    if (type === 'big')
      icon = <InlineSVG styleName="arrows" src={require("assets/images/arrows.svg")} />;

    return (
      <div styleName={wrapperClasses} onBlur={this.onBlur}>
        {label &&
          <div styleName="label">{label}</div>
        }
        <div styleName="input-wrapper">
          {icon}
          <input styleName={inputClasses}
                 value={value}
                 onClick={this.onInputClick}
                 readOnly />
          <div styleName="suggestions">
            {this.list.map((item, key) => {
              const styleName = classNames({
                'suggestion': true,
                'empty': !item
              });
              return (
                <div onMouseDown={() => this.onSuggestionClick(item)}
                     styleName={styleName}
                     key={key}>
                  {!!item ? item : '(empty)'}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
