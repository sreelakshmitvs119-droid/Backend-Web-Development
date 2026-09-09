```js
const postsRepo = require('./../repository/postsRepo');
const commentsRepo = require('./../repository/commentsRepo');
const AppError = require('./../utils/AppError');

/**
 * TODO (Multi-step workflow): add a comment to a post.
 *
 * Ordered sequence:
 * 1. The post must exist
 *    -> AppError('Post not found', 404)
 *
 * 2. The post must not be locked
 *    -> AppError('Post is locked for new comments', 409)
 *
 * 3. THEN insert the comment
 *    -> commentsRepo.insert({ postId, authorId: userId, body })
 *
 * 4. THEN bump the post's comment count
 *    -> postsRepo.incrementCommentCount(postId)
 *
 * 5. Return the created comment.
 *
 * No write may happen before both checks pass.
 */

exports.addComment = async (postId, userId, body) => {
  // Check 1: Make sure the post exists
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check 2: Make sure the post is not locked
  if (post.locked) {
    throw new AppError('Post is locked for new comments', 409);
  }

  // Write 1: Insert the comment
  const comment = await commentsRepo.insert({
    postId,
    authorId: userId,
    body
  });

  // Write 2: Increment the post's comment count
  await postsRepo.incrementCommentCount(postId);

  // Return the newly created comment
  return comment;
};
```

This version satisfies the required order:

**Find post → check not found → check locked → insert comment → increment count → return comment.**

There are **no writes before both checks pass**.
