const { format }        = require('url');
const path              = require('path');
const {
  BrowserWindow,
  app,
  session,
  Menu
}                       = require('electron');

const isDev             = require('electron-is-dev');
const log               = require('electron-log');

const prepareNext       = require('electron-next');
const { resolve }       = require('app-root-path');
const ElectronSettings  = require('electron-settings');

// Loading Business Application
const DefaultSettings   = require('./library/defaultSettings.js');
const HandleRest        = require('./rest_handlers.js');
const HandleSockets     = require('./websocket-server.js');


const MenuTemplate = [{
  label: "Application",
  submenu: [
    { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
    { type: "separator" },
    { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
  ]}, {
  label: "Edit",
  submenu: [
    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
    { type: "separator" },
    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
  ]}
];

const createWindow = () => {

  initElectronSettings();

  startIPCHandler();

  const iconPath = path.join(__dirname, 'assets/icons/mac/icon.icns');

  mainWindow = new BrowserWindow({
    backgroundColor: '#123932',
    show: false,
    width: 1200,
    height: 654,
    icon: iconPath,
    webPreferences: {
      webSecurity: false // @todo : WHY ?
    }
  });

  //for muiTheme
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'all';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });


  let devPath = 'http://localhost:8000/';
  let prodPath = format({
    pathname: resolve('renderer/out/index.html'),
    protocol: 'file:',
    slashes: true
  });

  let loadedUrl = isDev ? devPath : prodPath;
  mainWindow.loadURL(loadedUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null
  })

};


// Prepare the renderer once the app is ready
app.on('ready',  async () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(MenuTemplate));
  await prepareNext('./renderer');
  createWindow();
});

// Quit the app once all windows are closed
app.on('window-all-closed', () => {
  app.quit()
});



// Check if we have a reset argument to choose DefaultSettings
function initElectronSettings () {
  if (!ElectronSettings.has('init') || process.argv[2] === '--reset') {
    log.info('Reset specified: Setting ElectronSettings to DefaultSettings');
    ElectronSettings.setAll(Object.assign({init: Date.now()}, DefaultSettings));
    return true;
  }
  return false;
}


// Start ipc handlers
// Sets global variables in main process to be usable on renderer process.
// @see http://electron.rocks/tag/global/
function startIPCHandler() {
  log.info('IPCHandler : Starting');
  global.credentials = ElectronSettings.get('credentials') || DefaultSettings.credentials;
  global.websockets = HandleSockets.init();
  global.rest = HandleRest();
}
