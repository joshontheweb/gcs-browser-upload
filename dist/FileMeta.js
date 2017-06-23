'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STORAGE_KEY = '__gcsBrowserUpload';

var FileMeta = function () {
  function FileMeta(id, fileSize, chunkSize, storage) {
    (0, _classCallCheck3.default)(this, FileMeta);

    this.id = id;
    this.fileSize = fileSize;
    this.chunkSize = chunkSize;
    this.storage = storage;
  }

  (0, _createClass3.default)(FileMeta, [{
    key: 'getMeta',
    value: function getMeta() {
      var meta = this.storage.getItem(STORAGE_KEY + '.' + this.id);
      if (meta) {
        return JSON.parse(meta);
      } else {
        return {
          checksums: [],
          chunkSize: this.chunkSize,
          started: false,
          fileSize: this.fileSize
        };
      }
    }
  }, {
    key: 'setMeta',
    value: function setMeta(meta) {
      var key = STORAGE_KEY + '.' + this.id;
      if (meta) {
        this.storage.setItem(key, (0, _stringify2.default)(meta));
      } else {
        this.storage.removeItem(key);
      }
    }
  }, {
    key: 'isResumable',
    value: function isResumable() {
      var meta = this.getMeta();
      return meta.started && this.chunkSize === meta.chunkSize;
    }
  }, {
    key: 'getResumeIndex',
    value: function getResumeIndex() {
      return this.getMeta().checksums.length;
    }
  }, {
    key: 'getFileSize',
    value: function getFileSize() {
      return this.getMeta().fileSize;
    }
  }, {
    key: 'addChecksum',
    value: function addChecksum(index, checksum) {
      var meta = this.getMeta();
      meta.checksums[index] = checksum;
      meta.started = true;
      this.setMeta(meta);
    }
  }, {
    key: 'getChecksum',
    value: function getChecksum(index) {
      return this.getMeta().checksums[index];
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.setMeta(null);
    }
  }]);
  return FileMeta;
}();

exports.default = FileMeta;