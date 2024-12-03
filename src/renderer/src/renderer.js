//////////////////////////
// 共通関数
//////////////////////////
function init() {
  window.addEventListener('DOMContentLoaded', () => {
    doAThing();
  })
}

function doAThing() {
  const versions = window.electron.process.versions;
  replaceText('.electron-version', `Electron v${versions.electron}`);
  replaceText('.chrome-version', `Chromium v${versions.chrome}`);
  replaceText('.node-version', `Node v${versions.node}`);
  
  // イベントの設定
  document.getElementById('initButton')?.addEventListener('click', () => initButton_Click());
  document.getElementById('searchButton')?.addEventListener('click', () => searchButton_Click());

  // テーブル作成　即時関数として呼出し
  window.electron.ipcRenderer.send('createTable');
}

function replaceText(selector, text) {
  const element = document.querySelector(selector);
  if (element) {
    element.innerText = text;
  }
}

//////////////////////////
// イベント関数
//////////////////////////
async function initButton_Click(){
  try {
    await window.logger.logging('[start] initButton_Click');
    await window.electron.ipcRenderer.send('createTable');
    await window.logger.logging('[ end ] initButton_Click');
  } catch (err) {
    await window.logger.logging('[abend] initButton_Click', err);
  }
}

async function searchButton_Click(){
  try {
    const searchTerm = document.getElementById('searchInput').value;
    await window.logger.logging('[start] searchButton_Click', `検索ワード=${searchTerm}`);
    // 検索処理実行
    const results = await window.database.searchData(searchTerm);
    // ユーザー一覧を表示する処理
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';  // 以前の結果をクリア
    if (results.length > 0) {
      results.forEach(row => {
        const div = document.createElement('div');
        div.textContent = `ID: ${row.id}, 名前: ${row.name}`;
        resultsContainer.appendChild(div);
      });
    } else {
      resultsContainer.textContent = '検索結果がありません。';
    }
    await window.logger.logging('[ end ] searchButton_Click');
  } catch (err) {
    await window.logger.logging('[abend] searchButton_Click', err);
  }
}

// 画面初回起動
init();
