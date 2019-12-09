import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import InlineSVG from 'svg-inline-react';

import InputControl from 'components/elements/InputControl/InputControl';

import styles from './DropdownControl.sss';

import ImageArrowDownFull from 'assets/images/arrow-down-full.svg';
import ImageArrows from 'assets/images/arrows.svg';


@CSSModules(styles, {allowMultiple: true})
export default class DropdownControl extends Component {
  state = {
    list: this.props.list ? this.props.list : [],
    value: '',
    listVis: false
  };

  constructor(props) {
    super(props);

    const {current} = props;
    if (this.state.list.indexOf(current) != -1 || current === undefined)
      this.state.value = current;
  }

  static getDerivedStateFromProps(props, state) {
    const {list, current} = props;

    if (state.list === list && state.value === current)
      return null;

    const newState = {list, value: ''};
    if (list.indexOf(current) != -1 || current === undefined)
      newState.value = current;

    return newState;
  }

  onItemClick = item => {
    this.setState({
      value: item,
      listVis: false
    });
    this.props.onSuggest(item);
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
    const {label, type, titled, inline, disabled} = this.props;

    let {value} = this.state;
    if (value == '')
      value = '(empty)';
    else if (!value)
      value = '(undefined)';

    if (disabled)
      return <InputControl label={label}
                           icon="lock"
                           value={value}
                           titled={titled}
                           dropdown={true}
                           readOnly={true} />;

    const wrapperClasses = classNames({
      'dropdown': true,
      'dropdown-inline': !!inline,
      'dropdown-big': type === 'big'
    });

    const inputClasses = classNames({
      'input': true,
      'empty': !this.state.value,
      'input-titled': titled
    });

    const arrowClasses = classNames({
      'arrow-down': true,
      'arrow-rotated': this.state.listVis
    });

    let icon = <InlineSVG styleName={arrowClasses} src={ImageArrowDownFull} />;
    if (type === 'big')
      icon = <InlineSVG styleName="arrows" src={ImageArrows} />;

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
          {this.state.listVis &&
            <div styleName="items">
              {this.state.list.map(item => {
                const styleName = classNames({
                  'item': true,
                  'empty': !item
                });
                return (
                  <div onMouseDown={e => this.onItemClick(item)}
                       styleName={styleName}
                       key={item}>
                    {!!item ? item : '(empty)'}
                  </div>
                );
              })}
            </div>
          }
        </div>
      </div>
    );
  }
}
