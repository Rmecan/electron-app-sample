import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}

// レンダラーからNode.jsにアクセスするためのAPI登録
contextBridge.exposeInMainWorld('database', {
  searchData: (searchTerm) => ipcRenderer.invoke('search-data', searchTerm)
});
contextBridge.exposeInMainWorld('logger', {
  logging: (message, err) => ipcRenderer.invoke('logging', message, err)
});