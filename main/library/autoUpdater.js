const os = require('os');
const {app,ipcMain} = require('electron');
const { autoUpdater }   = require("electron-updater");


function updaterEvents() {

}

exports = module.exports = {
  updaterEvents
};

/*
index.js
const { autoUpdater }   = require("electron-updater");
const {updaterEvents}   = require('./library/autoUpdater.js');

  mainWindow.once('ready-to-show', () => {
    log.transports.file.level = "debug";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();


menu.js
const { autoUpdater }   = require("electron-updater");
    { label: "Check for Updates", selector: "checkUpdates:", click() { autoUpdater.checkForUpdatesAndNotify()}},


 */