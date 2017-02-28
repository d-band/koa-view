'use strict';

const resolve = require('path').resolve;
const nunjucks = require('nunjucks');

/**
 * See: http://mozilla.github.io/nunjucks/api.html#configure
 * @param  {[type]} path nunjucks configure path
 * @param  {[type]} opts nunjucks configure opts
 * @return {[type]}      [description]
 */
module.exports = (path, opts) => {
  path = resolve(path || 'views');
  opts = opts || {};
  const ext = '.' + (opts.ext || 'html');
  const env = nunjucks.configure(path, opts);

  let filters = opts.filters || {};
  for (let f in filters) {
    env.addFilter(f, filters[f]);
  }

  let globals = opts.globals || {};
  for (let g in globals) {
    env.addGlobal(g, globals[g]);
  }

  return function* view(next) {
    if (this.render) return yield next;

    var render = nunjucks.render;

    // Render `view` with `locals` and `koa.ctx.state`.
    Object.assign(this, {
      render: function*(view, locals) {
        let state = Object.assign({}, this.state, locals);

        this.type = 'text/html';
        this.body = yield render.bind(null, view + ext, state);
      }
    });

    yield next;
  };
};