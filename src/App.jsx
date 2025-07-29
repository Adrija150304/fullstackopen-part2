import { useEffect, useState } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      const updatedPerson = { ...existingPerson, number: newNumber }

      if (window.confirm(`${existingPerson.name} is already added to the phonebook, replace the old number with a new one?`)) {
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNotification({ text: `Updated ${returnedPerson.name}`, type: 'success' })
            setTimeout(() => setNotification(null), 5000)
          })
          .catch(error => {
            setNotification({ text: `Information of ${existingPerson.name} has already been removed from the server`, type: 'error' })
            setTimeout(() => setNotification(null), 5000)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    }

    const newPerson = { name: newName, number: newNumber }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotification({ text: `Added ${returnedPerson.name}`, type: 'success' })
        setTimeout(() => setNotification(null), 5000)
        setNewName('')
        setNewNumber('')
      })
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNotification({ text: `Deleted ${person.name}`, type: 'success' })
          setTimeout(() => setNotification(null), 5000)
        })
        .catch(error => {
          setNotification({ text: `Information of ${person.name} was already removed from the server`, type: 'error' })
          setTimeout(() => setNotification(null), 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => setSearchTerm(event.target.value)

  const personsToShow = persons.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification?.text} type={notification?.type} />

      <div>
        filter shown with{' '}
        <input value={searchTerm} onChange={handleSearchChange} />
      </div>

      <h3>Add a new</h3>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Numbers</h3>
      {personsToShow.map(person => (
        <p key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </p>
      ))}
    </div>
  )
}

export default App
