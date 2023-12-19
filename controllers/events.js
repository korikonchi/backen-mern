const { response } = require("express");
const Evento = require("../models/Evento");

const getEventos = async (req, res = response) => {
  const eventos = await Evento.find().populate("user", "name"); //* populate all information of user foreign key "fields"

  res.json({
    ok: true,
    eventos,
  });
};

const crearEvento = async (req, res = response) => {
  const evento = new Evento(req.body); //* create a instance of  class EVENTO

  try {
    evento.user = req.uid; //* add link user foreign key USER

    const eventoGuardado = await evento.save();

    res.json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const uid = req.uid; //* from token user
  const { idevent } = req.query;

  try {
    const evento = await Evento.findById(idevent);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });
    }

    if (evento.user.toString() !== uid) {
      //* validates that the user token is equal to user created event.
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de editar este evento",
      });
    }

    const nuevoEvento = {
      ...evento.toString(),
      ...req.body,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(
      idevent,
      nuevoEvento,
      { new: true }
    );

    res.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de eliminar este evento",
      });
    }

    await Evento.findByIdAndDelete(eventoId);

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
