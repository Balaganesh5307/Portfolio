import express from 'express';
import Visit from '../models/Visit.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// All analytics routes are admin-only

// @desc    Overview stats
// @route   GET /api/admin/analytics/overview
router.get('/overview', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalVisits, todayVisits, uniqueIps, topCountryResult] = await Promise.all([
      Visit.countDocuments(),
      Visit.countDocuments({ createdAt: { $gte: today } }),
      Visit.distinct('ip'),
      Visit.aggregate([
        { $match: { country: { $ne: 'Unknown' } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ])
    ]);

    res.json({
      totalVisits,
      todayVisits,
      uniqueVisitors: uniqueIps.length,
      topCountry: topCountryResult[0]?._id || 'N/A'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Visits by country
// @route   GET /api/admin/analytics/countries
router.get('/countries', adminAuth, async (req, res) => {
  try {
    const data = await Visit.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.json(data.map(d => ({ name: d._id, value: d.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Visits by device type
// @route   GET /api/admin/analytics/devices
router.get('/devices', adminAuth, async (req, res) => {
  try {
    const data = await Visit.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(data.map(d => ({ name: d._id, value: d.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Visits by browser
// @route   GET /api/admin/analytics/browsers
router.get('/browsers', adminAuth, async (req, res) => {
  try {
    const data = await Visit.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(data.map(d => ({ name: d._id, value: d.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Top referral sources
// @route   GET /api/admin/analytics/referrals
router.get('/referrals', adminAuth, async (req, res) => {
  try {
    const data = await Visit.aggregate([
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(data.map(d => ({ source: d._id, visits: d.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Most viewed projects
// @route   GET /api/admin/analytics/projects
router.get('/projects', adminAuth, async (req, res) => {
  try {
    const data = await Visit.aggregate([
      { $match: { page: { $regex: /^\/api\/projects/ } } },
      { $group: { _id: '$page', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);
    res.json(data.map(d => ({ page: d._id, views: d.views })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Visits timeline (last 30 days)
// @route   GET /api/admin/analytics/timeline
router.get('/timeline', adminAuth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await Visit.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          visits: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data.map(d => ({ date: d._id, visits: d.visits })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
