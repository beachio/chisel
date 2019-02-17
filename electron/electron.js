const {app, BrowserWindow, Menu, MenuItem, shell, autoUpdater, ipcMain, dialog} = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');


let selectorWindow;

function createSelectorWindow(onStart = false) {
  if (selectorWindow)
    return;

  const additionalArguments = [];
  if (onStart)
    additionalArguments.push('--chisel-on-start');

  selectorWindow = new BrowserWindow({width: 960, height: 760, webPreferences: {additionalArguments}});
  selectorWindow.loadURL(isDev ? 'http://localhost:9900' : `file://${path.join(__dirname, '../server-selector/index.html')}`);
  selectorWindow.on('closed', () => selectorWindow = null);
}

function constructMenu() {
  let menuTemplate = [{
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'selectall'}
    ]
  }, {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          // при перезагрузке закрываем второстепенные окна
          if (focusedWindow.id === 1)
            BrowserWindow.getAllWindows().forEach(win => {
              if (win.id > 1)
                win.close();
            });
          focusedWindow.reload();
        }
      }
    }, {
      label: 'Toggle Full Screen',
      accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
      click: (item, focusedWindow) => {
        if (focusedWindow)
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click: (item, focusedWindow) => {
        if (focusedWindow)
          focusedWindow.toggleDevTools();
      }
    }, {
      label: 'Show Server Select window',
      click: (item, focusedWindow) => {
        if (selectorWindow)
          selectorWindow.focus();
        else
          createSelectorWindow();
      }
    }]
  }, {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'},
      {type: 'separator'},
    {
      label: 'Reopen Window',
      accelerator: 'CmdOrCtrl+Shift+T',
      enabled: false,
      key: 'reopenMenuItem',
      click: () => app.emit('activate')
    }]
  }, {
    role: 'help',
    submenu: [{
      label: 'Learn More',
      click: () => shell.openExternal('http://electron.atom.io')
    }]
  }];


  function addUpdateMenuItems(items, position) {
    if (process.mas)
      return;

    const version = app.getVersion();
    const updateItems = [{
      label: `Version ${version}`,
      enabled: false
    }, {
      label: 'Checking for Update',
      enabled: false,
      key: 'checkingForUpdate'
    }, {
      label: 'Check for Update',
      visible: false,
      key: 'checkForUpdate',
      click: () => autoUpdater.checkForUpdates()
    }, {
      label: 'Restart and Install Update',
      enabled: true,
      visible: false,
      key: 'restartToUpdate',
      click: () => autoUpdater.quitAndInstall()
    }];

    items.splice.apply(items, [position, 0].concat(updateItems));
  }

  switch (process.platform) {
    case 'darwin':
      const name = app.getName();
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

      // Window menu.
      menuTemplate[3].submenu.push(
        {type: 'separator'},
        {role: 'front'}
      );

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


ipcMain.on('server-select--dialog-on-remove', event => {
  const options = {
    type: 'info',
    title: 'Removing server',
    message: "Are you sure?",
    buttons: ['Yes', 'No']
  };
  dialog.showMessageBox(options, index => {
    event.sender.send('server-select--dialog-on-remove-answer', index);
  });
});

ipcMain.on('server-select--select', (event, server) => {
  const window = new BrowserWindow({width: 1280, height: 800, webPreferences: {
      additionalArguments: ['--chisel-server=' + JSON.stringify(server)]
    }});
  window.loadURL(isDev ? 'http://localhost:9000' : `file://${path.join(__dirname, '../dist/index.html')}`);

  selectorWindow.close();
});





//================== app hooks==========

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(constructMenu());
  Menu.setApplicationMenu(menu);

  createSelectorWindow(true);
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