import Conversation from '../models/Conversations.js';
import Messenger from '../models/Messengers.js';

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export const messageCtrl = {
  createMessage: async (req, res) => {
    try {
      const { recipient, text } = req.body;
      const sender = req.user.id;
      if (!recipient || !text.trim() === 0) return res.status(404).json({ msg: 'not found' });

      const newConversation = await Conversation.findOneAndUpdate(
        {
          $or: [{ recipients: [sender, recipient] }, { recipients: [recipient, sender] }],
        },
        {
          recipients: [sender, recipient],
          text,
        },
        { new: true, upsert: true },
      );

      const newMessage = new Messenger({
        conversation: newConversation._id,
        sender,
        recipient,
        text,
      });
      newMessage.populate('sender', 'picturePath');
      newMessage.populate('recipient', 'picturePath');
      await newMessage.save();

      res.json({ msg: 'Created.', newMessage });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getConversations: async (req, res) => {
    const userId = req.user.id;
    try {
      const features = new APIfeatures(
        Conversation.find({
          recipients: userId,
        }),
        req.query,
      ).paginating();

      const conversations = await features.query.sort('-createAt').populate("recipients","-password")


      res.json({
        conversations,
        result: conversations.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getMessages: async (req, res) => {
    try {
      const features = new APIfeatures(
        Messenger.find({
          $or: [
            { sender: req.user.id, recipient: req.params.recipient },
            { sender: req.params.recipient, recipient: req.user.id },
          ],
        }),
        req.query,
      ).paginating();

      const messages = await features.query
        .sort('-createdAt')
        .populate([{
          path: "sender",
          select: "picturePath"
        },{
          path: "recipient",
          select: "picturePath"
        }])
      res.json({
        messages,
        result: messages.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getLatestMessage: async (req, res) => {
    try {
      const latestMessage = await Messenger.findOne({ sender: { $ne: req.user.id } }, {}, { sort: { createdAt: -1 } })
        .limit(10)
        res.status(200).json({msg: "get data success", latestMessage})
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
