'use strict';

const resolvePath = require('path').resolve;
const nunjucks = require('nunjucks');

/**
 * See: http://mozilla.github.io/nunjucks/api.html#configure
 * @param  {string} path nunjucks configure path
 * @param  {object} opts nunjucks configure opts
 * @return {function} koa middleware function
 */
module.exports = (path, opts) => {
  path = resolvePath(path || 'views');
  opts = opts || {};
  const ext = '.' + (opts.ext || 'html');
  const env = nunjucks.configure(path, opts);

  const filters = opts.filters || {};
  const globals = opts.globals || {};

  Object.keys(filters).forEach(k => {
    env.addFilter(k, filters[k]);
  });
  Object.keys(globals).forEach(k => {
    env.addGlobal(k, globals[k]);
  });

  return function view(ctx, next) {
    if (ctx.render) return next();

    // Render `view` with `locals` and `koa.ctx.state`.
    ctx.render = (view, locals) => {
      const state = Object.assign({}, ctx.state, locals);

      return new Promise((resolve, reject) => {
        env.render(view + ext, state, (err, html) => {
          if (err) return reject(err);
          // Render with response content-type, fallback to text/html
          ctx.type = ctx.type || 'text/html';
          ctx.body = html;
          resolve();
        });
      });
    };

    return next();
  };
};
