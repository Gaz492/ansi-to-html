'use strict';
/* eslint no-console:0 */

var help = "\nusage: ansi-to-html [options] [file]\n\nfile:  The file to display or stdin\n\noptions:\n\n    -f, --fg         The background color used for resets (#000)\n    -b, --bg         The foreground color used for resets (#FFF)\n    -n, --newline    Convert newline characters to <br/>  (false)\n    -x, --escapeXML  Generate XML entities                (false)\n    -v, --version    Print version\n    -h, --help       Print help\n";
var args = {
  stream: true
};
var file = null,
    skip = false;
var argv = process.argv.slice(2);

for (var i = 0, len = argv.length; i < len; ++i) {
  if (skip) {
    skip = false;
    continue;
  }

  switch (argv[i]) {
    case '-n':
    case '--newline':
      args.newline = true;
      break;

    case '-x':
    case '--escapeXML':
      args.escapeXML = true;
      break;

    case '-f':
    case '--fg':
      args.fg = argv[i + 1];
      skip = true;
      break;

    case '-b':
    case '--bg':
      args.bg = argv[i + 1];
      skip = true;
      break;

    case '-v':
    case '--version':
      console.log(require(__dirname + '/../package.json').version);
      process.exit(0); // istanbul ignore next

      break;

    case '-h':
    case '--help':
      console.log(help);
      process.exit(0); // istanbul ignore next

      break;

    default:
      file = argv[i];
  }
}

var convert = new (require('./ansi_to_html.js'))(args);

var htmlStream = function htmlStream(stream) {
  return stream.on('data', function (chunk) {
    return process.stdout.write(convert.toHtml(chunk));
  });
};

if (file) {
  var stream = require('fs').createReadStream(file, {
    encoding: 'utf8'
  });

  htmlStream(stream);
} else {
  process.stdin.setEncoding('utf8');
  htmlStream(process.stdin);
}
//# sourceMappingURL=cli.js.map