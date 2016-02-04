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