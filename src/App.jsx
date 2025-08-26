import { useState } from 'react'
import JournalArea from './components/JournalArea'
import MenuBar from './components/MenuBar'
import TableOfContents from './components/TableOfContents'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app-container">
        <MenuBar></MenuBar>
        <JournalArea></JournalArea>
        <TableOfContents></TableOfContents>
      </div>
    </>
  )
}

export default App
