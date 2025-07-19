const Order = require('../models/Order');
const ActivityLog = require('../models/ActivityLog');

exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    const order = new Order({
      userId: req.user.id,
      items,
      total,
    });
    await order.save();

    // Registrar en el historial de actividades
    const activity = new ActivityLog({
      userId: req.user.id,
      action: 'Creó un pedido',
      details: `Pedido #${order._id} con un total de S/. ${total}`,
    });
    await activity.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const orders = await Order.find().populate('userId').populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

    // Registrar en el historial de actividades
    const activity = new ActivityLog({
      userId: req.user.id,
      action: 'Actualizó un pedido',
      details: `Pedido #${order._id} cambió a estado: ${status}`,
    });
    await activity.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};