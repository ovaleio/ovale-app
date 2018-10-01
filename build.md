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


## Signature de l'app

La signature de l'application permet de profiter des fonctionnalités d'updates.

### Ajouter la configuration de la signature pour OSX

Les variables globales à définir permettent à electron de trouver les ressources en local pour pouvoir signer l'application

```
export DEBUG=electron-builder
export CSC_LINK=~/Downloads/certificatApplication.p12
export CSC_KEY_PASSWORD=password
```
### Tester la signature de l'app
Pour tester la signature sous mac : 
```
 codesign -dv --verbose=4 dist/mac/Ovale.app/Contents/MacOS/Ovale
 ```
 
 
## Générer un bundle

### Bundle sans mise en production

```
npm run dist
npm run osx
# no signature
npm run osx:nosign

```

### Bundle avec mise en production

Pour mettre en production, les bundle sont uploadés en releases sur github (la version disponible sur ``latest`` est vérifiée et mise à l'épreuve avec la dernière version).
N'oubliez pas de : modifier la version dans package.json

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

