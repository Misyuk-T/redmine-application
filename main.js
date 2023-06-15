const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");

const store = new Store();

let mainWindow;

const removeAppAsarEnding = (dirname) => {
  const regex = /app\.asar$/;
  return dirname.replace(regex, "");
};

const server = require(path.join(
  removeAppAsarEnding(__dirname),
  "nodejs",
  "index.js"
));

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  const apiKeys = store.get("apiKeys") || {};

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("apiKeys", apiKeys);
  });

  // Receive updated API keys from the renderer process
  ipcMain.on("updateApiKeys", (event, updatedApiKeys) => {
    // Update the persistent storage with the updated API keys
    store.set("apiKeys", updatedApiKeys);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadFile(path.join(__dirname, "react-app/build", "index.html"));
};

server();

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
