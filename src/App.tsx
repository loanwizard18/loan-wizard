import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, Card, Typography } from "@material-tailwind/react";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Card className="mt-6 w-96">
      <Typography variant="h5" color="blue-gray" className="mb-2">
        Material Tailwind Card
      </Typography>
      <Typography>
        This is an example component combining Material Design with Tailwind CSS.
      </Typography>
      <Button color="blue" className="mt-4">
        Click Me
      </Button>
    </Card>
  )
}

export default App
