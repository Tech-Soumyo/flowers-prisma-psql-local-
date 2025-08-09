import { ElectronAPI } from '@electron-toolkit/preload'
import { Flower } from '@prisma/client'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveFlowers: (
        flowers: Pick<Flower, 'name' | 'price'>[]
      ) => Promise<{ success: boolean; error?: string }>
      getInventory: () => Promise<{
        success: boolean
        data?: Flower[]
        error?: string
      }>
    }
  }
}
