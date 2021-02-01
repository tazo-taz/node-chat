(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.createFileList = factory());
}(this, (function () { 'use strict';

  var getDataTransfer = function getDataTransfer() {
    return new DataTransfer();
  };

  var concat = Array.prototype.concat;

  try {
    getDataTransfer();
  } catch (_unused) {
    getDataTransfer = function getDataTransfer() {
      return new ClipboardEvent('').clipboardData;
    };
  }

  function createFileList() {
    // eslint-disable-next-line prefer-rest-params
    var files = concat.apply([], arguments);
    var i = 0;
    var length = files.length;
    var dataTransfer = getDataTransfer();

    for (; i < length; i++) {
      dataTransfer.items.add(files[i]);
    }

    return dataTransfer.files;
  }

  return createFileList;

})));
