```js
const postsRepo = require('./../repository/postsRepo');
const votesRepo = require('./../repository/votesRepo');
const AppError = require('./../utils/AppError');

/**
 * TODO (Domain rule): cast a vote, one per user per post.
 *
 * Implement these guards before writing:
 *
 * 1. The post must exist
 *    -> AppError('Post not found', 404)
 *
 * 2. The user must not have voted already
 *    -> AppError('You have already voted on this post', 409)
 *
 * Only when both pass:
 * return votesRepo.insert(postId, userId).
 */

// votesService.js

exports.castVote = async (postId, userId) => {
  // Guard 1: Check that the post exists
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Guard 2: Check that the user has not already voted
  const existing = await votesRepo.find(postId, userId);

  if (existing) {
    throw new AppError(
      'You have already voted on this post',
      409
    );
  }

  // Both guards passed, so the vote can be inserted
  return votesRepo.insert(postId, userId);
};

exports.countFor = async (postId) => {
  return votesRepo.countByPost(postId);
};
```

The required order is preserved:

**Check post exists → check existing vote → insert vote.**

So, just like the previous files, there are **no writes until all guards have passed**.
