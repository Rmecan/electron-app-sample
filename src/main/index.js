import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// main.jsはNode.jsにて動作する requireにてelectronモジュールを読み込んでいる
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database("./database.db");

// gridjs
import { Grid } from "gridjs";
import "../../node_modules/gridjs/dist/theme/mermaid.css";

// ウィンドウの作成準備
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // スタートページ
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    // デベロッパーツールを開く　不要ならコメントアウト
    // win.webContents.openDevTools();
    // メニューバーの非表示
    win.setMenuBarVisibility(false);
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// ウィンドウ初期化時
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ///////////////////////////////
  // IPC(プロセス間通信)
  ///////////////////////////////
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.on('createTable', () => createTable());
  ipcMain.on('selectAll', () => selectAll());
  ipcMain.on('insertData', (memoText) => insertData(memoText));

  ///////////////////////////////
  // レンダラー経由のイベント発火
  ///////////////////////////////
  // // テーブル作成　第2引数asyncでうまく戻り値拾えず。ちゃんとnew Promiseで記述しています。
  // ipcMain.handle('createTable', (eve) => {
  //   console.log('create');
  //   createTable()
  // });
  // // SELECT文でデータ取得
  // ipcMain.handle('selectAll', (eve) => {
  //   console.log('select');
  //   selectAll()
  // });
  // // データ挿入
  // ipcMain.handle('insertData', (eve, memoText) => {
  //   console.log('insert');
  //   insertData(memoText)
  // });

  // ウィンドウの表示
  createWindow()

  // macOS用
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// ウィンドウのクローズ
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
function createTable () {
  let sql = 'CREATE TABLE IF NOT EXISTS my_memo ([id] integer primary key autoincrement, [memo] text, [date_time] datetime default CURRENT_TIMESTAMP);'
  new Promise((resolve, reject) => {
    console.log(sql)
    db.run(sql, err => {
      if (err) reject(err);
      resolve();
    });
  });
}

function selectAll () {
  let sql = 'SELECT * FROM my_memo;'
  new Promise((resolev, reject) => {
    console.log(sql)
    db.serialize(() => {
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        resolev(rows);
      });
    });
  });
}

function insertData (memoText) {
  let sql = `INSERT INTO my_memo (memo) VALUES ('${memoText}');`
  new Promise((resolev, reject) => {
    console.log(sql)
    db.run(sql, err => {
      if (err) reject(err);
      resolev();
    });
  });
}