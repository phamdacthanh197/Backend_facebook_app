import Comment from '../models/Comments.js';
import Post from '../models/Post.js';

export const commentCtrl = {
  getCommentById: async (req, res) => {
    const { commentId } = req.params
    console.log(commentId)
    try {
      const newComment = await Comment.find({_id: commentId}).populate({
        path: "reply",
        sort: "-updateAt",
        populate: {
          path: "user",
          select: "firstName lastName picturePath "
        }
      })
      res.status(200).json({ msg: "get reply of comment success", newComment})
    } catch (error) {
      res.status(500).json({msg: error.message})
    }
  },
  getPostComment: async (req, res) => {
    try {
      const postId = req.params.postId
      const newComment = await Comment.find({postId: postId}).sort("-updateAt").populate({
        path: "reply",
        populate: {
          path: "user",
          sort: "-updateAt",
          select: "firstName lastName picturePath"
        }
      })
      res.status(200).json({msg: "find comment of post success", newComment})
    } catch (error) {
      res.status(500).json({msg: error.message})
    }
  } ,

  createComment: async (req, res) => {
    try {
      const { postId, description, reply } = req.body;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(400).json({ msg: ' Post dose not exits' });
      }
      if (reply) {
        const conmment = await Comment.findById(reply);
        const newComment = new Comment({
          user: req.user.id,
          description,
        });
        conmment.reply.push(newComment._id);
        newComment.populate("user", "firstName lastName picturePath")
        await newComment.save();
        await conmment.save();
        return res.status(201).json({msg: 'reply comment success', newComment });
      }

      const newComment = new Comment({
        user: req.user.id,
        description,
        postId,
      });

      await Post.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        },
        { new: true },
      );
      await newComment.save()
      await newComment.populate("user")
      res.json({msg: "create comment success", newComment });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateComment: async (req, res) => {
    try {
      const { description } = req.body;
      const {commentId} = req.params

      const newComment = await Comment.findOneAndUpdate({ _id: commentId }, { description }, { new: true}).populate("user", "firstName lastName picturePath");
      // if(!newComment) {
      //   res.status(404).json({ msg: "bad request"}) 
      // }
      res.json({ msg: 'updated successfully.', newComment });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  likeComment: async (req, res) => {
    try {
      const comment = await Comment.find({
        _id: req.params.commentId,
        likes: req.user.id,
      });
      if (comment.length > 0) {
        return res.status(400).json({ msg: 'You have already liked this post' });
      }

      await Comment.findOneAndUpdate(
        { _id: req.params.commentId },
        {
          $push: { likes: req.user.id },
        },
        {
          new: true,
        },
      );

      res.json({ msg: 'Comment liked successfully.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unLikeComment: async (req, res) => {
    try {
      await Comment.findOneAndUpdate(
        { _id: req.params.commentId },
        {
          $pull: { likes: req.user.id },
        },
        {
          new: true,
        },
      );

      res.json({ msg: 'Comment unliked successfully.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.commentId,
      });

      await Post.findOneAndUpdate(
        { _id: comment.postId },
        {
          $pull: { comments: req.params.commentId },
        },
      );
      res.json({ msg: 'Comment deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.commentId,
      });

      await Post.findOneAndUpdate(
        { _id: comment.postId },
        {
          $pull: { comments: req.params.commentId },
        },
      );
      res.json({ msg: 'Comment deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteReplyOfComment: async (req, res) => {
    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
      });

      await Comment.findOneAndUpdate(
        { _id: req.params.commentId },
        {
          $pull: { reply: req.params.id },
        },
      );
      res.json({ msg: 'Comment deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
