const customTitlebar = require('custom-electron-titlebar');
const { Menu } = require('electron');

let MyTitleBar = new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex('#191919'),
  shadow: true,
  icon: '../assets/images/U8g2.png'
});

MyTitleBar.updateTitle('About U8G2 Fonter');

var menu = Menu.buildFromTemplate([{}]);

Menu.setApplicationMenu(menu);
