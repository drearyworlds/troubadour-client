import { app, BrowserWindow, remote } from 'electron'
import * as path from 'path'
import * as url from 'url'

let win: BrowserWindow

app.on('ready', () => {
  createWindow()
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    darkTheme: true,
    autoHideMenuBar: false,
    fullscreen: true,
    maximizable: true
  });

  console.log(`__dirname: ${__dirname}`)

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/troubadour-client/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  )

  win.webContents.setZoomFactor(2);
  win.maximize();

  win.on('closed', () => {
    win = null
  })
}