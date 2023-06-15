const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");
const server = require("./index");
const electron = require("electron");

const store = new Store();

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "react-app/build", "index.html"));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    electron.shell.openExternal(url);
    return { action: 'deny' };
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});


server();

const apiKeys = store.get("apiKeys") || {};
mainWindow.webContents.on("did-finish-load", () => {
  mainWindow.webContents.send("apiKeys", apiKeys);
});

ipcMain.on("updateApiKeys", (event, updatedApiKeys) => {
  // Update the persistent storage with the updated API keys
  store.set("apiKeys", updatedApiKeys);
});
