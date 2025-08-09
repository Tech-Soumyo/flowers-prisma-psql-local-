import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'

import type { Flower } from '@prisma/client'
import { useToast } from '../hooks/use-toast'

interface InventoryTableProps {
  // We pass the current view to re-trigger the fetch when the user navigates back to this page
  activeView: 'form' | 'inventory'
}

function InventoryTable({ activeView }: InventoryTableProps): React.JSX.Element {
  const { toast } = useToast()
  const [inventory, setInventory] = useState<Flower[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only fetch if this view is active
    if (activeView === 'inventory') {
      const fetchInventory = async (): Promise<void> => {
        setIsLoading(true)

        // Bridge
        const result = await window.api.getInventory()
        if (result.success && result.data) {
          setInventory(result.data)
        } else {
          toast({
            variant: 'destructive',
            title: 'Failed to fetch inventory',
            description: result.error || 'An unknown error occurred.'
          })
        }
        setIsLoading(false)
      }

      fetchInventory()
    }
  }, [activeView, toast]) // Re-run effect when view changes to 'inventory'

  const total = inventory.reduce((sum, flower) => sum + flower.price, 0)

  if (isLoading) {
    return <p className="text-center">Loading inventory...</p>
  }

  if (inventory.length === 0) {
    return <p className="text-center">No flowers have been added yet.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Name</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Date Added</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.map((flower) => (
          <TableRow key={flower.id}>
            <TableCell className="font-medium">{flower.name}</TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                flower.price
              )}
            </TableCell>
            <TableCell className="text-right">
              {new Date(flower.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} className="font-bold">
            Total
          </TableCell>
          <TableCell className="text-right font-bold">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default InventoryTable
