import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

const {ipcRenderer} = window.require("electron");

import {checkURL} from 'utils/common';

import ButtonControl from "components/elements/ButtonControl/ButtonControl";
import IconsComponent from 'components/elements/IconsComponent/IconsComponent';
import InputControl from "components/elements/InputControl/InputControl";
import CheckboxControl from "components/elements/CheckboxControl/CheckboxControl";


import styles from './app.sss';


const LOCAL_STORAGE_KEY = 'chisel-servers-list';


@CSSModules(styles, {allowMultiple: true})
export default class App extends Component {
  state = {
    server: null,

    name: '',
    URL: '',
    appId: '',
    JSkey: '',
    RESTkey: '',

    loadOnStart: true,

    dirty: false,
    error: null,

    redName: false,
    redURL: false,
    redAppId: false
  };

  servers = [{
    name: 'Forge Default',
    URL: 'http://dockerhost.forge-parse-server.c66.me:96/parse',
    appId: '34edf2a8ec1b3351d2594c3e90e70cd8',
    JSkey: `liYLwLfENUIiiD6bz8TerwIZPPnJWP3VVHCSUUOT`,
    RESTkey: `AMMaWJMu4u6hSANZfbBFZHLhU83DWOXHXPVnPHJE`,
    loadOnStart: true
  }];


  constructor(props) {
    super(props);

    let servers;
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      servers = JSON.parse(local);
    } catch (e) {}
    if (servers && servers.length) {
      for (let server of servers) {
        if (server.loadOnStart) {
          try {
            const {argv} = window.process;
            for (let arg of argv) {
              if (arg == '--chisel-on-start') {
                ipcRenderer.send('server-select--select', server);
                return;
              }
            }
          } catch (e) {}

          this.state.server = server;
          break;
        }
      }

      this.servers = servers;
    }

    if (!this.state.server)
      this.state.server = this.servers[0];

    this.state.name       = this.state.server.name;
    this.state.URL        = this.state.server.URL;
    this.state.appId      = this.state.server.appId;
    this.state.JSkey      = this.state.server.JSkey;
    this.state.RESTkey    = this.state.server.RESTkey;
    this.state.loadOnStart= this.state.server.loadOnStart;
  }

  onChangeName = name => {
    this.setState({name, error: null, dirty: true, redName: false});
  };

  onChangeURL = URL => {
    this.setState({URL, error: null, dirty: true, redURL: false});
  };

  onChangeAppId = appId => {
    this.setState({appId, error: null, dirty: true, redAppId: false});
  };

  onChangeJSkey = JSkey => {
    this.setState({JSkey, error: null, dirty: true});
  };

  onChangeRESTkey = RESTkey => {
    this.setState({RESTkey, error: null, dirty: true});
  };

  onChangeLoadOnStart = loadOnStart => {
    this.setState({loadOnStart, dirty: true});
  };

  checkErrors = () => {
    if (!this.state.name || !this.state.URL || !this.state.appId) {
      this.setState({
        error: `You should fill all required fields.`,
        redName:  !this.state.name,
        redURL:   !this.state.URL,
        redAppId: !this.state.appId
      });
      return false;

    } else if (!checkURL(this.state.URL)) {
      this.setState({error: `The URL is incorrect!`, redURL: true});
      return false;

    } else {
      for (let server of this.servers) {
        if (this.name == server.name) {
          this.setState({error: `A server name must be unique!`, redName: true});
          return false;
        }
      }
    }

    return true;
  };

  onSaveServer = () => {
    if (!this.checkErrors())
      return false;

    let server = this.state.server;
    if (!server) {
      server = {};
      this.servers.push(server);
    }

    server.name   = this.state.name;
    server.URL    = this.state.URL;
    server.appId  = this.state.appId;
    server.JSkey  = this.state.JSkey;
    server.RESTkey= this.state.RESTkey;

    if (this.state.loadOnStart && !server.loadOnStart) {
      server.loadOnStart = true;
      for (let server1 of this.servers) {
        if (server1.loadOnStart && server1 != server)
          server1.loadOnStart = false;
      }
    } else {
      server.loadOnStart = this.state.loadOnStart;
    }

    this.setState({server, dirty: false});
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.servers));
    return server;
  };

  onRemoveServer = () => {
    ipcRenderer.send('server-select--dialog-on-remove');
    ipcRenderer.on('server-select--dialog-on-remove-answer', (event, index) => {
      if (index !== 0)
        return;

      this.servers.splice(this.servers.indexOf(this.state.server), 1);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.servers));
      this.onServerClick(this.servers[0]);
    });
  };

  onSelectServer = () => {
    const server = this.onSaveServer();
    if (!server)
      return;

    ipcRenderer.send('server-select--select', server);
  };

  onServerClick = server => {
    if (server)
      this.setState({
        server,
        name:       server.name,
        URL:        server.URL,
        appId:      server.appId,
        JSkey:      server.JSkey,
        RESTkey:    server.RESTkey,
        loadOnStart:server.loadOnStart,

        dirty: false
      });
    else
      this.setState({
        server: null,
        name:   '',
        URL:    '',
        appId:  '',
        JSkey:  '',
        RESTkey:'',
        loadOnStart:true,

        dirty: true
      });

    this.setState({
      error: null,
      redName: false,
      redURL: false,
      redAppId: false
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
                          red={this.state.redName}
                          value={this.state.name} />
          </div>

          <div styleName="input-wrapper">
            <InputControl label="URL:"
                          onChange={this.onChangeURL}
                          red={this.state.redURL}
                          value={this.state.URL} />
          </div>

          <div styleName="input-wrapper">
            <InputControl label="App ID:"
                          onChange={this.onChangeAppId}
                          red={this.state.redAppId}
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

          <div styleName="input-wrapper">
            <CheckboxControl title="Load on start"
                             checked={this.state.loadOnStart}
                             onChange={this.onChangeLoadOnStart} />
          </div>

          <div styleName="buttons">
            <div styleName="button-wrapper">
              <ButtonControl onClick={this.onRemoveServer}
                             color="red-outline"
                             disabled={!this.state.server}
                             value="Remove Server"/>
            </div>
            <div styleName="button-wrapper">
              <ButtonControl onClick={this.onSaveServer}
                             disabled={!this.state.dirty || this.state.error}
                             value="Save"/>
            </div>
            <div styleName="button-wrapper">
              <ButtonControl onClick={this.onSelectServer}
                             color='purple'
                             value="Select"/>
            </div>
          </div>

          {this.state.error &&
            <div styleName="error">{this.state.error}</div>
          }
        </div>
      </div>
    );
  }
}
