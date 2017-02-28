const request = require('supertest');
const view = require('../');
const should = require('should');
const Koa = require('koa');

describe('koa-view', function() {
  it('should render basic', function(done) {
    const app = new Koa();
    app.use(view(__dirname))
      .use(ctx => {
        return ctx.render('fixtures/basic', { html: 'html' });
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:html/)
      .expect(200, done);
  });

  it('should render default path view', function(done) {
    process.chdir('test');
    const app = new Koa();
    app.use(view())
      .use(ctx => {
        return ctx.render('basic', { html: 'html' });
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:html/)
      .expect(200, done);
  });

  it('should render ctx state', function(done) {
    const app = new Koa();
    app.use(view(__dirname))
      .use(ctx => {
        ctx.state = { html: 'html' };
        return ctx.render('fixtures/basic');
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:html/)
      .expect(200, done);
  });

  it('should render with tpl ext', function(done) {
    const app = new Koa();
    app.use(view(__dirname, {
        ext: 'tpl'
      }))
      .use(ctx => {
        return ctx.render('fixtures/tpl', { tpl: 'tpl' });
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:tpl/)
      .expect(200, done);
  });

  it('should render with filter', function(done) {
    const app = new Koa();
    app.use(view(__dirname, {
        filters: {
          shorten: function(str, count) {
            return str.slice(0, count || 5);
          }
        }
      }))
      .use(ctx => {
        return ctx.render('fixtures/filter', { msg: '1234567' });
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:12345/)
      .expect(200, done);
  });

  it('should render with global', function(done) {
    const app = new Koa();
    app.use(view(__dirname, {
        globals: {
          msg: function() { return '1234567890'; }
        }
      }))
      .use(ctx => {
        return ctx.render('fixtures/global');
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:1234567890/)
      .expect(200, done);
  });
});