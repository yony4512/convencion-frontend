const Testimonial = require('../models/Testimonial');
const ActivityLog = require('../models/ActivityLog');

exports.createTestimonial = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const testimonial = new Testimonial({
      userId: req.user.id,
      content,
      rating,
    });
    await testimonial.save();

    // Registrar en el historial de actividades
    const activity = new ActivityLog({
      userId: req.user.id,
      action: 'Creó un testimonio',
      details: `Testimonio con calificación ${rating}/5`,
    });
    await activity.save();

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).populate('userId', 'name');
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingTestimonials = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const testimonials = await Testimonial.find({ approved: false }).populate('userId', 'name');
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveTestimonial = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { approved: true, updatedAt: new Date() },
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ error: 'Testimonio no encontrado' });

    // Registrar en el historial de actividades
    const activity = new ActivityLog({
      userId: req.user.id,
      action: 'Aprobó un testimonio',
      details: `Testimonio #${testimonial._id}`,
    });
    await activity.save();

    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};