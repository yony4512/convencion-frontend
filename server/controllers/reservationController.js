const Reservation = require('../models/Reservation');
const ActivityLog = require('../models/ActivityLog');

exports.createReservation = async (req, res) => {
  try {
    const { date, time, people, notes } = req.body;
    const reservation = new Reservation({
      userId: req.user.id,
      date,
      time,
      people,
      notes,
    });
    await reservation.save();

    // Registrar en el historial de actividades
    const activity = new ActivityLog({
      userId: req.user.id,
      action: 'Hizo una reserva',
      details: `Reserva para ${people} personas el ${date} a las ${time}`,
    });
    await activity.save();

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });
    if (reservation.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const reservations = await Reservation.find().populate('userId');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });

    // Registrar en el historial de actividades
    const activity = new ActivityLog({
      userId: req.user.id,
      action: 'Actualizó una reserva',
      details: `Reserva #${reservation._id} cambió a estado: ${status}`,
    });
    await activity.save();

    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};