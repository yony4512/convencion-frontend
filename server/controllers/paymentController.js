const Payment = require('../models/Payment');
const Order = require('../models/Order');
const ActivityLog = require('../models/ActivityLog');

exports.createPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const payment = new Payment({
      orderId,
      userId: req.user.id,
      amount,
      method,
    });
    await payment.save();

    // Registrar en el historial de actividades
    const activity = new ActivityLog({
      userId: req.user.id,
      action: 'Realizó un pago',
      details: `Pago de S/. ${amount} para el pedido #${orderId} usando ${method}`,
    });
    await activity.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).populate('orderId');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const payments = await Payment.find().populate('orderId').populate('userId');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const { status, transactionId } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status, transactionId, updatedAt: new Date() },
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: 'Pago no encontrado' });

    // Registrar en el historial de actividades
    const activity = new ActivityLog({
      userId: req.user.id,
      action: 'Actualizó un pago',
      details: `Pago #${payment._id} cambió a estado: ${status}`,
    });
    await activity.save();

    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};