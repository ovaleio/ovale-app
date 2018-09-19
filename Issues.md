# Vérifications à effectuer en cas de bug du build

En cas d'issue, rappelez vous cette liste de trucs qui peuvent casser un build (dans l'ordre):
- [ ] Electron version.
- [ ] Electron builder version.
- [ ] Webpack (vous voulez évidemment un bundle de votre app qui soit indépendant et simple (pas de nextjs)).
- [ ] Babel (vous voulez coder en Javascript moderne)
- [ ] Dépendances natives et signatures de ces dépendances natives.
- [ ] Xcode tools, macOS changes et outils qu'electron peut changer en amont.
- [ ] Certificats (expirations, etc)