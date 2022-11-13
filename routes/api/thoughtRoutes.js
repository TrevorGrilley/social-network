const router = require('express').Router();

const {
    getThought,
    getAThought,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    updateReaction,
    deleteReaction
} = require('../../controllers/thoughtController');


router.route('/').get(getThought).post(createThought);

router.route('/:thoughtId')
    .get(getAThought)
    .put(updateThought)
    .delete(deleteThought);

router.route('/:thoughtId/reactions')
    .post(createReaction)
    .put(updateReaction);

router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

module.exports = router;