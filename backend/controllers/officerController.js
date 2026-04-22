const User = require('../models/User');

exports.getOfficers = async (req, res, next) => {
  try {
    const officers = await User.find({ role: 'OFFICER' }).sort({ name: 1 });
    res.json(officers.map(o => o.toJSON()));
  } catch (err) {
    next(err);
  }
};

exports.addOfficer = async (req, res, next) => {
  try {
    const { name, email, phone, employeeId } = req.body;
    const username = employeeId.toLowerCase();
    const password = phone.slice(-4);

    const officer = await User.create({ name, email, phone, employeeId, username, password, role: 'OFFICER' });
    res.status(201).json(officer.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.updateOfficer = async (req, res, next) => {
  try {
    const { name, email, phone, employeeId } = req.body;
    const officer = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, employeeId },
      { new: true, runValidators: true }
    );
    if (!officer) return res.status(404).json({ message: 'Officer not found' });
    res.json(officer.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.toggleAccess = async (req, res, next) => {
  try {
    const { isEnabled } = req.body;
    const officer = await User.findByIdAndUpdate(
      req.params.id,
      { isEnabled },
      { new: true }
    );
    if (!officer) return res.status(404).json({ message: 'Officer not found' });
    res.json(officer.toJSON());
  } catch (err) {
    next(err);
  }
};
