# koa-view

[![NPM version](https://img.shields.io/npm/v/koa-view.svg)](https://www.npmjs.com/package/koa-view)
[![Dependency Status](https://david-dm.org/d-band/koa-view.svg)](https://david-dm.org/d-band/koa-view)
[![Build Status](https://travis-ci.org/d-band/koa-view.svg?branch=master)](https://travis-ci.org/d-band/koa-view)
[![Coverage Status](https://coveralls.io/repos/github/d-band/koa-view/badge.svg?branch=master)](https://coveralls.io/github/d-band/koa-view?branch=master)

Template rendering middleware for koa (using [nunjucks](https://github.com/mozilla/nunjucks)).

## Installation

```
$ npm install koa-view
```

## Example (koa 1.x)

```js
var views = require('koa-view');

// Must be used before any router is used
app.use(views(__dirname + '/views'));

app.use(function* (next) {
  this.state = {
    session: this.session,
    title: 'app'
  };

  yield this.render('user', {
    user: 'Coder'
  });
});
```

## Example (koa 2.x)

> Plz using [koa-convert](https://github.com/koajs/convert)

```js
import co from 'co';
import Koa from 'koa';
import view from 'koa-view';
import convert from 'koa-convert';

const app = new Koa();

app.use(convert(view()));

app.use(async (ctx, next) => {
  ctx.render = co.wrap(ctx.render);
  await next();
});

app.use(async (ctx, next) => {
  await ctx.render('index', {
    user: 'Coder'
  });
});

app.listen(3000);
```

More examples: [tests](./test/index.js) [examples](./examples)

## API

#### `views(root, opts)`

* `root`: (default `views`) Views location. All views you `render()` are relative to this path.
* `opts` [nunjucks configure opts](http://mozilla.github.io/nunjucks/api.html#configure)
* `opts.ext`: (default `html`) Extension for your views

```js
// instead of this
yield this.render('user.html')
// you can
yield this.render('user')
```

## License

MIT
