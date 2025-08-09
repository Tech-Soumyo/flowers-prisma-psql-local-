import { useState } from 'react'
import { PlusCircle, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

import { useToast } from '../hooks/use-toast'
import { FlowerInput } from '@renderer/types'

function FlowerForm(): React.JSX.Element {
  const { toast } = useToast()
  const [flowers, setFlowers] = useState<FlowerInput[]>([
    { id: crypto.randomUUID(), name: '', price: '' },
    { id: crypto.randomUUID(), name: '', price: '' }
  ])

  const addRow = (): void => {
    setFlowers([...flowers, { id: crypto.randomUUID(), name: '', price: '' }])
  }

  const removeRow = (id: string): void => {
    setFlowers(flowers.filter((flower) => flower.id !== id))
  }

  const handleInputChange = (id: string, field: 'name' | 'price', value: string): void => {
    setFlowers(
      flowers.map((flower) => {
        if (flower.id === id) {
          if (field === 'price') {
            const price = parseFloat(value)
            return { ...flower, price: isNaN(price) ? '' : price }
          }
          return { ...flower, [field]: value }
        }
        return flower
      })
    )
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    const flowersToSave = flowers
      .map((f) => ({ ...f, price: Number(f.price) }))
      .filter((f) => f.name.trim() !== '' && f.price > 0)

    if (flowersToSave.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill out at least one flower with a valid name and price.'
      })
      return
    }

    // Bridge
    const result = await window.api.saveFlowers(flowersToSave)

    if (result.success) {
      toast({
        title: 'Success!',
        description: `Successfully saved ${flowersToSave.length} flowers.`
      })
      // Reset form
      setFlowers([
        { id: crypto.randomUUID(), name: '', price: '' },
        { id: crypto.randomUUID(), name: '', price: '' }
      ])
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Saving Data',
        description: result.error || 'An unknown error occurred.'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {flowers.map((flower, index) => (
        <div key={flower.id} className="flex items-center gap-2">
          <Input
            placeholder={`Flower Name #${index + 1}`}
            value={flower.name}
            onChange={(e) => handleInputChange(flower.id, 'name', e.target.value)}
            className="text-blue-700"
          />
          <Input
            type="number"
            placeholder="Selling Price"
            value={flower.price}
            onChange={(e) => handleInputChange(flower.id, 'price', e.target.value)}
            step="0.01"
            className="text-blue-700"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(flower.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={addRow}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add More
        </Button>
        <Button type="submit">Submit to Inventory</Button>
      </div>
    </form>
  )
}

export default FlowerForm
