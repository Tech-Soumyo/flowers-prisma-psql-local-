// import electronLogo from './assets/electron.svg'
// import { Button } from './components/ui/button'
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious
// } from './components/ui/carousel'
// import { Card, CardContent } from './components/ui/card'

import { useState } from 'react'
import Nav, { View } from './components/custom/Nav'
import { Toaster } from './components/ui/toaster'
import AddFlowersPage from './pages/AddFlowersPage'
import InventoryPage from './pages/InventoryPage'

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [view, setView] = useState<View>('form')

  return (
    <>
      <div className="container relative py-8">
        <h1 className="text-2xl font-bold tracking-tight text-center">Flower Inventory</h1>

        <Nav setView={setView} />

        <main className="mt-6">
          {/* We will add the page components here in the next step */}
          {view === 'form' && <AddFlowersPage />}
          {view === 'inventory' && <InventoryPage activeView={view} />}
        </main>

        <Toaster />
      </div>
    </>
  )
}

export default App
