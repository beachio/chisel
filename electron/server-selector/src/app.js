import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

//const {ipcRenderer} = window.require("electron");

import {checkURL} from 'utils/common';

import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import IconsComponent from 'components/elements/IconsComponent/IconsComponent';
import InputControl from "components/elements/InputControl/InputControl";


import styles from './app.sss';


@CSSModules(styles, {allowMultiple: true})
export default class App extends Component {
  state = {
    server: null,

    name: '',
    URL: '',
    appId: '',
    JSkey: '',
    RESTkey: '',

    error: null
  };

  servers = [{
    name: 'Forge Default',
    URL: 'http://dockerhost.forge-parse-server.c66.me:96/parse',
    appId: '34edf2a8ec1b3351d2594c3e90e70cd8',
    JSkey: `liYLwLfENUIiiD6bz8TerwIZPPnJWP3VVHCSUUOT`,
    RESTkey: `AMMaWJMu4u6hSANZfbBFZHLhU83DWOXHXPVnPHJE`
  }];


  constructor(props) {
    super(props);

    let servers;
    const local = localStorage.getItem('chisel-servers');
    try {
      servers = JSON.parse(local);
    } catch (e) {}
    if (servers && servers.length)
      this.servers = servers;
  }

  onChangeName = name => {
    this.setState({name, error: null});
  };

  onChangeURL = URL => {
    this.setState({URL, error: null});
  };

  onChangeAppId = appId => {
    this.setState({appId, error: null});
  };

  onChangeJSkey = JSkey => {
    this.setState({JSkey, error: null});
  };

  onChangeRESTkey = RESTkey => {
    this.setState({RESTkey, error: null});
  };

  checkErrors = () => {
    if (!this.state.name || !this.state.URL || !this.state.appId)
      return `You should fill required fields.`;

    if (!checkURL(this.state.URL))
      return `The URLis incorrect!`;

    for (let server of this.servers) {
      if (this.name == server.name)
        return `A server namemust be unique!`;
    }

    return null;
  };

  onAddServer = () => {
    const error = this.checkErrors();
    if (error) {
      this.setState({error});
      return false;
    }

    const server = {
      name:   this.state.name,
      URL:    this.state.URL,
      appId:  this.state.appId,
      JSkey:  this.state.JSkey,
      RESTkey:this.state.RESTkey
    };
    this.servers.push(server);
    localStorage.setItem('chisel-servers', JSON.stringify(this.servers));
    this.setState({server});
    return true;
  };

  onRemoveServer = () => {
    ipcRenderer.send('server-select--dialog-on-remove');
    ipcRenderer.on('server-select--dialog-on-remove-answer', (event, index) => {
      if (index === 0) {
        this.servers.splice(this.servers.indexOf(this.state.server), 1);
        localStorage.setItem('chisel-servers', this.servers);
      }
    });
  };

  onSelectServer = () => {
    if (!this.state.server) {
      const added = this.onAddServer();
      if (!added)
        return;
    }

    if (!this.state.error)
      ipcRenderer.send('server-select--select', this.state.server);
  };

  onServerClick = server => {
    if (server)
      this.setState({
        server,
        name:   server.name,
        URL:    server.URL,
        appId:  server.appId,
        JSkey:  server.JSkey,
        RESTkey:server.RESTkey
      });
    else
      this.setState({
        server: null,
        name:   '',
        URL:    '',
        appId:  '',
        JSkey:  '',
        RESTkey:''
      });
  };

  render() {
    let newServerStyle = "server server-new";
    if (!this.state.server)
      newServerStyle += " server-checked";

    return (
      <div styleName="content">
        <div styleName="side">
          {this.servers &&
            this.servers.map(server => {
              let style = "server";
              if (server == this.state.server)
                style += " server-checked";
              return (
                <div styleName={style}
                     key={server.name}
                     onClick={() => this.onServerClick(server)}>
                  <div styleName="name">{server.name}</div>
                </div>
              );
            })
          }

          <div styleName={newServerStyle}
               onClick={() => this.onServerClick()}>
            <div styleName="name">
              Add Server
            </div>
            <div styleName="icon-plus">
              <IconsComponent icon="plus" />
            </div>
          </div>
        </div>

        <div styleName="main">
          <div styleName="input-wrapper">
            <InputControl label="Name:"
                          onChange={this.onChangeName}
                          value={this.state.name} />
          </div>

          <div styleName="input-wrapper">
            <InputControl label="URL:"
                          onChange={this.onChangeURL}
                          value={this.state.URL} />
          </div>

          <div styleName="input-wrapper">
            <InputControl label="App ID:"
                          onChange={this.onChangeAppId}
                          value={this.state.appId} />
          </div>

          <div styleName="input-wrapper">
            <InputControl label="JS key:"
                          onChange={this.onChangeJSkey}
                          value={this.state.JSkey} />
          </div>

          <div styleName="input-wrapper">
            <InputControl label="REST key:"
                          onChange={this.onChangeRESTkey}
                          value={this.state.RESTkey} />
          </div>

          {this.state.error &&
            <div styleName="error">{this.state.error}</div>
          }

          <div styleName="button-wrapper">
            {!!this.state.server &&
              <ButtonControl onClick={this.onRemoveServer}
                             color="red"
                             value="Remove server"/>
            }
          </div>
          <div styleName="button-wrapper">
            <ButtonControl onClick={this.onSelectServer}
                           value="Select"/>
          </div>
        </div>
      </div>
    );
  }
}
