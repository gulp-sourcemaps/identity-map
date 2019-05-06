'use strict';

var fs = require('fs');
var path = require('path');

var expect = require('expect');

var miss = require('mississippi');
var File = require('vinyl');

var generate = require('../lib/generate');

var identityMap = require('../');

var pipe = miss.pipe;
var from = miss.from;
var concat = miss.concat;

var jsContent = fs.readFileSync(path.join(__dirname, 'fixtures/helloworld.js'));
var jsHashBangContent = fs.readFileSync(path.join(__dirname, 'fixtures/helloworld.bin.js'));
var jsES2018Content = fs.readFileSync(path.join(__dirname, 'fixtures/es2018.js'));
var cssContent = fs.readFileSync(path.join(__dirname, 'fixtures/helloworld.css'));

function makeFile() {
  var file = new File({
    cwd: __dirname,
    base: __dirname + '/assets',
    path: __dirname + '/assets/helloworld.js',
    contents: jsContent,
  });

  file.sourceMap = {
    version: 3,
    file: 'helloworld.js',
    names: [],
    mappings: '',
    sources: ['helloworld.js'],
  };

  return file;
}

describe('identityMap', function() {

  it('ignores a file without sourceMap property', function(done) {
    var file = makeFile();
    delete file.sourceMap;

    var spy = expect.spyOn(generate, 'js');

    function assert(files) {
      expect.restoreSpies();
      expect(files.length).toEqual(1);
      expect(spy).toNotHaveBeenCalled();
    }

    pipe([
      from.obj([file]),
      identityMap(),
      concat(assert),
    ], done);
  });

  it('only ignores a file without sourceMap property', function(done) {
    var file = makeFile();
    delete file.sourceMap;
    var file2 = makeFile();

    var spy = expect.spyOn(generate, 'js');

    function assert(files) {
      expect.restoreSpies();
      expect(files.length).toEqual(2);
      expect(spy.calls.length).toEqual(1);
    }

    pipe([
      from.obj([file, file2]),
      identityMap(),
      concat(assert),
    ], done);
  });

  it('ignores a non-Buffer file', function(done) {
    var file = makeFile();
    file.contents = null;

    var spy = expect.spyOn(generate, 'js');

    function assert(files) {
      expect.restoreSpies();
      expect(files.length).toEqual(1);
      expect(spy).toNotHaveBeenCalled();
    }

    pipe([
      from.obj([file]),
      identityMap(),
      concat(assert),
    ], done);
  });

  it('only ignores a non-Buffer file', function(done) {
    var file = makeFile();
    file.contents = null;
    var file2 = makeFile();

    var spy = expect.spyOn(generate, 'js');

    function assert(files) {
      expect.restoreSpies();
      expect(files.length).toEqual(2);
      expect(spy.calls.length).toEqual(1);
    }

    pipe([
      from.obj([file, file2]),
      identityMap(),
      concat(assert),
    ], done);
  });

  it('adds a valid sourcemap for JS', function(done) {
    var file = makeFile();

    function assert(files) {
      expect(files.length).toEqual(1);

      var sourcemap = files[0].sourceMap;
      expect(sourcemap).toExist();
      expect(sourcemap.version).toEqual('3');
      expect(sourcemap.sources[0]).toEqual('helloworld.js');
      expect(sourcemap.sourcesContent[0]).toEqual(jsContent);
      expect(sourcemap.names).toEqual(['helloWorld', 'console','log']);
      expect(sourcemap.mappings).toEqual('AAAA,YAAY;;AAEZ,SAASA,UAAU,CAAC,EAAE;CACrBC,OAAO,CAACC,GAAG,CAAC,cAAc,CAAC;AAC5B');
    }

    pipe([
      from.obj([file]),
      identityMap(),
      concat(assert),
    ], done);
  });

  it('adds a valid sourcemap for JS with hashBang', function(done) {
    var file = makeFile();
    file.contents = jsHashBangContent;

    function assert(files) {
      expect(files.length).toEqual(1);

      var sourcemap = files[0].sourceMap;
      expect(sourcemap).toExist();
      expect(sourcemap.version).toEqual('3');
      expect(sourcemap.sources[0]).toEqual('helloworld.js');
      expect(sourcemap.sourcesContent[0]).toEqual(jsHashBangContent);
      expect(sourcemap.names).toEqual(['helloWorld', 'console','log']);
      expect(sourcemap.mappings).toEqual(';AACA,YAAY;;AAEZ,SAASA,UAAU,CAAC,EAAE;EACpBC,OAAO,CAACC,GAAG,CAAC,cAAc,CAAC;AAC7B');
    }

    pipe([
      from.obj([file]),
      identityMap(),
      concat(assert),
    ], done);
  });

  it('adds a valid sourcemap for JS with ES2018 syntax', function(done) {
    var file = makeFile();
    file.contents = jsES2018Content;

    function assert(files) {
      expect(files.length).toEqual(1);

      var sourcemap = files[0].sourceMap;
      expect(sourcemap).toExist();
      expect(sourcemap.version).toEqual('3');
      expect(sourcemap.sources[0]).toBe('helloworld.js');
      expect(sourcemap.sourcesContent[0]).toEqual(jsES2018Content);
      expect(sourcemap.names).toEqual(['justA', 'a', 'AandB', 'b', '_', 'justB', 'Boolean', 'exec', 'Promise', 'resolve', 'String', 'raw']);
      expect(sourcemap.mappings).toBe('AAAA,MAAMA,MAAM,EAAE,EAAEC,CAAC,EAAE,EAAE,CAAC;;AAEtB,MAAMC,MAAM,EAAE,EAAE,GAAGF,KAAK,EAAEG,CAAC,EAAE,EAAE,CAAC;;AAEhC,MAAM,EAAEF,CAAC,EAAEG,CAAC,EAAE,GAAGC,MAAM,EAAE,EAAEH,KAAK;;;AAGhCI,OAAO,CAAC,MAAM,CAACC,IAAI,CAAC,KAAK,CAAC,CAAC;;;AAG3BC,OAAO,CAACC,OAAO,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,EAAE,GAAG;;AAEhC,CAAC,CAAC;;;AAGFH,OAAO,CAAC,OAAO,CAACC,IAAI,CAAC,MAAM,CAAC,CAAC;;;AAG7BD,OAAO,CAAC,YAAY,CAACC,IAAI,CAAC,KAAK,CAAC,CAAC;;;AAGjCG,MAAM,CAACC,GAAG,CAAC,QAAQ,CAAC;;;AAGpB,iCAAiC,CAACJ,IAAI,CAAC,WAAW,CAAC');
    }

    pipe([
      from.obj([file]),
      identityMap(),
      concat(assert),
    ], done);
  });

  it('adds a valid source map for CSS', function(done) {
    var file = makeFile();
    file.extname = '.css';
    file.contents = cssContent;

    function assert(files) {
      expect(files.length).toEqual(1);

      var sourcemap = files[0].sourceMap;
      expect(sourcemap).toExist();
      expect(sourcemap.version).toEqual('3');
      expect(sourcemap.sources[0]).toBe('helloworld.css');
      expect(sourcemap.sourcesContent[0]).toEqual(cssContent);
      expect(sourcemap.names).toEqual([]);
      expect(sourcemap.mappings).toBe('CAAC;EACC;EACA');
    }

    pipe([
      from.obj([file]),
      identityMap(),
      concat(assert),
    ], done);
  });
});
