import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import './index.css';
import { Button, Card, Typography } from "@material-tailwind/react";
import { SimpleRegistrationForm } from './components/Form';

function App() {
  const [count, setCount] = useState(0)

  return (
    
    <SimpleRegistrationForm />
  
  )
}

export default App
