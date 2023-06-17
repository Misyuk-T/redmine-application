const { app, BrowserWindow, ipcMain } = require("electron");
const electron = require("electron");
const path = require("path");
const Store = require("electron-store");
const server = require("./server");

const store = new Store();

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const apiKeys = store.get("apiKeys") || {};

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    electron.shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("apiKeys", apiKeys);
  });

  ipcMain.on("updateApiKeys", (event, updatedApiKeys) => {
    store.set("apiKeys", updatedApiKeys);
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

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  app.quit();
});

process.on("SIGTERM", () => {
  app.quit();
});
