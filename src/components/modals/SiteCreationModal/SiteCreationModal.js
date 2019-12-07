import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import InputControl from 'components/elements/InputControl/InputControl';
import {SiteData} from 'models/ModelData';
import {checkSiteName, NAME_ERROR_NAME_EXIST} from "utils/data";
import {removeOddSpaces} from "utils/strings";

import styles from './SiteCreationModal.sss';

import ImageTemplateEmpty from "assets/images/template-empty.png";


@CSSModules(styles, {allowMultiple: true})
export class TemplateControl extends Component {
  state = {
    checked: false
  };
  template = null;
  templateEmpty = false;

  constructor(props) {
    super(props);

    this.template = props.template;
    this.state.checked = props.checked;

    if (!this.template) {
      this.templateEmpty = true;
      this.template = {
        name: 'Empty',
        description: 'No Models will be created.',
        icon: null
      }
    }
  }

  componentWillReceiveProps({checked}) {
    this.setState({checked});
  }

  onClick = () => {
    this.props.onChange(this.templateEmpty ? null : this.template);
  };

  render() {
    let style = 'template-content';
    if (this.state.checked)
      style += ' checked';

    return (
      <div styleName="TemplateControl"
           onClick={this.onClick}>
        <div styleName={style}>
          <img styleName="icon-img"
               src={this.template.icon ? this.template.icon.url() : ImageTemplateEmpty}>
          </img>
          <div styleName="text">
            <div styleName="title">{this.template.name}</div>
            <div styleName="description">{this.template.description}</div>
          </div>
        </div>
      </div>
    );
  }
}

@CSSModules(styles, {allowMultiple: true})
export default class SiteCreationModal extends Component {
  state = {
    name: '',
    template: null,
    errorName: false
  };

  templates = [];
  site = null;
  active = false;
  focusElm = null;


  constructor(props) {
    super(props);

    this.templates = props.templates;
    this.site = new SiteData();
  }

  componentDidMount() {
    this.active = true;
    document.addEventListener('keydown', this.onKeyDown);

    if (this.focusElm)
      setTimeout(() => this.focusElm.focus(), 2);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = event => {
    if (!event)
      event = window.event;
    event.stopPropagation();

    //Enter or Esc pressed
    if (event.keyCode == 13)
      setTimeout(this.onCreate, 1);
    else if (event.keyCode == 27)
      setTimeout(this.close, 1);
  };

  onChangeName = name => {
    this.setState({name, errorName: null});
  };

  onChangeTemplate = template => {
    this.setState({template});
  };

  onCreate = () => {
    if (!this.state.name || !this.active)
      return;

    const name = removeOddSpaces(this.state.name);
    const error = checkSiteName(name);
    if (error == NAME_ERROR_NAME_EXIST) {
      this.setState({errorName: true});
      return;
    }
    this.site.name = name;

    this.props.addSite(this.site, this.state.template);
    this.close();
  };

  close = () => {
    this.active = false;
    this.props.onClose();
  };


  render() {
    return (
      <div styleName="modal" onClick={this.close}>
        <div styleName="modal-inner" onClick={e => e.stopPropagation()}>
          <div styleName="modal-header">
            <div styleName="title">Creating site</div>
          </div>
          <div styleName="content">
            <div styleName="input-wrapper">
              <InputControl label="Site name"
                            DOMRef={inp => this.focusElm = inp}
                            onChange={this.onChangeName}
                            value={this.state.name} />
            </div>

            {this.state.errorName &&
              <div styleName="error-same-name">This name is already in use.</div>
            }

            {this.templates.length &&
              <div>
                <div styleName="label">Choose template:</div>
                <div>
                  <TemplateControl checked={!this.state.template}
                                   onChange={this.onChangeTemplate}/>
                  {this.templates.map(template =>
                    <TemplateControl template={template}
                                     key={template.origin.id}
                                     checked={this.state.template == template}
                                     onChange={this.onChangeTemplate}/>)
                  }
                </div>
              </div>
            }

            <div styleName="input-wrapper buttons-wrapper">
              <div styleName="buttons-inner">
                <ButtonControl color="purple"
                               value="Create"
                               onClick={this.onCreate} />
              </div>
              <div styleName="buttons-inner">
                <ButtonControl color="gray"
                               value="Cancel"
                               onClick={this.close} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
