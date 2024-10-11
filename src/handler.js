const { nanoid } = require("nanoid")
const notes = require("./notes")

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload 
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    }

    notes.push(newNote)

    const isSusccess = notes.filter((note) => note.id === id).length > 0

    if (isSusccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201)
        return response
    }

    const response = h.response({
        status: 'error',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500)
    return response;
}

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    }
})

const getDetailNotesById = (request, h) => {
    const { id } = request.params
    const note = notes.filter((n) => n.id === id)[0]

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            }
        }
    }

    const response = h.response({
        status: 'error',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404)
    return response
}

const editNotesByIdHandler = (request, h) => {
    const { id } = request.params
    const { title, tags, body} = request.payload
    const updatedAt = new Date().toISOString()

    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex !== -1) {
        notes[noteIndex] = {
            ...notes[noteIndex],
            title,
            tags,
            body,
            updatedAt,
        }
        
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui'
        });
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'error',
        message: 'Gagal memperbarui catatan, Id tidak ditemukan',
    });
    response.code(404)
    return response
}

const deleteNotesById = (request, h) => {
    const { id } = request.params

    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1)
        
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus'
        });
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'error',
        message: 'Gagal menghapus catatan, Id tidak ditemukan',
    });
    response.code(404)
    return response
}

module.exports = { addNoteHandler, getAllNotesHandler, getDetailNotesById, editNotesByIdHandler, deleteNotesById }