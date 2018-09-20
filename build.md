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
export GH_TOKEN={api github}
npm run publish

```

## Cas spécifiques des updates

See https://www.electron.build/auto-update 


