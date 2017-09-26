'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safePut = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// request.headers = {}
// debugger

var safePut = exports.safePut = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url, chunk, options) {
    var headers, toBuffer, buffer, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            toBuffer = function toBuffer(ab) {
              var buffer = new Buffer(ab.byteLength);
              var view = new Uint8Array(ab);
              for (var i = 0; i < buffer.length; ++i) {
                buffer[i] = view[i];
              }
              return buffer;
            };

            headers = options.headers;
            // console.log('BYTELENGTH: ', chunk.byteLength)
            // console.log('Buffer: ', chunk.buffer)
            // console.log('Size: ', chunk.size)
            // console.log('Chunk: ', chunk)

            buffer = void 0;


            if (chunk) {
              buffer = toBuffer(chunk);
            }

            // headers['Content-Length'] = buffer.byteLength
            // headers['Accept'] = 'application/json, text/plain, */*'

            // if (chunk) headers['Content-Length'] = chunk.byteLength
            // headers = {
            //   'Content-Range': 'bytes */*',
            //   // 'Content-Type': opts.contentType
            // }
            // var onUploadProgress = options.onUploadProgress
            (0, _debug2.default)('SAFEPUT URL / CHUNK: ', url, buffer && buffer.byteLength);
            (0, _debug2.default)('SAFEPUT HEADERS: ');
            (0, _debug2.default)(headers);
            _context.prev = 7;
            _context.next = 10;
            return new Promise(function (resolve, reject) {
              _needle2.default.put(url, buffer, { headers: headers }, function (err, res) {
                console.log('====ERROR: ', err, 'RES: ', res);
                if (err) return reject(err);
                resolve(res);
              });
              // .on('data', function (chunk) {
              //   if (onUploadProgress) onUploadProgress()
              // }).on('end', function () {
              //   if (onUploadEnd) onUploadEnd()
              // })
            });

          case 10:
            res = _context.sent;

            res.status = res.statusCode;
            (0, _debug2.default)('\'PUT\' request response status: ' + res.statusCode);
            (0, _debug2.default)('\'PUT\' request response headers: ' + JSON.stringify(res.headers));
            (0, _debug2.default)('\'PUT\' request response body: ' + res.body);
            return _context.abrupt('return', res);

          case 18:
            _context.prev = 18;
            _context.t0 = _context['catch'](7);

            _context.t0.status = _context.t0.statusCode || 500;
            console.log('ERROR Name: ', _context.t0);
            console.log('ERROR Name: ', _context.t0.name);
            console.log('ERROR statusCode: ', _context.t0.statusCode);
            console.log('ERROR Message: ', _context.t0.message);
            (0, _debug2.default)('\'PUT\' error response status: ' + _context.t0.status);
            (0, _debug2.default)('\'PUT\' error response headers: ' + JSON.stringify(_context.t0.headers));
            (0, _debug2.default)('\'PUT\' error response body: ' + _context.t0.body);
            return _context.abrupt('return', _context.t0);

          case 29:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[7, 18]]);
  }));

  return function safePut(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _bhttp = require('bhttp');

var _bhttp2 = _interopRequireDefault(_bhttp);

var _needle = require('needle');

var _needle2 = _interopRequireDefault(_needle);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { request } from 'popsicle'
var request = _needle2.default; // const request = require('request-promise-native')
// import * as request from 'request-promise-native'
// import request from 'request-promise-native'