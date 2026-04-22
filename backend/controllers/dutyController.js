const Duty = require('../models/Duty');

exports.createDuty = async (req, res, next) => {
  try {
    const duty = await Duty.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(duty.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.getDuties = async (req, res, next) => {
  try {
    const { status, officerId, airport, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (req.user.role === 'OFFICER') filter.officerId = req.user._id;
    if (status) filter.status = status;
    if (officerId && req.user.role === 'ADMIN') filter.officerId = officerId;
    if (airport) filter.airport = airport;
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = dateFrom;
      if (dateTo) filter.date.$lte = dateTo;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [duties, total] = await Promise.all([
      Duty.find(filter).sort({ date: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Duty.countDocuments(filter),
    ]);

    res.json({
      duties: duties.map(d => d.toJSON()),
      total,
      hasMore: skip + duties.length < total,
    });
  } catch (err) {
    next(err);
  }
};

exports.getDutyById = async (req, res, next) => {
  try {
    const duty = await Duty.findById(req.params.id);
    if (!duty) return res.status(404).json({ message: 'Duty not found' });

    if (req.user.role === 'OFFICER' && duty.officerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    res.json(duty.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.updateDutyStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['UPCOMING', 'COMPLETED', 'CANCELLED'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const duty = await Duty.findById(req.params.id);
    if (!duty) return res.status(404).json({ message: 'Duty not found' });

    if (req.user.role === 'OFFICER' && duty.officerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    duty.status = status;
    await duty.save();
    res.json(duty.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.deleteDuty = async (req, res, next) => {
  try {
    const duty = await Duty.findByIdAndDelete(req.params.id);
    if (!duty) return res.status(404).json({ message: 'Duty not found' });
    res.json({ message: 'Duty deleted successfully' });
  } catch (err) {
    next(err);
  }
};
