/*!
 * dns.js - dns backend for bcoin
 * Copyright (c) 2014-2016, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

var dns = require('dns');
var socks = require('./socks');

var options = {
  family: 4,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
  all: true
};

exports.resolve = function resolve(host, proxy, onion) {
  if (proxy && onion)
    return socks.resolve(proxy, host);

  return new Promise(function(resolve, reject) {
    dns.resolve(host, 'A', function(err, result) {
      if (err) {
        reject(err);
        return;
      }

      if (result.length === 0) {
        reject(new Error('No DNS results.'));
        return;
      }

      resolve(result);
    });
  });
};

exports.lookup = function lookup(host, proxy, onion) {
  if (proxy && onion)
    return socks.resolve(proxy, host);

  return new Promise(function(resolve, reject) {
    var addrs = [];
    var i, addr;

    dns.lookup(host, options, function(err, result) {
      if (err) {
        reject(err);
        return;
      }

      if (result.length === 0) {
        reject(new Error('No DNS results.'));
        return;
      }

      for (i = 0; i < result.length; i++) {
        addr = result[i];
        addrs.push(addr.address);
      }

      resolve(addrs);
    });
  });
};
