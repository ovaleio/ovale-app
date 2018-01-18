// Native
const { format } = require('url')
const path = require('path')

// Packages
const { BrowserWindow, app, session } = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const { resolve } = require('app-root-path')
require('electron-debug')({showDevTools: true});
const settings = require('electron-settings');

const webSocketServer = require('./websocket-server.js')


const createWindow = () => {
  //settings.set('supportedExchanges', ['bitfinex', 'bittrex', 'poloniex'])

  //spawn websocket
  webSocketServer();

  const mainWindow = new BrowserWindow({
    backgroundColor: '#123932',
    show: false,
    width: 1200,
    height: 654,
    icon: path.join(__dirname, 'assets/icons/mac/icon.icns')
  })

  mainWindow.once('ready-to-show', () => {
     mainWindow.show()
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
  if (isDev) mainWindow.addDevToolsExtension('/Users/johnthillaye/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi')

} 

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')
  createWindow()
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)