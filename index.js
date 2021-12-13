require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')

app.use(cors())
app.use(express.json())


app.get('/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})
app.get('/api/notes/:id', (request, response) => {
    const { id } = request.params
    Note.findById(id).then(note =>{
        if (note) {
            return response.json(note)
        } else {
            response.status(404).end()
        }
    })
})
app.post('/api/notes', (request, response) => {
    const note = request.body
    if (!note.content) {
        return response.status(400).json({
            error: 'required "content" field is missing'
        })
    }
    const newNote = new Note({
        content: note.content,
        date: new Date(),
        important: note.important || false
    })

    newNote.save().then(savedNote => {
        response.json(savedNote)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})