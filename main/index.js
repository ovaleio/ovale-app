const { format }        = require('url');
const path              = require('path');
const {
    BrowserWindow,
    app,
    session,
    Menu,
    ipcMain
}                       = require('electron');

const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://0b3e9bc318ef4ec586a2da0e258f4aab@sentry.io/1286691' });


const log = require('electron-log');

log.info('App starting...');



// Logging on each launch for unhandled errors.
// Specify another logger to send each log with each error.
// @see https://github.com/sindresorhus/electron-unhandled
const unhandled = require('electron-unhandled');
unhandled({logger:log.info, showDialog:false});


const isDev             = require('electron-is-dev');

const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');



const prepareNext       = require('electron-next');
const { resolve }       = require('app-root-path');

// Electron Settingss
// @see https://www.npmjs.com/package/electron-settings
const settingsProvider  = require('electron-settings');

// Loading Business Application
const Settings          = require('./library/settings/index.js');
const updater          = require('./library/updater.js');
const MenuTemplate      = require('./library/menu.js');
const HandleRest        = require('./rest_handlers.js');
const HandleSockets     = require('./websocket-server.js');


const settings = new Settings(settingsProvider);

const createWindow = () => {

    settings.start();


    startIPCHandler();

    const iconPath = path.join(__dirname, 'assets/icons/mac/icon.icns');

    let mainWindow;

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


    installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
        console.log(`Added Extension:  ${name}`);
    })
    .catch((err) => {
        console.log('An error occurred: ', err);
    });


    let loadedUrl = isDev ? devPath : prodPath;
    mainWindow.loadURL(loadedUrl);

    updater.update();

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if(isDev) mainWindow.webContents.openDevTools({mode: 'detach'});
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


// Start ipc handlers
// Sets global variables in main process to be usable on renderer process.
// @see http://electron.rocks/tag/global/
function startIPCHandler() {
    global.credentials = settingsProvider.get('credentials') || settings.defaultSettings.credentials;
    global.firstOpening = settingsProvider.get('firstOpening') || settings.defaultSettings.firstOpening;
    global.websockets = HandleSockets.init();
    global.rest = HandleRest();
}