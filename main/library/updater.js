
const {
    app,
    dialog,
    Notification
}                       = require('electron');
const { autoUpdater }   = require("electron-updater");
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('Update starting...');


const updater = {
    timeBetweenUpdates: 60*60*1000,
    updaterEvents: function(){

        autoUpdater.on('update-available', function(info) {
            log.info(info);
        });

        autoUpdater.on('update-not-available', function(info) {
            console.log("Update not available ",info);
        });

        autoUpdater.on('download-progress', function(progress) {
            
        });
        autoUpdater.on('update-downloaded', function(info) {


            const dialogOpts = {
                type: 'info',
                buttons: ['Restart', 'Later'],
                title: 'Application Update',
                message: process.platform === 'win32' ? info.releaseNotes : info.releaseName,
                detail: 'A new version has been downloaded. Restart the application to apply the updates.'
            };

            dialog.showMessageBox(dialogOpts, (response) => {
                if (response === 0) autoUpdater.quitAndInstall();
            })

            
        });

        autoUpdater.on('error', function(e) {
            log.error(e);
        });

    },
    update: function(){

        this.checkForUpdates();
        this.updaterEvents();

    },
    checkForUpdates: function() {
        autoUpdater.checkForUpdates();
          
        //just in case, adds a set timeout on the update method to check every day
        setTimeout(()=>{
            autoUpdater.checkForUpdates();
        }, this.timeBetweenUpdates);

    }


};


exports = module.exports = updater;

