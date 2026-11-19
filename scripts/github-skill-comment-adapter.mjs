// GitHub comment adapter. The injected client is a narrow interface:
// listComments(target), createComment(target, body), updateComment(target, id, body).
// No credentials are read here; the caller supplies an authenticated client.
// This adapter supports issue and PR conversation comments, not review threads.
const marker = key => '<!-- quirk-skill-output:' + Buffer.from(key, 'utf8').toString('base64url') + ' -->';
const parseTarget = target => {
  const match = /^(issue|pr):([1-9]\d*)$/.exec(target);
  if (!match) throw new Error('Expected issue:<number> or pr:<number>');
  return {kind: match[1], number: Number(match[2])};
};
export function createGitHubCommentAdapter(client, { maxPages = 20 } = {}) {
  if (!client || !['listComments', 'createComment', 'updateComment'].every(name => typeof client[name] === 'function')) throw new TypeError('GitHub comment client is incomplete');
  if (!Number.isSafeInteger(maxPages) || maxPages < 1) throw new Error('Invalid maxPages');
  const commentBody = (body, key) => body + '\n\n' + marker(key);
  return {
    async findByKey(target, key) {
      const issue = parseTarget(target);
      if (typeof key !== 'string' || !key.trim()) throw new Error('Invalid idempotency key');
      const expected = marker(key);
      let found = null;
      for (let page = 1; page <= maxPages; page++) {
        const comments = await client.listComments(issue, {page, perPage:100});
        if (!Array.isArray(comments)) throw new Error('Invalid GitHub comments response');
        const matches = comments.filter(comment => typeof comment?.body === 'string' && comment.body.endsWith(expected));
        if (matches.some(comment => comment.owned !== true)) throw new Error('Idempotency marker collision with a foreign comment');
        if (matches.length > 1 || (matches.length === 1 && found)) throw new Error('Duplicate owned idempotency markers');
        if (matches.length === 1) found = matches[0];
        if (comments.length < 100) return found ? {id:found.id,body:found.body.slice(0,-('\n\n'+expected).length)} : null;
      }
      // Never create if an existing marker might be beyond the pagination cap.
      throw new Error('Comment search incomplete; refusing unsafe publication');
    },
    async create(target, body, key) {
      const issue = parseTarget(target);
      return client.createComment(issue, commentBody(body, key));
    },
    async update(target, id, body, key) {
      const issue = parseTarget(target);
      // The existing marker is recovered from the remote comment by the caller's
      // authenticated client, so updates must preserve it.
      return client.updateComment(issue, id, commentBody(body, key));
    },
  };
}
