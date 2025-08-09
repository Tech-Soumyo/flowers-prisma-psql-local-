import { Flower } from '@prisma/client'
import prisma from './prisma'

export async function saveFlowers(
  _: Electron.IpcMainInvokeEvent,
  flowers: Flower[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Basic validation
    if (!Array.isArray(flowers) || flowers.length === 0) {
      throw new Error('Invalid data. Expected an array of flowers.')
    }

    const dataToSave = flowers.map((flower) => {
      if (!flower.name || typeof flower.price !== 'number') {
        throw new Error('Each flower must have a name and a numeric price.')
      }
      return { name: flower.name, price: flower.price }
    })

    await prisma.flower.createMany({
      data: dataToSave
    })

    console.log(`Successfully saved ${dataToSave.length} flowers.`)
    return { success: true }
  } catch (error) {
    console.error('Error saving flowers:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { success: false, error: errorMessage }
  }
}

export async function getInventory(): Promise<{
  success: boolean
  data?: Flower[]
  error?: string
}> {
  try {
    const inventory = await prisma.flower.findMany()
    return { success: true, data: inventory }
  } catch (error) {
    console.error('Error fetching inventory:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { success: false, error: errorMessage }
  }
}
