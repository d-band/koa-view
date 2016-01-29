var request = require('supertest');
var views = require('../');
var should = require('should');
var koa = require('koa');

describe('koa-views', function() {
  it('should render basic', function(done) {
    var app = koa()
      .use(views(__dirname))
      .use(function*() {
        yield this.render('./fixtures/basic', { html: 'html' });
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:html/)
      .expect(200, done);
  });

  it('should render ctx state', function(done) {
    var app = koa()
      .use(views(__dirname))
      .use(function*() {
        this.state = { html: 'html' };
        yield this.render('./fixtures/basic');
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:html/)
      .expect(200, done);
  });

  it('should render with tpl ext', function(done) {
    var app = koa()
      .use(views(__dirname, {
        ext: 'tpl'
      }))
      .use(function*() {
        yield this.render('./fixtures/tpl', { tpl: 'tpl' });
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:tpl/)
      .expect(200, done);
  });

  it('should render with filter', function(done) {
    var app = koa()
      .use(views(__dirname, {
        filters: {
          shorten: function(str, count) {
            return str.slice(0, count || 5);
          }
        }
      }))
      .use(function*() {
        yield this.render('./fixtures/filter', { msg: '1234567' });
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:12345/)
      .expect(200, done);
  });

  it('should render with global', function(done) {
    var app = koa()
      .use(views(__dirname, {
        globals: {
          msg: function() { return '1234567890'; }
        }
      }))
      .use(function*() {
        yield this.render('./fixtures/global');
      });

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:1234567890/)
      .expect(200, done);
  });
});