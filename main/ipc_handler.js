const settings = require('./library/user-settings');
const {ipcMain} = require('electron');
const RestHandler = require('./rest_handlers');
const Credentials = require('./library/user-settings/credentials');
const WebsockerHandler = require('./websocket-server');

const settingsHandler = new settings();

const sendSettings = (event) => {
  console.log("sendSettings")
  return event.sender.send('SETTINGS', settingsHandler.getAll())
}


const saveCredentials = (event, credentials) => {
  CredentialsHandler = new Credentials(global.password);
  CredentialsHandler.set(credentials)
  global.credentials = credentials;
  settingsHandler.set('lastSaved', Date.now());

  WebsockerHandler.restart()
  RestHandler(global.password, (credentials)=>{
    console.log('rest handler restarted');
  });

  event.sender.send('WEBSOCKET_SUCCESS', {message: 'Settings saved !'});
}


const updateUser = (event,payload) => {
  console.log("Payload", payload)
  if(payload !== undefined) {
    if(settingsHandler.set('user', payload)){
      event.sender.send('WEBSOCKET_SUCCESS', {message: 'You are sucessfully connected !'});
    }
  }
};

const requestUser = (event) => {
  console.log("requestUser")
  
  return event.sender.send('USER', settingsHandler.get('user'))
}

const LaunchRestHandler = (event, passw) => {
  console.log("Launch Rest Handler")
  RestHandler(passw, (credentials)=> {
    console.log("send DECRYPT_SETTINGS")
    return event.sender.send('DECRYPT_SETTINGS', credentials)
  });
  
}


const handlers = {
  'REQUEST_SETTINGS': sendSettings,
  'SAVE_CREDENTIALS': saveCredentials,
  'UPDATE_USER': updateUser,
  'REQUEST_USER': requestUser,
  'LAUNCH_REST_HANDLER': LaunchRestHandler
}

const IPCHandler = () => {
  //Remount listeners
  Object.keys(handlers).map((h) => {
    ipcMain.removeAllListeners(h)
    ipcMain.on(h, (event, data) => {
      handlers[h](event, data);
    });
  })
  return true;
}

module.exports = IPCHandler