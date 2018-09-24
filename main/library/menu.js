const { app }  = require('electron');
const openAboutWindow = require('about-window').default;
const join = require('path').join;


const MenuTemplate = [{
  label: "Application",
  submenu: [
    { label: "About Application", click: ()=> { openAboutWindow(
            {
                icon_path: join(__dirname, '../assets/icons/png/128x128.png'),
                copyright: 'Copyright (c) 2018-2021 ',
                homepage: 'https://ovale.io',
                package_json_dir: __dirname,
                open_devtools: process.env.NODE_ENV !== 'production',
                use_version_info: false

        })
        }
    },
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