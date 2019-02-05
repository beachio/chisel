const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 1600, height: 960});
  mainWindow.loadURL(isDev ? 'http://localhost:9000' : `file://${path.join(__dirname, '../dist/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  //if (process.platform !== 'darwin')
    app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});