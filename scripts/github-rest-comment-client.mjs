// GitHub REST client for the injected comment adapter. Requires an explicit
// token and owner/repo; never prints or persists credentials.
export function createGitHubRestCommentClient({token, owner, repo, actor, fetchImpl = globalThis.fetch}) {
  for (const [name,value] of Object.entries({token,owner,repo,actor})) {
    if (typeof value !== 'string' || !value.trim()) throw new Error('Missing GitHub client setting: ' + name);
  }
  if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) throw new Error('Invalid repository identity');
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function');
  const root = 'https://api.github.com/repos/' + owner + '/' + repo;
  async function request(method, path, body) {
    const response = await fetchImpl(root + path, {
      method,
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(body === undefined ? {} : {'Content-Type':'application/json'}),
      },
      ...(body === undefined ? {} : {body:JSON.stringify(body)}),
    });
    if (!response || typeof response.ok !== 'boolean') throw new Error('Invalid GitHub response');
    if (!response.ok) {
      const err = new Error('GitHub API request failed: HTTP ' + response.status);
      err.status = response.status;
      throw err;
    }
    return response.json();
  }
  const issueNumber = target => {
    if (!target || !Number.isSafeInteger(target.number) || target.number < 1 || !['issue','pr'].includes(target.kind)) throw new Error('Invalid GitHub target');
    return target.number;
  };
  return {
    async listComments(target, {page = 1, perPage = 100} = {}) {
      const number = issueNumber(target);
      if (!Number.isSafeInteger(page) || page < 1 || perPage !== 100) throw new Error('Invalid pagination');
      const result = await request('GET','/issues/' + number + '/comments?per_page=100&page=' + page);
      if (!Array.isArray(result)) throw new Error('Invalid GitHub comments payload');
      return result.map(item => ({id:item.id,body:item.body,owned:item.user?.login === actor}));
    },
    async createComment(target, body) {
      const result = await request('POST','/issues/' + issueNumber(target) + '/comments',{body});
      return {id:result.id,body:result.body};
    },
    async updateComment(target, id, body) {
      issueNumber(target);
      if (!Number.isSafeInteger(id) || id < 1) throw new Error('Invalid comment id');
      const result = await request('PATCH','/issues/comments/' + id,{body});
      return {id:result.id,body:result.body};
    },
  };
}
