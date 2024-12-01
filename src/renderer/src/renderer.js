let grid; // Grid.jsオブジェクト

function init() {
  window.addEventListener('DOMContentLoaded', () => {
    doAThing()
  })
}

function doAThing() {
  const versions = window.electron.process.versions
  replaceText('.electron-version', `Electron v${versions.electron}`)
  replaceText('.chrome-version', `Chromium v${versions.chrome}`)
  replaceText('.node-version', `Node v${versions.node}`)
  
  document.getElementById('ipcHandler')?.addEventListener('click', () => {ipcHandlerBtn_Click()})
  document.getElementById('insertBtn')?.addEventListener('click', () => insertBtn_Click())

  // テーブル作成　即時関数として呼出し
  // window.database.createTable().catch(err => {console.log(err)});
  window.electron.ipcRenderer.send('createTable')
  // 起動時にメモをgridに表示
  gridReload()
}

function replaceText(selector, text) {
  const element = document.querySelector(selector)
  if (element) {
    element.innerText = text
  }
}

function gridReload(){
  // メモをgridに表示
  //window.database.selectAll()
  window.electron.ipcRenderer.send('selectAll')
  .then(ret => {
    ret.forEach((elem) => { delete elem.id });  //キー:idを削除
    grid.updateConfig({
      data: ret
    }).forceRender();
  })
  .catch(err => { console.log(err) });
}

//////////////////////////
// Event Method
//////////////////////////

function insertBtn_Click(){
  // メモを書き込む
  const memoText = document.getElementById('memoInput').value;
  if (memoText) {
    // window.database.insertData(memoText).catch(err => {console.log(err)});
    window.electron.ipcRenderer.send('insertData', memoText)
    gridReload();
    document.getElementById('memoInput').value = "";
  }
}

function ipcHandlerBtn_Click(){
  window.electron.ipcRenderer.send('ping')
}

init()
