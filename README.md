# koa-view

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
    user: 'John'
  });
});
```

## Example (koa 2.x)

> Plz using [koa-convert](https://github.com/koajs/convert)

```js
app.use(convert(views(__dirname)))

app.use(async (ctx, next) => {
  ctx.render = co.wrap(ctx.render)
  await next()
})

app.use(async (ctx, next) => {
  yield this.render('./user')
})
```

More examples: [tests](./test/index.js)

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
