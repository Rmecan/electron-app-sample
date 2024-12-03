import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// sqlite3
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
      logging('データベース接続エラー:', err.message);
  } else {
      logging('データベース接続成功');
  }
});

///////////////////////////////
// ログ出力
///////////////////////////////
function logging(message, addInfo) {
  db.run('CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY, log_date DATETIME DEFAULT CURRENT_TIMESTAMP, message TEXT, addinfo TEXT)');
  db.run('INSERT INTO logs (log_date, message, addinfo) VALUES (DATETIME(\'now\', \'localtime\'), ?, ?)', [message, addInfo]);
}
ipcMain.handle('logging', (event, message, err) => logging(message, err));

///////////////////////////////
// DB操作
///////////////////////////////
ipcMain.on('createTable', () => {
  try {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)');
    // データが存在したらデータを削除
    db.get('SELECT COUNT(1) AS count FROM users', (err, row) => {
      if (err) {
        // なにもしない
      } else if (row.count > 0) {
        db.run('DELETE FROM users');
      }
    });
    // データの挿入
    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    stmt.run('Alice', 'alice@example.com');
    stmt.run('Bob', 'bob@example.com');
    stmt.finalize();
  } catch (error) {
    logging('データベース初期化失敗', error.message);
  }
});

// レンダラープロセスからデータ取得リクエストを受け取る
ipcMain.handle('search-data', (event, searchTerm) => {
  // 検索クエリ
  let query = 'SELECT * FROM users WHERE 1 = 1 ';
  if (searchTerm) {
    query += ' AND name LIKE ? ';
    return new Promise((resolve, reject) => {
      db.all(query, [`%${searchTerm}%`], (err, rows) => {
          if (err) {
              reject(err);
          } else {
              resolve(rows);
          }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      db.all(query, (err, rows) => {
          if (err) {
              reject(err);
          } else {
              resolve(rows);
          }
      });
    });
  }
});

///////////////////////////////
// おまじない
///////////////////////////////
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
    mainWindow.show();
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    // スタートページ
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
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
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  })

  // ウィンドウの表示
  createWindow()

  // macOS用
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// ウィンドウのクローズ
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.