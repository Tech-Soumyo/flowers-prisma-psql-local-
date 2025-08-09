import { Button } from '../ui/button'

export type View = 'form' | 'inventory'

interface NavProps {
  setView: (view: View) => void
}

function Nav({ setView }: NavProps): React.JSX.Element {
  return (
    <nav className="flex justify-center gap-4 mt-4">
      <Button variant="outline" onClick={() => setView('form')}>
        Add New Flowers
      </Button>
      <Button variant="outline" onClick={() => setView('inventory')}>
        View Inventory
      </Button>
    </nav>
  )
}

export default Nav
