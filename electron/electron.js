const path = require('path');
const url = require('url');

const {app, BrowserWindow, Menu, MenuItem, shell, ipcMain, dialog, Notification, NotificationAction} = require('electron');
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
    ...(isMac ? [{
      label: app.name,
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {
          label: 'Check for Update',
          click: () => autoUpdater.checkForUpdates()
        },
        {type: 'separator'},
        {role: 'services'},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    }] : [{
      label: 'File',
      submenu: [
        {role: 'quit'}
      ]
    }]),
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'delete'},
        ...(isMac ? [
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
      submenu: [
        ...(isMac ? []: [
          {role: 'about'},
          {
            label: 'Check for Update',
            click: () => autoUpdater.checkForUpdates()
          }
        ]),
        {
          label: 'Learn More',
          click: () => shell.openExternal('http://chiselcms.com')
        }
      ]
    }
  ];

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



//======electron updater events

autoUpdater.on('update-available', (info) => {
  autoUpdater.downloadUpdate();
})
autoUpdater.on('update-not-available', (info) => {
  const notif = new Notification({
    title: 'Update not available',
    body: 'You are using the latest version of Chisel CMS.'
  });
  notif.show();
  notif.addListener('click', notif.close);
})
autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = "Download speed: " + progressObj.bytesPerSecond;
  logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
  logMessage = logMessage + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  log.info(logMessage);
})
autoUpdater.on('update-downloaded', (info) => {
  const notif = new Notification({
    title: 'Update was downloaded',
    body: 'Restart Chisel CMS app to install update.',
    actions: [{
      type: 'button',
      text: 'Restart'
    }]
  });
  notif.show();
  notif.addListener('action', autoUpdater.quitAndInstall);
});


//================== app hooks==========

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(constructMenu());
  Menu.setApplicationMenu(menu);

  createSelectorWindow(true);

  log.transports.file.level = "debug";
  log.info('App ready.');
  autoUpdater.logger = log;

  autoUpdater.checkForUpdates();
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



app.setName('Chisel CMS');

app.setAppUserModelId(process.execPath);