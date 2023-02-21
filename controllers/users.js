import User from "../models/User.js";

//READ
export const getUserDetail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({ path: "friends", select: "-password" });
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({msg: err.message})
    }
}

export const getFriendDetail = async (req, res) => {
    try {
        const friend = await User.findById(req.params.friendId)
        res.status(200).json(friend);
    } catch (err) {
        res.status(404).json({msg: err.message})
    }
};

//UPDATE
export const addRemoveFriend = async (req, res ) => {
    try {
        const { friendId } = req.params;
        const userId = req.user.id
        const user = await User.findById(userId);
        const friend  = await User.findById(friendId);

        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id != friendId);
            friend.friends = friend.friends.filter((id) => id != userId);
        } else {
            user.friends.push(friendId);
            friend.friends.push(userId);
        }
        await user.save();
        await friend.save();

        res.status(200).json({ msg: 'toggle add and remove friend success', user})
    } catch (err) {
        res.status(404).json({msg: err.message})
    }
}
