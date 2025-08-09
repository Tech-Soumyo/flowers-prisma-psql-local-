import InventoryTable from '../components/custom/InventoryTable'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

interface InventoryPageProps {
  activeView: 'form' | 'inventory'
}

function InventoryPage({ activeView }: InventoryPageProps): React.JSX.Element {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Current Inventory</CardTitle>
        <CardDescription>
          Here is a list of all flowers currently in your inventory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InventoryTable activeView={activeView} />
      </CardContent>
    </Card>
  )
}

export default InventoryPage
