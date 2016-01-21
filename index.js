var gulp = require('gulp');

var path = require('path');

var https = require('https');

var fs = require('fs');

var connect = require('connect');

var serveStatic = require('serve-static');

var yargs = require('yargs').argv;

var _ = require('lodash');

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

var self = {
  config: default_config,
  set: function(config) {
    this.config = _.assign(this.config, config);
  },
  run: function(config) {
    server(config || this.config);
  }
};

function server(config) {
  var port = config.port || 8000;
  var host = config.host || '0.0.0.0';
  var app = connect();

  config.src.forEach(function(config, b) {
    app.use(
      config.url,
      serveStatic(
        path.resolve(config.path)
      )
    );
  });

  if (config.https) {
    https.createServer({
      key: fs.readFileSync('ssl/dev-key.pem'),
      cert: fs.readFileSync('ssl/dev-cert.pem')
    }, app).listen(port, host);
  }
  else {
    app.listen(port, host);
  }
}

gulp.task('server', function() {
  self.run();
});

module.exports = self;
