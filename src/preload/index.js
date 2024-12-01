import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

// レンダラーからNode.jsにアクセスするためのファイル
// contextBridge.exposeInMainWorld('database', {
//   createTable: async () => ipcRenderer.invoke('createTable'),
//   selectAll: async () => ipcRenderer.invoke('selectAll'),
//   insertData: async (memoText) => ipcRenderer.invoke('insertData', memoText),
// });
