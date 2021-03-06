const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const shell = require('electron').shell;

var child = require('child_process').execFile;
var executablePath = 'bdfconv.exe';
var parameters = [
  '-f',
  '1',
  '-m',
  '32-255',
  '-n',
  'fontname',
  '-o',
  'font.c',
  'font.bdf'
];

// child(executablePath, parameters, function(err, data) {
//   console.log(err);
//   console.log(data.toString());
// });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    //Removing frame of the window
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),

      //Enabling nodejs integration
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('./src/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  var menu = Menu.buildFromTemplate([
    {
      label: 'Main menu',
      submenu: [
        {
          label: 'Open bdf font'
        },
        {
          label: 'Close current bdf file'
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Info',
      submenu: [
        {
          label: 'About',
          click() {
            const modelPath = path.join('file://', __dirname, 'src/about.html');
            let win = new BrowserWindow({
              width: 300,
              height: 500
            });
            win.on('close', function() {
              win = null;
            });
            win.loadURL(modelPath);
            win.show();
          }
        },
        {
          label: 'U8g2 Page',
          click() {
            shell.openExternal('http://e-labinnovations.web.app');
          }
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
