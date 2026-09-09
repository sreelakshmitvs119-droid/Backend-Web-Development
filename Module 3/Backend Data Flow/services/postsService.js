```js
const repo = require('./../repository/postsRepo');
const AppError = require('./../utils/AppError');

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000; // A post may only be edited within 24h

exports.getAll = async () => repo.findAll();

exports.create = async ({ authorId, title, body }) => {
  return repo.insert({
    authorId,
    title,
    body
  });
};

/**
 * TODO (Domain rule): edit a post.
 *
 * Implement these guards IN ORDER, each throwing an AppError,
 * before any write:
 *
 * 1. The post must exist
 *    -> AppError('Post not found', 404)
 *
 * 2. Only the author may edit it
 *    -> AppError('You can only edit your own post', 403)
 *
 * 3. It must be within the edit window
 *    -> AppError('Post can no longer be edited', 403)
 *    -> (now - post.createdAt must be <= EDIT_WINDOW_MS)
 *
 * Only when all guards pass:
 * return repo.update(postId, changes).
 */

exports.editPost = async (postId, userId, changes) => {
  // Guard 1: Check that the post exists
  const post = await repo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Guard 2: Check that the user is the author
  if (post.authorId !== userId) {
    throw new AppError('You can only edit your own post', 403);
  }

  // Guard 3: Check that the post is within the 24-hour edit window
  const ageMs = Date.now() - post.createdAt;

  if (ageMs > EDIT_WINDOW_MS) {
    throw new AppError('Post can no longer be edited', 403);
  }

  // All guards passed, so the update is allowed
  return repo.update(postId, changes);
};
```

### The important fixes

* `*exports*` → `exports`
* `*authorId*`, `*title*`, `*body*` → normal variable names
* `*postId*`, `*userId*`, `*changes*` → normal variable names
* `*Date*.now()` → `Date.now()`
* `EDIT\_WINDOW\_MS` → `EDIT_WINDOW_MS`
* `24 \* 60 \* 60 \* 1000` → `24 * 60 * 60 * 1000`
* `\/\*\*`-style escaped comments → normal `/** ... */`

The **guard order is also correct**: existence → author → 24-hour window → update.
