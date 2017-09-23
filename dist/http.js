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
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new Promise(function (resolve, reject) {
              requestWorker.addEventListener('message', function (e) {
                if (res.type === 'success') {
                  var res = e.data;
                  (0, _debug2.default)('\'PUT\' request response status: ' + res.status);
                  (0, _debug2.default)('\'PUT\' request response headers: ' + JSON.stringify(res.headers));
                  (0, _debug2.default)('\'PUT\' request response body: ' + res.data);
                  resolve(res);
                } else {
                  (0, _debug2.default)('\'PUT\' error response status: ' + res.status);
                  (0, _debug2.default)('\'PUT\' error response headers: ' + JSON.stringify(res.headers));
                  (0, _debug2.default)('\'PUT\' error response body: ' + res.data);
                  reject(res);
                }
              }, false);

              requestWorker.postMessage(Object.extend({
                type: 'PUT',
                url: url,
                data: chunk
              }, options));
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function safePut(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requestWorker = new Worker('/media/scripts/workers/request-worker.js'); /* globals Worker */

// import axios from 'axios'