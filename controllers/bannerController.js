import { Admin } from '../models/schema.js';

export const getAllBanners = async (req, res) => {
  try {
    const admin = await Admin.findOne();

    res.json(admin?.banner || '');
  } catch (err) {
    console.error('Banner fetch error:', err);
    res.status(500).json({ message: err.message });
  }
};