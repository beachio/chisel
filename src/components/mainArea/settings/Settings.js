import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';

import InputControl from 'components/elements/InputControl/InputControl';
import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import ContainerComponent from 'components/elements/ContainerComponent/ContainerComponent';

import styles from './Settings.sss';


@CSSModules(styles, {allowMultiple: true})
export default class Settings extends Component {
  state = {
    name: '',
    domain: '',
    dirty: false
  };
  site = null;
  error = null;
  
  
  componentWillMount() {
    this.site = this.props.site;
    this.setState({
      name: this.site.name,
      domain: this.site.domain
    });
  }
  
  componentWillReceiveProps(nextProps) {
    this.site = nextProps.site;
    this.setState({
      name: this.site.name,
      domain: this.site.domain
    });
  }
  
  componentWillUnmount() {
    
  }
  
  onChangeName = event => {
    let name = event.target.value;
    this.setState({name, dirty: true});
  };
  
  onChangeDomain = event => {
    let domain = event.target.value;
    this.setState({domain, dirty: true});
  };
  
  onSave = () => {
    //if (!this.item.published || this.validate()) {
    this.setState({dirty: false});
    this.site.name = this.state.name;
    this.site.domain = this.state.domain;
    this.props.updateSite(this.site);
    //}
  };
  
  render() {
    const {isEditable} = this.props;
    
    return (
      <ContainerComponent title="Site settings">
        <div styleName="content">
          <div styleName="field">
            <div styleName="field-title">Site name</div>
            <div styleName="input-wrapper">
              <InputControl type="big"
                            value={this.state.name}
                            readOnly={!isEditable}
                            onChange={this.onChangeName} />
            </div>
          </div>
          <div styleName="field">
            <div styleName="field-title">Site domain URL</div>
            <div styleName="input-wrapper">
              <InputControl type="big"
                            value={this.state.domain}
                            readOnly={!isEditable}
                            onChange={this.onChangeDomain} />
            </div>
          </div>
          {
            isEditable &&
            <div styleName="buttons-wrapper">
              <ButtonControl color="green"
                             disabled={!this.state.dirty}
                             value="Save changes"
                             onClick={this.onSave}/>
            </div>
          }
          {
            this.error &&
            <div styleName="field-error">
              {this.error}
            </div>
          }
        </div>
      </ContainerComponent>
    );
  }
}