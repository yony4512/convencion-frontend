const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const notification = new Notification({ userId, type, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' });
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};