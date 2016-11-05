import React, {Component, PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import InlineSVG from 'svg-inline-react';
import InputControl from '../../../elements/InputControl/InputControl';

import ButtonControl from 'components/elements/ButtonControl/ButtonControl';
import {FIELD_TYPE_SHORT_TEXT, FIELD_TYPE_LONG_TEXT, FIELD_TYPE_REFERENCE, FIELD_TYPE_REFERENCES,
  FIELD_TYPE_ASSET, FIELD_TYPE_INTEGER, FIELD_TYPE_FLOAT, FIELD_TYPE_DATE, FIELD_TYPE_BOOLEAN, FIELD_TYPE_JSON} from 'models/ModelData';

import styles from './ContentEdit.sss';


@CSSModules(styles, {allowMultiple: true})
export default class ContentEdit extends Component {
  state = {
    title: "",
    slug: "",
    color: "rgba(0, 0, 0, 1)",
    fields: new Map(),

    editTitle: false,
    titleInputWidth: 0
  };
  item = null;

  componentWillMount() {
    this.item = this.props.item;
    this.setState({
      title:  this.item.title,
      slug:   this.item.slug,
      color:  this.item.color,
      fields: this.item.fields
    });
  }

  onEditClickTitle = () => {
    this.setState({editTitle: true});
    this.refs.name.focus();
  };

  onTitleChange = event => {
    let title = event.target.value;
    this.setState({
      title,
      nameInputWidth: event.target.value.length
    });
  };

  onSlugChange = event => {
    let slug = event.target.value;
    this.setState({slug});
  };

  onTitleBlur = () => {
    this.endEdit();
  };

  onTitleKeyDown = event => {
    //Enter pressed
    if (event.keyCode == 13) {
      this.onSave();
      this.endEdit();
    //Esc pressed
    } else if (event.keyCode == 27) {
      this.endEdit();
    }
  };

  endEdit() {
    this.setState({editTitle: false});
  }

  onClose = () => {
    this.onSave();
    this.props.onClose();
  };

  onSave() {
    if (!this.state.title)
      return;

    this.item.title = this.state.title;
    this.item.slug  = this.state.slug;
    this.item.color = this.state.color;
    this.item.fields = this.state.fields;

    this.props.updateItem(this.item);
  }

  generateElement(field, value) {
    let inner;

    switch (field.type) {
      case FIELD_TYPE_SHORT_TEXT:
        inner = (
          <div styleName="input-wrapper">
            <input styleName="input" />
          </div>
        );
        break;

      case FIELD_TYPE_LONG_TEXT:
        inner = (
          <textarea styleName="textarea">
          </textarea>
        );
        break;
    }

    return (
      <div styleName="field" key={field.nameId}>
        <div styleName="field-title">
          {field.name}
        </div>
        {inner}
      </div>
    );
  }

  generateContent() {
    let content = [];
    for (let [field, value] of this.state.fields) {
      let elm = this.generateElement(field, value);
      content.push(elm);
    }
    return (
      <div>
        {content}
      </div>
    );
  }

  render() {
    const {isEditable} = this.props;

    let titleStyle = "header-title";
    if (this.state.editTitle)
      titleStyle += " header-title-edit";

    let content = this.generateContent();

    return (
      <div className="g-container" styleName="ContentEdit">

        <div styleName="header">
          <div styleName="back" onClick={this.onClose}>Back</div>
          <div styleName="header-wrapper">
            <input size={this.state.nameInputWidth}
                   ref="name"
                   styleName={titleStyle}
                   value={this.state.title}
                   readOnly={!this.state.editTitle}
                   placeholder="Type title"
                   onBlur={this.onTitleBlur}
                   onChange={this.onTitleChange}
                   onKeyDown={this.onTitleKeyDown} />
            <div styleName="edit"
                 onClick={this.onEditClickTitle} >
              edit
            </div>
          </div>
          <div styleName="header-wrapper">
            <div styleName="header-model">
              {this.item.model.name}
            </div>
          </div>
        </div>

        <div styleName="content">

          <div styleName="field">
            <InputControl label="slug"
                          type="big"
                          placeholder="Type slug"
                          readOnly={!isEditable}
                          value={this.state.slug}
                          onChange={this.onSlugChange} />
          </div>

          <div styleName="field">
            <div styleName="field-title">
              bannerImage
            </div>
            <div styleName="image">
              <form styleName="fileUpload" encType="multipart/form-data" method="post">
                <input styleName="fileUpload-input" type="file" />
              </form>
            </div>
          </div>

          <div styleName="field">
            <div styleName="field-title">
              showAuthor
            </div>
            <div styleName="radio-wrapper">
              <div styleName="radio-button">
                <input styleName="radio" type="radio" id="radio01" name="radio"/>
                <label styleName="radio-label" htmlFor="radio01">Yes</label>
              </div>
              <div styleName="radio-button">
                <input styleName="radio" type="radio" id="radio02" name="radio" />
                <label styleName="radio-label" htmlFor="radio02">No</label>
              </div>
            </div>
          </div>

          <div styleName="field">
            <div styleName="field-title">
              Authors
            </div>
            <div styleName="input-wrapper">
              <input styleName="input" placeholder="Steve Schofield"/>
              <input styleName="input" placeholder="Boris Adimov"/>
            </div>
          </div>

          {content}
        </div>
      </div>
    );
  }
}
