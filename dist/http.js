'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safePut = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var safePut = exports.safePut = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url, chunk, options) {
    var headers, buffer, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            headers = options.headers;
            buffer = null;


            if (chunk) {
              buffer = toBuffer(chunk);
            }

            (0, _debug2.default)('SAFEPUT HEADERS: ');
            (0, _debug2.default)(headers);
            _context.prev = 5;
            _context.next = 8;
            return new Promise(function (resolve, reject) {
              var req = request.put(url, buffer, { headers: headers }, function (err, res) {
                if (err) return reject(err);
                resolve(res);
              });

              var totalUploaded = 0;
              req.on('data', function (chunk) {
                if (options.onUploadProgress) options.onUploadProgress({ loaded: totalUploaded += chunk.length });
              });
            });

          case 8:
            res = _context.sent;

            res.status = res.statusCode;
            (0, _debug2.default)('\'PUT\' request response status: ' + res.statusCode);
            (0, _debug2.default)('\'PUT\' request response headers: ' + JSON.stringify(res.headers));
            (0, _debug2.default)('\'PUT\' request response body: ' + res.body);
            return _context.abrupt('return', res);

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](5);

            _context.t0.status = _context.t0.statusCode;
            (0, _debug2.default)('\'PUT\' error response status: ' + _context.t0.status);
            (0, _debug2.default)('\'PUT\' error response headers: ' + JSON.stringify(_context.t0.headers));
            (0, _debug2.default)('\'PUT\' error response body: ' + _context.t0.body);
            return _context.abrupt('return', _context.t0);

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[5, 16]]);
  }));

  return function safePut(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _needle = require('needle');

var _needle2 = _interopRequireDefault(_needle);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = _needle2.default;

function toBuffer(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}