import Post from '../models/Post.js';
import Comment from "../models/Comments.js"

//CREAT
export const createPost = async (req, res) => {
  try {
    const { description, source } = req.body;
      const newPost = new Post({
      user: req.user.id,
      description,
      source: req?.file?.originalname ?? "not upload files"
    });
    newPost.populate("user","friends")
    await newPost.save();
    res.status(201).json({msg: "create post success",newPost});
  } catch (err) {
    res.status(409).json({ msg: err.message });
  }
};

//READ
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort("-updatedAt").populate("user", '-password').populate({
      path: 'comments',
      sort: "-updateAt",
      populate: { path: 'user', select: "firstName lastName picturePath" }
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await Post.find({ user: userId }).sort("-updatedAt").populate("user", '-password').populate({
      path: 'comments',
      sort: "-updateAt",
      populate: { path: 'user', select: "firstName lastName picturePath" }
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

// UPDATE
export const likePost = async (req, res) => {
  try {
    const post = await Post.find({

      _id: req.params.postId,
      likes: req.user.id,
    });
    if (post.length > 0) {
      return res.status(400).json({ msg: 'You have already liked this post' });
    }

    const Addlike = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      {
        $push: { likes: req.user.id },
      },
      {
        new: true,
      },
    );

    if (!Addlike) {
      return res.status(400).json({ msg: 'Post does not exist.' });
    }

    res.json({ msg: 'Post liked successfully.' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const unLikePost = async (req, res) => {
  try {
    const removeLike = await Post.findOneAndUpdate(
      { _id: req.params.postId},
      {
        $pull: { likes: req.user.id },
      },
      {
        new: true,
      },
    );

    if (!removeLike) {
      return res.status(400).json({ msg: 'Post does not exist.' });
    }

    res.json({ msg: 'Post unliked successfully.' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.postId,
      user: req.user.id,
    });

    await Comment.deleteMany({ _id: { $in: post.comments } });

    res.json({ 
      msg: "Post deleted successfully.",
      newPost: {
        ...post
      } 
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

