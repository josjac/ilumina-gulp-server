/*
 * configuracion:
 */
var gulp = require('gulp');

var path = require('path');

var https = require('https');

var fs = require('fs');

var connect = require('connect');

var serveStatic = require('serve-static');

var yargs = require('yargs').argv;

var cwd = process.cwd();

var default_config = {
  src: [
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
  ],
  port: yargs.port || 8000,
  host: yargs.host || '0.0.0.0',
  https: yargs.https || false
};

module.exports = function(configs) {
  configs = configs || default_config;

  gulp.task('server', function() {
    var port = configs.port || 8000;
    var host = configs.host || '0.0.0.0';
    var app = connect();

    configs.src.forEach(function(config, b) {
      app.use(
        config.url,
        serveStatic(
          path.resolve(config.path)
        )
      );
    });

    if (configs.https) {
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

