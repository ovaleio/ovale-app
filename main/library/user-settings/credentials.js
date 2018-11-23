// Copyright 2018 Ovale
// Romain Lafforgue
const electron = require('electron');
const fs = require('fs');
const path = require('path');
const defaultSettings = require('./defaultSettings');
const settingsProvider  = require('electron-settings');
const encryption  = require('./encryption');

class Credentials {

    constructor(_password) {
        
        this.password               = _password;
        this.path = this.getPath();
        this.supportedExchanges     = defaultSettings.supportedExchanges;
        this.credentials            = {};
        this.defaults = this.setDefault();

    }


    getPath() {
        const app = electron.app; //Main only
        const userDataPath = app.getPath('userData');
        const defaultSettingsFilePath = path.join(userDataPath, 'Credentials');
        return defaultSettingsFilePath;
    }

    get() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path,'utf8', (err, data)=> {
                if (err) {
                    console.log('WRITE DEFAULTS')
                    this._set(this.defaults);
                    this.removeFromSettings();
                    resolve(this.defaults);
                } else {
                    console.log("filedata", data)
                    try {
                        let decrypted = encryption.decrypt(data, this.password);
                        decrypted = JSON.parse(decrypted)
                        resolve(decrypted);
                    } catch(e) {
                        console.log("Error found, rewriting to default")
                        this._set(this.defaults);
                        this.removeFromSettings();
                        resolve(this.defaults);
                    } 
                        
                }
            });
        });
    }
    
    set(data) {
        return this._set(data);
    }

    _set(_data) {

        //Stringify object 
        _data = JSON.stringify(_data);
        // send to 
        let cypherData = encryption.encrypt(_data, this.password)
        fs.writeFile(this.path, cypherData,(err)  => {
            if(err) console.error(err)
            return cypherData;
        });
    }

    setDefault() {
        console.log("SET DEFAULTS")
        if(settingsProvider.has('credentials')) {
            this.credentials = settingsProvider.get('credentials');
        } else {
            this.credentials = this.supportedExchanges.reduce((o, exchange) => {o[exchange] = {"apikey": "", "apisecret": ""}; return o; }, {})
        }
        return this.credentials;
    }
    removeFromSettings() {
        console.log('Remove from settings ')
        settingsProvider.delete('credentials');
    }

   
}


exports = module.exports = Credentials;