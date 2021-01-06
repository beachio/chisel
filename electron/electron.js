const path = require('path');
const url = require('url');

const {app, BrowserWindow, Menu, MenuItem, shell, ipcMain, dialog} = require('electron');
const isDev = require('electron-is-dev');
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');


let selectorWindow;

function createSelectorWindow(onStart = false) {
  if (selectorWindow)
    return;

  const additionalArguments = [];
  if (onStart)
    additionalArguments.push('--chisel-on-start');

  selectorWindow = new BrowserWindow({
    width: 960,
    height: 760,
    webPreferences: {
      additionalArguments,
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  selectorWindow.loadURL(isDev ? 'http://localhost:9900' : `file://${path.join(__dirname, '../server-selector/index.html')}`);
  selectorWindow.on('closed', () => selectorWindow = null);
}

function constructMenu() {
  const isMac = process.platform === 'darwin';

  let menuTemplate = [
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        ...(isMac ? [
          {role: 'delete'},
          {role: 'selectAll'},
          {type: 'separator'},
          {
            label: 'Speech',
            submenu: [
              {role: 'startSpeaking'},
              {role: 'stopSpeaking'}
            ]
          }
        ] : [
          {role: 'delete'},
          {type: 'separator'},
          {role: 'selectAll'}
        ])
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Show Server Select window',
          click: (item, focusedWindow) => {
            if (selectorWindow)
              selectorWindow.focus();
            else
              createSelectorWindow();
          }
        },
        {type: 'separator'},
        {role: 'reload'},
        {role: 'toggleDevTools'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'zoom'},
        ...(isMac ? [
          {type: 'separator'},
          {role: 'front'},
          {type: 'separator'},
          {role: 'window'}
        ] : [
          {role: 'close'}
        ])
      ]
    },
    {
      role: 'help',
      submenu: [{
        label: 'Learn More',
        click: () => shell.openExternal('http://chiselcms.com')
      }]
    }
  ];


  function addUpdateMenuItems(items, position) {
    if (process.mas)
      return;

    const version = app.getVersion();
    const updateItems = [
      {
        label: `Version ${version}`,
        enabled: false
      },
      {
        label: 'Checking for Update',
        enabled: false,
        key: 'checkingForUpdate'
      },
      {
        label: 'Check for Update',
        visible: false,
        key: 'checkForUpdate',
        click: () => autoUpdater.checkForUpdates()
      },
      {
        label: 'Restart and Install Update',
        enabled: true,
        visible: false,
        key: 'restartToUpdate',
        click: () => autoUpdater.quitAndInstall()
      }
    ];

    items.splice.apply(items, [position, 0].concat(updateItems));
  }

  switch (process.platform) {
    case 'darwin':
      const name = app.name;
      menuTemplate.unshift({
        label: name,
        submenu: [
          {role: 'about'},
          {type: 'separator'},
          {role: 'services'},
          {type: 'separator'},
          {role: 'hide'},
          {role: 'hideothers'},
          {role: 'unhide'},
          {type: 'separator'},
          {role: 'quit'}
        ]
      });

      //addUpdateMenuItems(menuTemplate[0].submenu, 1);

      break;

    case 'win32':
      const helpMenu = menuTemplate[menuTemplate.length - 1].submenu;
      //addUpdateMenuItems(helpMenu, 0);
      break;
  }

  return menuTemplate;
}

function findReopenMenuItem() {
  const menu = Menu.getApplicationMenu();
  if (!menu)
    return null;

  for (let item of menu.items) {
    if (item.submenu) {
      for (let itemSub of item.submenu.items) {
        if (itemSub.key === 'reopenMenuItem')
          return itemSub;
      }
    }
  }
  return null;
}


ipcMain.on('server-select--dialog-on-remove', async event => {
  const options = {
    type: 'info',
    title: 'Removing server',
    message: "Are you sure?",
    buttons: ['Yes', 'No']
  };
  const res = await dialog.showMessageBox(options);
  event.sender.send('server-select--dialog-on-remove-answer', res.response);
});

ipcMain.on('server-select--select', (event, server) => {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      additionalArguments: ['--chisel-server=' + JSON.stringify(server)],
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  window.loadURL(isDev ? 'http://localhost:9000' : `file://${path.join(__dirname, '../dist/index.html')}`);

  selectorWindow.close();
});





//================== app hooks==========

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(constructMenu());
  Menu.setApplicationMenu(menu);

  createSelectorWindow(true);

  log.transports.file.level = "debug";
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('browser-window-created', (event, win) => {
  let reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem)
    reopenMenuItem.enabled = false;
});

app.on('window-all-closed', () => {
  let reopenMenuItem = findReopenMenuItem();
  if (reopenMenuItem)
    reopenMenuItem.enabled = true;

  if (process.platform !== 'darwin')
    app.quit();
});

app.on('activate', () => {
  if (!BrowserWindow.getAllWindows().length)
    createSelectorWindow();
  //if (mainWindow === null)
    //createWindow();
});