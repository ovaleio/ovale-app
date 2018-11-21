const { format }        = require('url');
const {
    BrowserWindow,
    app,
    session,
    Menu
}                       = require('electron');


const log = require('electron-log');
console.log = log.info;
log.info('App starting...');

const isDev             = require('electron-is-dev');

// Logging on each launch for unhandled errors.
// Specify another logger to send each log with each error.
// @see https://github.com/sindresorhus/electron-unhandled
const unhandled = require('electron-unhandled');
unhandled({logger:log.info, showDialog:false});

const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

const prepareNext       = require('electron-next');
const { resolve }       = require('app-root-path');

// Electron Settings
// @see https://www.npmjs.com/package/electron-settings
const settingsProvider  = require('electron-settings');

// Loading Business Application
const Settings          = require('./library/user-settings/index.js');
const updater           = require('./library/updater.js');
const icons             = require('./library/icons');
const MenuTemplate      = require('./library/menu.js');
const HandleRest        = require('./rest_handlers.js');
const HandleSockets     = require('./websocket-server.js');

const settings = new Settings(settingsProvider);

let mainWindow = null;
let forceQuit = false;


// Sentry
if (!isDev){
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn: 'https://0b3e9bc318ef4ec586a2da0e258f4aab@sentry.io/1286691' });
}
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


const createWindow = () => {

    console.log("icons")
    const iconPath = icons.getIcon();

    console.log("mainwindow")
    mainWindow = new BrowserWindow({
        show: false,
        width: 1400,
        height: 800,
        center:true,
        backgroundColor: '#123932',
        icon:iconPath,
        webPreferences: {
            webSecurity: false // @todo : WHY ?
        }
    });


    if(isDev){
        installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
          console.log(`Added Extension:  ${name}`);
        })
          .catch((err) => {
            console.log('An error occurred: ', err);
          });
  
        installExtension(REDUX_DEVTOOLS).then((name) => {
          console.log(`Added Extension:  ${name}`);
        })
          .catch((err) => {
            console.log('An error occurred: ', err);
          });
      }


    console.log("muitheme")
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
    console.log("path : ", loadedUrl )
    mainWindow.loadURL(loadedUrl);
    
    mainWindow.once('ready-to-show', () => {
        console.log("ready-to-show")
        mainWindow.show();
        if(isDev) mainWindow.webContents.openDevTools({mode: 'detach'});
    });

    
    mainWindow.webContents.on('did-finish-load', () => {
        // Handle window logic properly on macOS:
        // 1. App should not terminate if window has been closed
        // 2. Click on icon in dock should re-open the window
        // 3. ⌘+Q should close the window and quit the app
        if (process.platform === 'darwin') {
        mainWindow.on('close', function(e) {
            if (!forceQuit) {
            e.preventDefault();
            mainWindow.hide();
            }
        });

        app.on('activate', () => {
            mainWindow.show();
        });

        app.on('before-quit', () => {
            forceQuit = true;
        });
        } else {
        mainWindow.on('closed', () => {
            mainWindow = null;
        });
        }
    });


  if (isDev) {
    // auto-open dev tools
    mainWindow.webContents.openDevTools({mode:'detach'});

    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            mainWindow.inspectElement(props.x, props.y);
          },
        },
      ]).popup(mainWindow);
    });
  }
};


// Prepare the renderer once the app is ready
app.on('ready',  async () => {

    Menu.setApplicationMenu(Menu.buildFromTemplate(MenuTemplate));
    await prepareNext('./renderer');
    await createWindow();

    console.log("settings")
    settings.start();

    console.log("ipc")
    startIPCHandler();

    console.log("updater : ")
    updater.update();

});



// Start ipc handlers
// Sets global variables in main process to be usable on renderer process.
// @see http://electron.rocks/tag/global/
function startIPCHandler() {
    process.env.npm_package_api = (isDev)?"http://localhost:8200":"http://localhost:8200";
    global.credentials = settingsProvider.get('credentials') || settings.defaultSettings.credentials;
    global.websockets = HandleSockets.init();
    global.rest = HandleRest();
}