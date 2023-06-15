const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");
const server = require("./server");
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

  // store.clear()

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
