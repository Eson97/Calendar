const { response } = require("express")
const Event = require("../models/Event")


const getEvents = async (req, res = response) => {

    const eventos = await Event.find().populate('user', 'name');

    res.json({
        ok: true,
        eventos
    })
}

const createEvent = async (req, res = response) => {

    const evento = new Event(req.body);

    try {
        evento.user = req.uid;

        const eventoGuardado = await evento.save();
        return res.json({
            ok: true,
            evento: eventoGuardado
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const updateEvent = async (req, res = response) => {

    const eventoID = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Event.findById(eventoID);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese id'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Event.findByIdAndUpdate(eventoID, newEvent, { new: true });

        return res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const deleteEvent = async (req, res = response) => {
    const eventoID = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Event.findById(eventoID);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un evento con ese id'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento'
            });
        }

        await Event.findByIdAndDelete(eventoID);

        return res.json({ ok: true })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}