const Koa = require('koa');
const view = require('koa-view');

const app = new Koa();

app.use(view());
app.use(async function (ctx) {
  await ctx.render('index', {
    user: 'Coder'
  });
});

app.listen(3000);