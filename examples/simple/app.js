var koa = require('koa');
var view = require('koa-view');

var app = koa();

app.use(view());
app.use(function*() {
  yield this.render('index', {
    user: 'Coder'
  });
});

app.listen(3000);