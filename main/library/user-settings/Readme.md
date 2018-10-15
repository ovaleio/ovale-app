## Index adapter 🌋

Updateable settings

``` 

const settingsClass        = require('./library/settings/index.js');
const settingsProvider  = require('electron-settings');

const Index = new settingsClass(settingsProvider);


```
 Classe pour pouvoir conserver la flexibilité du provider de settings (pas sûr de conserver electron-settings)
On pourra étendre et hériter 