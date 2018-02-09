// Native
const { format } = require('url')
const path = require('path')
const {ipcMain} = require('electron')

// Packages
const { BrowserWindow, app, session, Menu } = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const { resolve } = require('app-root-path')
require('electron-debug')({showDevTools: true});


const settings = require('electron-settings');
const initSocket = require('./websocket-server');

var template = [{
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
  if (!settings.has('init')) {
    const supportedExchanges = ['bitfinex', 'bittrex', 'poloniex'];
    const credentials = supportedExchanges.reduce((o, exchange) => {o[exchange] = {"apikey": "", "apisecret": ""}; return o; }, {})
    settings.setAll({init: Date.now(), supportedExchanges: supportedExchanges, credentials: credentials});
    ipcMain.on('OPENED_MAIN_WINDOW', (event) => {
      console.log('ok')
      event.sender.send('OPEN_SNACKBAR_REDIRECT', {message: 'Welcome ! Please add credentials', redirectTo: '/settings'})
    })
  }

  const iconPath = path.join(__dirname, 'assets/icons/mac/icon.icns')
  console.log(iconPath);

  const mainWindow = new BrowserWindow({
    backgroundColor: '#123932',
    show: false,
    width: 1200,
    height: 654,
    icon: iconPath,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    initSocket();    
  })

  //for muiTheme
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'all';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });


  const devPath = 'http://localhost:8000/'
  const prodPath = format({
    pathname: resolve('renderer/out/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const url = isDev ? devPath : prodPath
  mainWindow.loadURL(url)
  //if (isDev) mainWindow.addDevToolsExtension('/Users/johnthillaye/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi')

} 

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  await prepareNext('./renderer')
  createWindow()
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)