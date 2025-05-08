import React from 'react'
import Client from './components/Client'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faTimes, faTrash, faPlus, faSave } from '@fortawesome/free-solid-svg-icons'

// Initialize Font Awesome icons
library.add(faPencilAlt, faTimes, faTrash, faPlus, faSave)

function App() {

  return (
    <>
    <Client/>
    </>
    
  )
}

export default App
