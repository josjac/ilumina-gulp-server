/*
 * configuracion:
 */
var gulp = require('gulp');

var path = require('path');

var https = require('https');

var fs = require('fs');

var connect = require('connect');

var serveStatic = require('serve-static');

var cwd = process.cwd();

var default_config = [
  { 
    url: '/static/scripts', 
    path: path.join(cwd, 'src', 'static', 'scripts')
  },
  { 
    url: '/static/libs', 
    path: path.join(cwd, 'src', 'static', 'libs')
  },
  { 
    url: '/static/typos', 
    path: path.join(cwd, 'src', 'static', 'typos')
  },
  { 
    url: '/static/images', 
    path: path.join(cwd, 'src', 'static', 'images')
  },
  { 
    url: '/', 
    path: path.join(cwd, 'dist')
  }
];

module.exports = function(configs) {
  configs = configs || default_config;

  gulp.task('server', function() {
    var port = config.yargs.port || 8000;
    var host = config.yargs.host || '0.0.0.0';
    var app = connect();

    configs.forEach(function(config) {
      app.use(
        config.url,
        serveStatic(
          path.resolve(config.path)
        )
      );
    });

    if (configs.yargs.https) {
      https.createServer({
        key: fs.readFileSync('ssl/dev-key.pem'),
        cert: fs.readFileSync('ssl/dev-cert.pem')
      }, app).listen(port, host);
    }
    else {
      app.listen(port, host);
    }
  });
};
