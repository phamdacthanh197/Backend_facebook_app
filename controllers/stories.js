import Story from '../models/Story.js';

export const storiesCtrl = {
  createStory: async (req, res) => {
    try {
      const { description, background } = req.body;
      const newStory = new Story({
        user: req.user.id,
        description: description,
        source: req?.file?.originalname ?? "",
        background: background 
      });
      newStory.populate("user", "friends")
      await newStory.save();
      // const story = await Story.find().populate("user","-password")
      res.status(201).json({msg: "create a story success", newStory});
    } catch (err) {
      res.status(409).json({ msg: err.message });
    }
  },

  getAllStory: async (req, res) => {
    try {
      const story = await Story.find().sort("-updatedAt").populate("user", "picturePath firstName lastName");
      res.status(200).json(story);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  getUserStories: async (req, res) => {
    const userId = req.user.id
    try {
      const story = await Story.find({user: userId});
      res.status(200).json(story);
    } catch (err) {
      res.status(404).json({ msg: err.message });
    }
  },
};
