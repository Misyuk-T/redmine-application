const { app, BrowserWindow } = require("electron");
const path = require("path");

function removeAppAsarEnding(dirname) {
  const regex = /app\.asar$/;
  return dirname.replace(regex, "");
}

const server = require(path.join(
  removeAppAsarEnding(__dirname),
  "nodejs",
  "index.js"
));

server();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "react-app/build", "index.html"));
}

app.whenReady().then(createWindow);
