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

    const render = nunjucks.render;
    // Render `view` with `locals` and `koa.ctx.state`.
    ctx.render = (view, locals) => {
      const state = Object.assign({}, ctx.state, locals);

      return new Promise((res, rej) => {
        render(view + ext, state, (err, html) => {
          if (err) return rej(err);
          // Render with response content-type, fallback to text/html
          ctx.type = ctx.type || 'text/html';
          ctx.body = html;
          res();
        });
      });
    };

    return next();
  };
};
