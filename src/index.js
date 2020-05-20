const { 
  app, 
  powerSaveBlocker, 
  Menu, 
  Tray, 
  BrowserWindow 
} = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// const createWindow = () => {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//   });

//   // and load the index.html of the app.
//   mainWindow.loadFile(path.join(__dirname, 'index.html'));

//   // Open the DevTools.
//   mainWindow.webContents.openDevTools();
// };

const preventSleep = 'prevent-display-sleep';
let tray = null;
let id   = null;

function createTray(){
  const iconPath = path.join(__dirname, 'stay_up_late_icon.png');

  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "On",
      type: "radio",
      checked: false,
      click: () => {
        console.log("Clicked the on button");
        
        id = powerSaveBlocker.start(preventSleep);
        
        console.log("Power save blocker is started: ", powerSaveBlocker.isStarted(id));
      }
    },
    {
      label: "Off",
      type: "radio",
      checked: true,
      click: () => {
        console.log("Clicked the off button");

        if(id !== null && powerSaveBlocker.isStarted(id)){
          powerSaveBlocker.stop(id);
        }
        
        console.log("Power save blocker is started: ", powerSaveBlocker.isStarted(id));
      }
    }
  ]);

  tray.setToolTip("Stay up late");
  tray.setContextMenu(contextMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createTray);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // Turn off the power save blocker
  if(id !== null){
    powerSaveBlocker.stop(id);
  }

  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
