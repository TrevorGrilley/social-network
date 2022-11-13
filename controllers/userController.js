const { User, Thought } = require("../models");

module.exports = {

  getUser(req, res) {
    User.find({})
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  getAUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "Error there was no user found with this Id" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  createUser({ body }, res) {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
},

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "Error there was no user found with this Id" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "Error there was no user found with this Id" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "Thought and User has been successfully deleted" }))
      .catch((err) => res.status(500).json(err));
  },

  addFriend({ params, body}, res) {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: body } },
        { new: true }
    )
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'Error no user was found with that Id'});
            return;
        }
        User.findOneAndUpdate( { _id: params.friendId }, {$addToSet: {friends: params.userId } }, { new: true } )
        .then(friendData => {
            if(!friendData) {
                res.status(404).json({ message: 'Error no user was found with that Id'});
                return;
            }
            res.json(dbUserData);
                console.log('success')
            })
    })
    .catch(err => res.json(err));
},
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then(
        (user) =>
          !user
            ? res.status(404).json({ message: "Error there was no user found with this Id" })
            : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  }
};