require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')

app.use(cors())
app.use(express.json())

let notes = []

const generateId = () => {
    const notesIds = notes.map(n => n.id)
    const maxId = notesIds.length ? Math.max(...notesIds) : 0
    const newId = maxId + 1
    return newId
}

app.get('/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    
    if (note) {
        return response.json(note)
    } else {
        response.status(404).end()
    }
})
app.post('/api/notes', (request, response) => {
    const note = request.body
    if (!note.content) {
        return response.status(400).json({
            error: 'required "content" field is missing'
        })
    }
    const newNote = {
        id: generateId(),
        content: note.content,
        date: new Date(),
        import: note.important || false
    }
    notes = notes.concat(newNote)
    response.json(note)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})