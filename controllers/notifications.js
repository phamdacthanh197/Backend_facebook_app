import Notification from '../models/Notification.js';

export const notifyCtrl = {
  createNotify: async (req, res) => {
    try {
      const { recipients, url, text,id, content } = req.body;

      const notify = new Notification({
        id,
        user: req.user.id,
        url: url,
        text: text,
        recipients: recipients,
        content
      });
      await notify.populate({path: "user", select: "firstName lastName picturePath"})
      await notify.save();
      return res.json({msg: 'create notify success', notify });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllNotifies: async (req, res) => {
    try {
      const notifies = await Notification.find({recipients: req.user.id}).sort('-createdAt').populate('user');
      return res.json({ notifies });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  removeNotify: async (req, res) => {
    const { id } = req.params
    try {
      const notify = await Notification.findOneAndDelete({
        id: id,
      });
      return res.status(204).json({ msg: ' delete success', notify });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  isReadNotify: async (req, res) => {
    const {notifyId} = req.params
    try {
      const notifies = await Notification.findOneAndUpdate(
        { _id: notifyId },
        {
          isRead: true,
        },
        {new: true}
      );

      return res.json({ notifies });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteAllUserNotifies: async (req, res) => {
    const { userId } = req.user.id
    try {
      const notifies = await Notification.deleteMany({ recipients: userId });

      return res.json({ notifies });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
