const { app }  = require('electron');
const updater  = require('./autoUpdater.js');

const MenuTemplate = [{
  label: "Application",
  submenu: [
    { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
    { label: "Check for Updates ...", selector: "checkUpdates:", click() { updater.update(); }},
    { type: "separator" },
    { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
  ]}, {
  label: "Edit",
  submenu: [
    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
    { type: "separator" },
    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
  ]}
];
module.exports = MenuTemplate;