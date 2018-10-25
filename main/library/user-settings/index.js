const changesets = require('diff-json');
const defaultSettings = require('./defaultSettings');
const log = require('electron-log');


// Classe pour pouvoir conserver la flexibilité du provider de settings (pas sûr de conserver electron-settings)

class Settings {
  constructor(settingsProvider) {
    this.settingsProvider = settingsProvider;
    this.defaultSettings = defaultSettings;
  }

  // Lance la procédure de vérification des données contenues dans electron-settings
  start() {
    log.info('user-settings');
    if (!this.settingsProvider.has('init') || process.argv[2] === '--reset') {

      this.settingsProvider.setAll(Object.assign({init: Date.now()}, this.defaultSettings));
      return true;

    } else {

      let changes = changesets.diff(this.settingsProvider.getAll(),this.defaultSettings);
      log.info(changes);
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
      log.info("changed :", change.key);

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
          log.info("changed add:", change.key);

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