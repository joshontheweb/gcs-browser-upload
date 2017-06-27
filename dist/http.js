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
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var res,
        _args = arguments;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _axios2.default.put.apply(null, _args);

          case 3:
            res = _context.sent;

            (0, _debug2.default)('\'PUT\' request response status: ' + res.status);
            (0, _debug2.default)('\'PUT\' request response headers: ' + JSON.stringify(res.headers));
            (0, _debug2.default)('\'PUT\' request response body: ' + res.data);
            return _context.abrupt('return', res);

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](0);

            // if (e instanceof Error) {
            //   console.log(e.response.status, e.response.statusText, e.response.headers)
            //   throw e
            // } else {
            // console.log(e.response.status, e.response.statusText, e.response.headers)
            (0, _debug2.default)('\'PUT\' error response status: ' + _context.t0.response.status);
            (0, _debug2.default)('\'PUT\' error response headers: ' + JSON.stringify(_context.t0.response.headers));
            (0, _debug2.default)('\'PUT\' error response body: ' + _context.t0.response.data);
            return _context.abrupt('return', _context.t0.response);

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 10]]);
  }));

  return function safePut() {
    return _ref.apply(this, arguments);
  };
}();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// axios.create({
//   maxRedirects: 0
// })

_axios2.default.defaults.maxRedirects = 0;