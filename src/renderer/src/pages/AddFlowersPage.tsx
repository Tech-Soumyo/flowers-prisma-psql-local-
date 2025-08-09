import FlowerForm from '../components/custom/FlowerForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

function AddFlowersPage(): React.JSX.Element {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Flowers</CardTitle>
        <CardDescription>
          Enter the name and selling price for each flower. Click "Add More" for extra rows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FlowerForm />
      </CardContent>
    </Card>
  )
}

export default AddFlowersPage
