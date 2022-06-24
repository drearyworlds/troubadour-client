import { app, BrowserWindow } from 'electron'
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

function loadSongListUrl() {
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/troubadour-client/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  )
}

function createWindow() {
  win = new BrowserWindow({
    //width: 800,
    //height: 600,
    frame: true,
    darkTheme: true,
    autoHideMenuBar: false,
    fullscreen: true,
    maximizable: true
  });

  console.log(`__dirname: ${__dirname}`)

  loadSongListUrl();
  win.webContents.on('did-fail-load', () => loadSongListUrl());

  win.on('closed', () => {
    win = null
  })

  //win.webContents.setZoomFactor(2);
  //win.maximize();
}