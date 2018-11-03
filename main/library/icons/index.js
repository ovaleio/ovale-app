const {is} = require('electron-util');
const path = require('path');


const windows   = path.join(__dirname, '../assets/icons/win/icon.ico');
const osx       = path.join(__dirname, '../assets/icons/mac/icon.icns');
const linux     = path.join(__dirname, '../assets/icons/png/246x256.png');

console.log(is)
const icon = {
    getIcon: () =>{
        if(is.macos) {
            return osx;
        } else if(is.windows){
            return windows;
        } else {
            return linux;
        }
    } 

}

module.exports = icon