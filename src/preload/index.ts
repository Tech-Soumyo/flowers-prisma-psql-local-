import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Flower } from '@prisma/client'

// Custom APIs for renderer
const api = {
  saveFlowers: (
    flowers: Pick<Flower, 'name' | 'price'>[]
  ): Promise<{ success: boolean; error?: string }> => ipcRenderer.invoke('db:saveFlowers', flowers),
  getInventory: (): Promise<{
    success: boolean
    data?: Flower[]
    error?: string
  }> => ipcRenderer.invoke('db:getInventory')
}

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
