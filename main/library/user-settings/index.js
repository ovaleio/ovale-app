// Copyright 2018 Ovale
// Romain Lafforgue

const electron = require('electron');
const settingsProvider  = require('electron-settings');

const changesets = require('diff-json');
const defaultSettings = require('./defaultSettings');
;

class Settings {
  constructor() {
    this.settingsProvider = settingsProvider;
    this.defaultSettings = defaultSettings;
  }

  getAll() {
    return  this.settingsProvider.getAll();
  }

  get(_name) {
    return  this.settingsProvider.get(_name);
  }

  set(_name, _value) {
    return  this.settingsProvider.set(_name, _value);
  }

  // Update file mechanism
  start() {

    if (!this.settingsProvider.has('init') || process.argv[2] === '--reset') {

      this.settingsProvider.setAll(Object.assign({init: Date.now()}, this.defaultSettings));
      return true;

    } else {

      let changes = changesets.diff(this.settingsProvider.getAll(),this.defaultSettings);
      if(changes.length >0) {
        for(let change in changes){
          switch (changes[change].type){
            case "add":
              this.addSetting(changes[change]);
              break;
            case "update":
              this.updateSetting(changes[change]);
              break;
          }
        }
      }
    }

  }
  addSetting(change){
    this.settingsProvider.set(change.key, change.value);
  }

  // Update local Setting with the new defaultSetting format
  updateSetting(change){

    if(change.key == "user") return;

    if (change.key === "supportedExchanges"){

      let supported = this.settingsProvider.get('supportedExchanges');

      for(let i=0; i<change.changes.length; i++) {

        if( change.changes[i].type === "add") {
          supported.splice(change.changes[i].key, 0, change.changes[i].value);
        }
        if( change.changes[i].type === "remove") {
          supported.splice(change.changes[i].key, 1);
        }
      }
      this.settingsProvider.set(change.key, supported);
    }
    if (change.key === "credentials"){

      let supported = this.settingsProvider.get('credentials');
      for(let i=0; i<change.changes.length; i++) {

        if( change.changes[i].type === "add") {

          console.log(change.changes[i].key)
          console.log(change.changes[i].value)
          supported[change.changes[i].key] = change.changes[i].value;

        }
      }
      this.settingsProvider.set(change.key, supported);
    }
  }


}


exports = module.exports = Settings;