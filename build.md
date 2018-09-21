# HOW TO BUILD AND DEPLOY

To build an electron package

## Dev

Comportement attendu : 

```
npm start
```

Lance ``electron .`` qui check dans ``package.json`` l'entrée ``  "main": "main/index.js"``` et renvoie un bundle.

## Prod


Afin de signer correctement l'application, il faut installer Xcode et récupérer les fichiers ``.p12`` correspondant aux
clés privées des certificats Developer ID : Installer & Developer ID : Application



### Ajouter la configuration de la signature pour OSX

```
export DEBUG=electron-builder
export CSC_LINK=~/Downloads/certificat.p12
export CSC_KEY_PASSWORD=password
```


### Bundle sans mise en production

```
npm run dist

```

### Bundle avec mise en production

Pour mettre en production, les bundle sont uploadés en releases sur github (la version disponible sur ``latest`` est vérifiée et mise à l'épreuve avec la dernière version).

```
export DEBUG=electron-builder
export GH_TOKEN={api github}
export CSC_LINK=~/Downloads/certificat.p12
export CSC_KEY_PASSWORD=password
npm run publish

```
Nettoyage

```
rm -rf node_modules/
rm -rf dist
rm -rf ~/Library/Caches/electron
rm -rf ~/Library/Caches/electron-builder
rm -rf ~/Library/Saved\ Application\ State/com.github.electron.savedState
npm install
```
## Cas spécifiques des updates

See https://www.electron.build/auto-update 



## Bugs de builds

`` A timestamp was expected but was not found.`` : bug de réseau, relancer le build

