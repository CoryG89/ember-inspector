'use strict';

define('ember-inspector/tests/acceptance/container-test', ['qunit', 'ember-qunit', 'ember-inspector/tests/helpers/start-app', 'ember-native-dom-helpers'], function (_qunit, _emberQunit, _startApp, _emberNativeDomHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var App = void 0;

  var port = void 0,
      message = void 0,
      name = void 0;

  (0, _qunit.module)('Container Tab', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)({
        adapter: 'basic'
      });
      port = App.__container__.lookup('port:main');
    },
    afterEach: function afterEach() {
      name = null;
      message = null;
      Ember.run(App, App.destroy);
    }
  });

  function getTypes() {
    return [{
      name: 'route',
      count: 5
    }, {
      name: 'controller',
      count: 2
    }];
  }

  function getInstances() {
    return [{
      name: 'first',
      inspectable: false
    }, {
      name: 'second',
      inspectable: true
    }];
  }

  (0, _emberQunit.test)("Container types are successfully listed", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var rows;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              port.reopen({
                send: function send(name) {
                  if (name === 'container:getTypes') {
                    this.trigger('container:types', { types: getTypes() });
                  }
                }
              });

              _context.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/container-types');

            case 3:
              rows = (0, _emberNativeDomHelpers.findAll)('.js-container-type');

              assert.equal(rows.length, 2);
              assert.equal((0, _emberNativeDomHelpers.find)('.js-container-type-name', rows[0]).textContent.trim(), 'controller');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-container-type-count', rows[0]).textContent.trim(), '2');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-container-type-name', rows[1]).textContent.trim(), 'route');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-container-type-count', rows[1]).textContent.trim(), '5');

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Container instances are successfully listed", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var instances, rows;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              instances = getInstances();


              port.reopen({
                send: function send(n, m) {
                  name = n;
                  message = m;
                  if (name === 'container:getTypes') {
                    this.trigger('container:types', { types: getTypes() });
                  }

                  if (name === 'container:getInstances' && message.containerType === 'controller') {
                    this.trigger('container:instances', { instances: instances, status: 200 });
                  }
                }
              });

              _context2.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/container-types/controller');

            case 4:
              rows = void 0;


              rows = (0, _emberNativeDomHelpers.findAll)('.js-container-instance-list-item');

              assert.equal(rows[0].textContent.trim(), 'first');
              assert.equal(rows[1].textContent.trim(), 'second');
              name = null;
              message = null;

              _context2.next = 12;
              return (0, _emberNativeDomHelpers.click)(rows[0]);

            case 12:

              assert.equal(name, null);
              _context2.next = 15;
              return (0, _emberNativeDomHelpers.click)(rows[1]);

            case 15:

              assert.equal(name, 'objectInspector:inspectByContainerLookup');

              _context2.next = 18;
              return (0, _emberNativeDomHelpers.fillIn)('.js-container-instance-search input', 'first');

            case 18:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-container-instance-list-item');
              assert.equal(rows.length, 1);
              assert.equal(rows[0].textContent.trim(), 'first');

            case 21:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Successfully redirects if the container type is not found", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var adapterException;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:

              port.reopen({
                send: function send(n, m) {
                  name = n;
                  message = m;
                  if (name === 'container:getTypes') {
                    this.trigger('container:types', { types: getTypes() });
                  }

                  if (name === 'container:getInstances' && message.containerType === 'random-type') {
                    this.trigger('container:instances', { status: 404 });
                  }
                }
              });
              adapterException = Ember.Test.adapter.exception;
              // Failed route causes a promise unhandled rejection
              // even though there's an `error` action defined :(

              Ember.Test.adapter.exception = function (err) {
                if (!err || err.status !== 404) {
                  return adapterException.call(Ember.Test.adapter, err);
                }
              };
              _context3.next = 5;
              return (0, _emberNativeDomHelpers.visit)('/container-types/random-type');

            case 5:
              assert.equal((0, _emberNativeDomHelpers.currentURL)(), '/container-types');
              Ember.Test.adapter.exception = adapterException;

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Reload", function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
      var types, instances;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              types = [], instances = [];


              port.reopen({
                send: function send(n, m) {
                  if (n === 'container:getTypes') {
                    this.trigger('container:types', { types: types });
                  }
                  if (n === 'container:getInstances' && m.containerType === 'controller') {
                    this.trigger('container:instances', { instances: instances, status: 200 });
                  }
                }
              });

              _context4.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/container-types/controller');

            case 4:

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-container-type').length, 0);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-container-instance-list-item').length, 0);
              types = getTypes();
              instances = getInstances();

              _context4.next = 10;
              return (0, _emberNativeDomHelpers.click)('.js-reload-container-btn');

            case 10:

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-container-type').length, 2);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-container-instance-list-item').length, 2);

            case 12:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
});
define('ember-inspector/tests/acceptance/data-test', ['ember-qunit', 'qunit', 'ember-inspector/tests/helpers/start-app', 'ember-native-dom-helpers'], function (_emberQunit, _qunit, _startApp, _emberNativeDomHelpers) {
  'use strict';

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var run = Ember.run;

  var App = void 0;

  var port = void 0,
      name = void 0;

  (0, _qunit.module)('Data Tab', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)({
        adapter: 'basic'
      });
      port = App.__container__.lookup('port:main');
      port.reopen({
        init: function init() {},
        send: function send(n, m) {
          name = n;
          if (name === 'data:getModelTypes') {
            this.trigger('data:modelTypesAdded', { modelTypes: modelTypes() });
          }
          if (name === 'data:getRecords') {
            this.trigger('data:recordsAdded', { records: records(m.objectId) });
          }
          if (name === 'data:getFilters') {
            this.trigger('data:filters', { filters: getFilters() });
          }
        }
      });
    },
    afterEach: function afterEach() {
      name = null;
      run(App, App.destroy);
    }
  });

  function modelTypeFactory(options) {
    return {
      name: options.name,
      count: options.count,
      columns: options.columns,
      objectId: options.name
    };
  }

  function getFilters() {
    return [{ name: 'isNew', desc: 'New' }];
  }

  function modelTypes() {
    return [modelTypeFactory({
      name: 'App.Post',
      count: 2,
      columns: [{ name: 'id', desc: 'Id' }, { name: 'title', desc: 'Title' }, { name: 'body', desc: 'Body' }]
    }), modelTypeFactory({
      name: 'App.Comment',
      count: 1,
      columns: [{ name: 'id', desc: 'Id' }, { name: 'title', desc: 'Title' }, { name: 'content', desc: 'Content' }]
    })];
  }

  function recordFactory(attr, filterValues) {
    filterValues = filterValues || { isNew: false };
    var searchKeywords = [];
    for (var i in attr) {
      searchKeywords.push(attr[i]);
    }
    var object = Ember.Object.create();
    return {
      columnValues: attr,
      objectId: attr.objectId || Ember.guidFor(object),
      filterValues: filterValues,
      searchKeywords: searchKeywords
    };
  }

  function records(type) {
    if (type === 'App.Post') {
      return [recordFactory({ id: 1, title: 'My Post', body: 'This is my first post' }), recordFactory({ id: 2, title: 'Hello', body: '' }, { isNew: true })];
    } else if (type === 'App.Comment') {
      return [recordFactory({ id: 2, title: 'I am confused', content: 'I have no idea what im doing' })];
    }
  }

  (0, _emberQunit.test)("Model types are successfully listed and bound", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/data/model-types');

            case 2:

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-model-type').length, 2);
              // they should be sorted alphabetically
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-model-type-name')[0].textContent.trim(), 'App.Comment');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-model-type-name')[1].textContent.trim(), 'App.Post');

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-model-type-count')[0].textContent.trim(), 1);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-model-type-count')[1].textContent.trim(), 2);

              _context.next = 9;
              return triggerPort('data:modelTypesUpdated', {
                modelTypes: [modelTypeFactory({ name: 'App.Post', count: 3 })]
              });

            case 9:
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-model-type-count')[1].textContent.trim(), 3);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function t(_x) {
      return _ref.apply(this, arguments);
    }

    return t;
  }());

  (0, _emberQunit.test)("Records are successfully listed and bound", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var columns, recordRows, firstRow, secondRow, row, rows, lastRow;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/data/model-types');

            case 2:
              _context2.next = 4;
              return (0, _emberNativeDomHelpers.click)((0, _emberNativeDomHelpers.findAll)('.js-model-type a')[1]);

            case 4:
              columns = (0, _emberNativeDomHelpers.findAll)('.js-header-column');

              assert.equal(columns[0].textContent.trim(), 'Id');
              assert.equal(columns[1].textContent.trim(), 'Title');
              assert.equal(columns[2].textContent.trim(), 'Body');

              recordRows = (0, _emberNativeDomHelpers.findAll)('.js-record-list-item');

              assert.equal(recordRows.length, 2);

              firstRow = recordRows[0];

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', firstRow)[0].textContent.trim(), 1);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', firstRow)[1].textContent.trim(), 'My Post');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', firstRow)[2].textContent.trim(), 'This is my first post');

              secondRow = recordRows[1];

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', secondRow)[0].textContent.trim(), 2);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', secondRow)[1].textContent.trim(), 'Hello');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', secondRow)[2].textContent.trim(), '');

              _context2.next = 20;
              return triggerPort('data:recordsAdded', {
                records: [recordFactory({ objectId: 'new-post', id: 3, title: 'Added Post', body: 'I am new here' })]
              });

            case 20:
              row = (0, _emberNativeDomHelpers.findAll)('.js-record-list-item')[2];

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', row)[0].textContent.trim(), 3);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', row)[1].textContent.trim(), 'Added Post');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', row)[2].textContent.trim(), 'I am new here');

              _context2.next = 26;
              return triggerPort('data:recordsUpdated', {
                records: [recordFactory({ objectId: 'new-post', id: 3, title: 'Modified Post', body: 'I am no longer new' })]
              });

            case 26:
              rows = (0, _emberNativeDomHelpers.findAll)('.js-record-list-item');

              row = rows[rows.length - 1];
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', row)[0].textContent.trim(), 3);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', row)[1].textContent.trim(), 'Modified Post');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', row)[2].textContent.trim(), 'I am no longer new');

              _context2.next = 33;
              return triggerPort('data:recordsRemoved', {
                index: 2,
                count: 1
              });

            case 33:
              _context2.next = 35;
              return wait();

            case 35:

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-list-item').length, 2);
              rows = (0, _emberNativeDomHelpers.findAll)('.js-record-list-item');
              lastRow = rows[rows.length - 1];

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', lastRow)[0].textContent.trim(), 2, "Records successfully removed.");

            case 39:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function t(_x2) {
      return _ref2.apply(this, arguments);
    }

    return t;
  }());

  (0, _emberQunit.test)("Filtering records", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var rows, filters, newFilter;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/data/model-types');

            case 2:
              _context3.next = 4;
              return (0, _emberNativeDomHelpers.click)((0, _emberNativeDomHelpers.findAll)('.js-model-type a')[1]);

            case 4:
              rows = (0, _emberNativeDomHelpers.findAll)('.js-record-list-item');

              assert.equal(rows.length, 2);
              filters = (0, _emberNativeDomHelpers.findAll)('.js-filter');

              assert.equal(filters.length, 2);
              newFilter = [].concat(_toConsumableArray(filters)).find(function (e) {
                return e.textContent.indexOf('New') > -1;
              });
              _context3.next = 11;
              return (0, _emberNativeDomHelpers.click)(newFilter);

            case 11:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-record-list-item');
              assert.equal(rows.length, 1);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', rows[0])[0].textContent.trim(), '2');

            case 14:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function t(_x3) {
      return _ref3.apply(this, arguments);
    }

    return t;
  }());

  (0, _emberQunit.test)("Searching records", function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
      var rows;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/data/model-types');

            case 2:
              _context4.next = 4;
              return (0, _emberNativeDomHelpers.click)((0, _emberNativeDomHelpers.findAll)('.js-model-type a')[1]);

            case 4:
              rows = (0, _emberNativeDomHelpers.findAll)('.js-record-list-item');

              assert.equal(rows.length, 2);

              _context4.next = 8;
              return (0, _emberNativeDomHelpers.fillIn)('.js-records-search input', 'Hello');

            case 8:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-record-list-item');
              assert.equal(rows.length, 1);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', rows[0])[0].textContent.trim(), '2');

              _context4.next = 13;
              return (0, _emberNativeDomHelpers.fillIn)('.js-records-search input', 'my first post');

            case 13:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-record-list-item');
              assert.equal(rows.length, 1);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-record-column', rows[0])[0].textContent.trim(), '1');

              _context4.next = 18;
              return (0, _emberNativeDomHelpers.fillIn)('.js-records-search input', '');

            case 18:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-record-list-item');
              assert.equal(rows.length, 2);

            case 20:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function t(_x4) {
      return _ref4.apply(this, arguments);
    }

    return t;
  }());

  (0, _emberQunit.test)("Columns successfully updated when switching model types", function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
      var columns;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/data/model-types/App.Post/records');

            case 2:
              columns = (0, _emberNativeDomHelpers.findAll)('.js-header-column');

              assert.equal(columns[columns.length - 1].textContent.trim(), 'Body');
              _context5.next = 6;
              return (0, _emberNativeDomHelpers.visit)('/data/model-types/App.Comment/records');

            case 6:
              columns = (0, _emberNativeDomHelpers.findAll)('.js-header-column');
              assert.equal(columns[columns.length - 1].textContent.trim(), 'Content');

            case 8:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function t(_x5) {
      return _ref5.apply(this, arguments);
    }

    return t;
  }());
});
define('ember-inspector/tests/acceptance/deprecation-test', ['ember-qunit', 'qunit', 'ember-inspector/tests/helpers/start-app', 'ember-native-dom-helpers'], function (_emberQunit, _qunit, _startApp, _emberNativeDomHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var App = void 0;

  var port = void 0,
      message = void 0,
      name = void 0;

  function deprecationsWithSource() {
    return [{
      count: 2,
      hasSourceMap: true,
      sources: [{
        stackStr: 'stack-trace',
        map: {
          source: 'path-to-file.js',
          line: 1,
          fullSource: 'http://path-to-file.js'
        }
      }, {
        stackStr: 'stack-trace-2',
        map: {
          source: 'path-to-second-file.js',
          line: 2,
          fullSource: 'http://path-to-second-file.js'
        }
      }],
      message: 'Deprecation 1',
      url: 'http://www.emberjs.com'
    }];
  }

  (0, _qunit.module)('Deprecation Tab', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)({ adapter: 'basic' });
      port = App.__container__.lookup('port:main');
      port.reopen({
        send: function send(n, m) {
          name = n;
          message = m;
        }
      });
    },
    afterEach: function afterEach() {
      name = null;
      message = null;
      Ember.run(App, App.destroy);
    }
  });

  (0, _emberQunit.test)('No source map', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              port.reopen({
                send: function send(name) {
                  if (name === 'deprecation:watch') {
                    port.trigger('deprecation:deprecationsAdded', {
                      deprecations: [{
                        count: 2,
                        sources: [{
                          stackStr: 'stack-trace',
                          map: null
                        }, {
                          stackStr: 'stack-trace-2',
                          map: null
                        }],
                        message: 'Deprecation 1',
                        url: 'http://www.emberjs.com'
                      }]
                    });
                  }
                  return this._super.apply(this, arguments);
                }
              });

              _context.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/deprecations');

            case 3:

              assert.notOk((0, _emberNativeDomHelpers.find)('.js-deprecation-source'), 'no sources');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-deprecation-message')[0].textContent.trim(), 'Deprecation 1', 'message shown');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-deprecation-count')[0].textContent.trim(), 2, 'Count correct');
              assert.ok((0, _emberNativeDomHelpers.find)('.js-deprecation-full-trace'), 'Full trace button shown');
              _context.next = 9;
              return (0, _emberNativeDomHelpers.click)('.js-full-trace-deprecations-btn');

            case 9:

              assert.equal(name, 'deprecation:sendStackTraces');
              assert.equal(message.deprecation.message, 'Deprecation 1');
              assert.equal(message.deprecation.sources.length, 2);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("With source map, source found, can't open resource", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var sources;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              port.reopen({
                send: function send(name) {
                  if (name === 'deprecation:watch') {
                    port.trigger('deprecation:deprecationsAdded', {
                      deprecations: deprecationsWithSource()
                    });
                  }
                  return this._super.apply(this, arguments);
                }
              });

              _context2.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/deprecations');

            case 3:

              assert.equal((0, _emberNativeDomHelpers.find)('.js-deprecation-message').textContent.trim(), 'Deprecation 1', 'message shown');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-deprecation-count').textContent.trim(), 2, 'Count correct');
              assert.notOk((0, _emberNativeDomHelpers.find)('.js-deprecation-full-trace'), 'Full trace button not shown');

              sources = (0, _emberNativeDomHelpers.findAll)('.js-deprecation-source');

              assert.equal(sources.length, 2, 'shows all sources');
              assert.notOk((0, _emberNativeDomHelpers.find)('.js-deprecation-source-link', sources[0]), 'source not clickable');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-deprecation-source-text', sources[0]).textContent.trim(), 'path-to-file.js:1');
              assert.notOk((0, _emberNativeDomHelpers.find)('.js-deprecation-source-link', sources[1]), 'source not clickable');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-deprecation-source-text', sources[1]).textContent.trim(), 'path-to-second-file.js:2');

              _context2.next = 14;
              return (0, _emberNativeDomHelpers.click)('.js-trace-deprecations-btn', sources[0]);

            case 14:

              assert.equal(name, 'deprecation:sendStackTraces');
              assert.equal(message.deprecation.message, 'Deprecation 1');
              assert.equal(message.deprecation.sources.length, 1);

              _context2.next = 19;
              return (0, _emberNativeDomHelpers.click)('.js-trace-deprecations-btn', sources[1]);

            case 19:

              assert.equal(name, 'deprecation:sendStackTraces');
              assert.equal(message.deprecation.message, 'Deprecation 1');
              assert.equal(message.deprecation.sources.length, 1);

            case 22:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("With source map, source found, can open resource", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var openResourceArgs, sources;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              openResourceArgs = false;

              port.get('adapter').reopen({
                canOpenResource: true,
                openResource: function openResource() {
                  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                  }

                  openResourceArgs = args;
                }
              });
              port.reopen({
                send: function send(name) {
                  if (name === 'deprecation:watch') {
                    port.trigger('deprecation:deprecationsAdded', {
                      deprecations: deprecationsWithSource()
                    });
                  }
                  return this._super.apply(this, arguments);
                }
              });

              _context3.next = 5;
              return (0, _emberNativeDomHelpers.visit)('/deprecations');

            case 5:

              assert.equal((0, _emberNativeDomHelpers.find)('.js-deprecation-message').textContent.trim(), 'Deprecation 1', 'message shown');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-deprecation-count').textContent.trim(), 2, 'Count correct');
              assert.notOk((0, _emberNativeDomHelpers.find)('.js-deprecation-full-trace'), 'Full trace button not shown');

              sources = (0, _emberNativeDomHelpers.findAll)('.js-deprecation-source');

              assert.equal(sources.length, 2, 'shows all sources');
              assert.notOk((0, _emberNativeDomHelpers.find)('.js-deprecation-source-text', sources[0]), 'source clickable');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-deprecation-source-link', sources[0]).textContent.trim(), 'path-to-file.js:1');
              assert.notOk((0, _emberNativeDomHelpers.find)('.js-deprecation-source-text', sources[1]), 'source clickable');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-deprecation-source-link', sources[1]).textContent.trim(), 'path-to-second-file.js:2');

              openResourceArgs = false;
              _context3.next = 17;
              return (0, _emberNativeDomHelpers.click)('.js-deprecation-source-link', sources[0]);

            case 17:

              assert.ok(openResourceArgs);
              openResourceArgs = false;

              _context3.next = 21;
              return (0, _emberNativeDomHelpers.click)('.js-deprecation-source-link', sources[1]);

            case 21:

              assert.ok(openResourceArgs);
              openResourceArgs = false;

              _context3.next = 25;
              return (0, _emberNativeDomHelpers.click)('.js-trace-deprecations-btn', sources[0]);

            case 25:

              assert.equal(name, 'deprecation:sendStackTraces');
              assert.equal(message.deprecation.message, 'Deprecation 1');
              assert.equal(message.deprecation.sources.length, 1);
              _context3.next = 30;
              return (0, _emberNativeDomHelpers.click)('.js-trace-deprecations-btn', sources[1]);

            case 30:
              assert.equal(name, 'deprecation:sendStackTraces');
              assert.equal(message.deprecation.message, 'Deprecation 1');
              assert.equal(message.deprecation.sources.length, 1);

            case 33:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
});
define('ember-inspector/tests/acceptance/info-test', ['ember-qunit', 'qunit', 'ember-inspector/tests/helpers/start-app', 'ember-native-dom-helpers'], function (_emberQunit, _qunit, _startApp, _emberNativeDomHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var App = void 0;

  var port = void 0;

  (0, _qunit.module)('Info Tab', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)({
        adapter: 'basic'
      });
      App.__container__.lookup('config:main').VERSION = '9.9.9';
      port = App.__container__.lookup('port:main');
      port.reopen({
        send: function send(name) {
          if (name === 'general:getLibraries') {
            this.trigger('general:libraries', {
              libraries: [{ name: 'Ember', version: '1.0' }, { name: 'Handlebars', version: '2.1' }]
            });
          }
        }
      });
    },
    afterEach: function afterEach() {
      Ember.run(App, App.destroy);
    }
  });

  (0, _emberQunit.test)("Libraries are displayed correctly", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var libraries;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/info');

            case 2:
              libraries = (0, _emberNativeDomHelpers.findAll)('.js-library-row');

              assert.equal(libraries.length, 3, "The correct number of libraries is displayed");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-lib-name', libraries[0]).textContent.trim(), 'Ember Inspector', 'Ember Inspector is added automatically');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-lib-version', libraries[0]).textContent.trim(), '9.9.9');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-lib-name', libraries[1]).textContent.trim(), 'Ember');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-lib-version', libraries[1]).textContent.trim(), '1.0');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-lib-name', libraries[2]).textContent.trim(), 'Handlebars');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-lib-version', libraries[2]).textContent.trim(), '2.1');

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function t(_x) {
      return _ref.apply(this, arguments);
    }

    return t;
  }());
});
define('ember-inspector/tests/acceptance/object-inspector-test', ['ember-qunit', 'qunit', 'ember-inspector/tests/helpers/start-app', 'ember-native-dom-helpers'], function (_emberQunit, _qunit, _startApp, _emberNativeDomHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var App = void 0;
  var port = void 0,
      message = void 0,
      name = void 0;

  (0, _qunit.module)('Object Inspector', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)({
        adapter: 'basic'
      });
      port = App.__container__.lookup('port:main');
      port.reopen({
        send: function send(n, m) {
          name = n;
          message = m;
        }
      });
    },
    afterEach: function afterEach() {
      name = null;
      message = null;
      Ember.run(App, App.destroy);
    }
  });

  var objectAttr = {
    name: 'Object Name',
    objectId: 1,
    errors: [],
    details: [{
      name: 'Own Properties',
      expand: true,
      properties: [{
        name: 'id',
        value: 1
      }]
    }]
  };

  function objectFactory(props) {
    return Object.assign({}, objectAttr, props);
  }

  function objectToInspect() {
    return objectFactory({
      name: 'My Object',
      objectId: 'objectId',
      errors: [],
      details: [{
        name: 'First Detail',
        expand: false,
        properties: [{
          name: 'numberProperty',
          value: {
            inspect: 1,
            value: 'type-number'
          }
        }]
      }, {
        name: 'Second Detail',
        properties: [{
          name: 'objectProperty',
          value: {
            inspect: 'Ember Object Name',
            type: 'type-ember-object'
          }
        }, {
          name: 'stringProperty',
          value: {
            inspect: 'String Value',
            type: 'type-ember-string'
          }
        }]
      }]
    });
  }

  (0, _emberQunit.test)("The object displays correctly", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var obj;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              obj = objectFactory({ name: 'My Object' });
              _context.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 3:
              _context.next = 5;
              return triggerPort('objectInspector:updateObject', obj);

            case 5:

              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-name').textContent, 'My Object');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-detail-name').textContent, 'Own Properties');
              assert.ok((0, _emberNativeDomHelpers.find)('.js-object-detail').classList.contains('mixin_state_expanded'), 'The "Own Properties" detail is expanded by default');

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Object details", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var firstDetail, secondDetail;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              firstDetail = void 0, secondDetail = void 0;
              _context2.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 3:
              _context2.next = 5;
              return triggerPort('objectInspector:updateObject', objectToInspect());

            case 5:

              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-name').textContent, 'My Object');
              firstDetail = (0, _emberNativeDomHelpers.findAll)('.js-object-detail')[0];
              secondDetail = (0, _emberNativeDomHelpers.findAll)('.js-object-detail')[1];
              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-detail-name', firstDetail).textContent, 'First Detail');
              assert.notOk(firstDetail.classList.contains('mixin_state_expanded'), 'Detail not expanded by default');

              _context2.next = 12;
              return (0, _emberNativeDomHelpers.click)('.js-object-detail-name', firstDetail);

            case 12:

              assert.ok(firstDetail.classList.contains('mixin_state_expanded'), 'Detail expands on click.');
              assert.notOk(secondDetail.classList.contains('mixin_state_expanded'), 'Second detail does not expand.');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-object-property', firstDetail).length, 1);
              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-property-name', firstDetail).textContent, 'numberProperty');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-property-value', firstDetail).textContent, '1');

              _context2.next = 19;
              return (0, _emberNativeDomHelpers.click)('.js-object-detail-name', firstDetail);

            case 19:

              assert.notOk(firstDetail.classList.contains('mixin_state_expanded'), 'Expanded detail minimizes on click.');
              _context2.next = 22;
              return (0, _emberNativeDomHelpers.click)('.js-object-detail-name', secondDetail);

            case 22:

              assert.ok(secondDetail.classList.contains('mixin_state_expanded'));
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-object-property', secondDetail).length, 2);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-object-property-name', secondDetail)[0].textContent, 'objectProperty');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-object-property-value', secondDetail)[0].textContent, 'Ember Object Name');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-object-property-name', secondDetail)[1].textContent, 'stringProperty');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-object-property-value', secondDetail)[1].textContent, 'String Value');

            case 28:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Digging deeper into objects", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var secondDetail, nestedObject;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              secondDetail = void 0;
              _context3.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 3:

              triggerPort('objectInspector:updateObject', objectToInspect());

              secondDetail = (0, _emberNativeDomHelpers.findAll)('.js-object-detail')[1];
              _context3.next = 7;
              return (0, _emberNativeDomHelpers.click)('.js-object-detail-name', secondDetail);

            case 7:
              _context3.next = 9;
              return (0, _emberNativeDomHelpers.click)('.js-object-property .js-object-property-value');

            case 9:

              assert.equal(name, 'objectInspector:digDeeper');
              assert.deepEqual(message, { objectId: 'objectId', property: 'objectProperty' });

              nestedObject = {
                parentObject: 'objectId',
                name: 'Nested Object',
                objectId: 'nestedObject',
                property: 'objectProperty',
                details: [{
                  name: 'Nested Detail',
                  properties: [{
                    name: 'nestedProp',
                    value: {
                      inspect: 'Nested Prop',
                      type: 'type-string'
                    }
                  }]
                }]
              };
              _context3.next = 14;
              return triggerPort('objectInspector:updateObject', nestedObject);

            case 14:

              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-name').textContent, 'My Object', 'Title stays as the initial object.');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-trail').textContent, '.objectProperty', 'Nested property shows below title');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-detail-name').textContent, 'Nested Detail');
              _context3.next = 19;
              return (0, _emberNativeDomHelpers.click)('.js-object-detail-name');

            case 19:

              assert.ok((0, _emberNativeDomHelpers.find)('.js-object-detail').classList.contains('mixin_state_expanded'));
              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-property-name').textContent, 'nestedProp');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-property-value').textContent, 'Nested Prop');
              _context3.next = 24;
              return (0, _emberNativeDomHelpers.click)('.js-object-inspector-back');

            case 24:

              assert.notOk((0, _emberNativeDomHelpers.find)('.js-object-trail'), 0);

            case 25:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Computed properties", function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
      var obj;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 2:
              obj = {
                name: 'My Object',
                objectId: 'myObject',
                details: [{
                  name: 'Detail',
                  properties: [{
                    name: 'computedProp',
                    value: {
                      inspect: '<computed>',
                      type: 'type-descriptor',
                      computed: true
                    }
                  }]
                }]
              };
              _context4.next = 5;
              return triggerPort('objectInspector:updateObject', obj);

            case 5:
              _context4.next = 7;
              return (0, _emberNativeDomHelpers.click)('.js-object-detail-name');

            case 7:
              _context4.next = 9;
              return (0, _emberNativeDomHelpers.click)('.js-calculate');

            case 9:

              assert.equal(name, 'objectInspector:calculate');
              assert.deepEqual(message, { objectId: 'myObject', property: 'computedProp', mixinIndex: 0 });
              _context4.next = 13;
              return triggerPort('objectInspector:updateProperty', {
                objectId: 'myObject',
                property: 'computedProp',
                value: {
                  inspect: 'Computed value'
                },
                mixinIndex: 0
              });

            case 13:

              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-property-value').textContent, 'Computed value');

            case 14:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Properties are bound to the application properties", function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
      var obj, txtField;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 2:
              obj = {
                name: 'My Object',
                objectId: 'object-id',
                details: [{
                  name: 'Own Properties',
                  expand: true,
                  properties: [{
                    name: 'boundProp',
                    value: {
                      inspect: 'Teddy',
                      type: 'type-string',
                      computed: false
                    }
                  }]

                }]
              };
              _context5.next = 5;
              return triggerPort('objectInspector:updateObject', obj);

            case 5:

              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-property-value').textContent, 'Teddy');
              _context5.next = 8;
              return triggerPort('objectInspector:updateProperty', {
                objectId: 'object-id',
                mixinIndex: 0,
                property: 'boundProp',
                value: {
                  inspect: 'Alex',
                  type: 'type-string',
                  computed: false
                }
              });

            case 8:
              _context5.next = 10;
              return (0, _emberNativeDomHelpers.click)('.js-object-property-value');

            case 10:
              txtField = (0, _emberNativeDomHelpers.find)('.js-object-property-value-txt');

              assert.equal(txtField.value, '"Alex"');
              _context5.next = 14;
              return (0, _emberNativeDomHelpers.fillIn)(txtField, '"Joey"');

            case 14:
              _context5.next = 16;
              return (0, _emberNativeDomHelpers.keyEvent)('.js-object-property-value-txt', 'keyup', 13);

            case 16:
              assert.equal(name, 'objectInspector:saveProperty');
              assert.equal(message.property, 'boundProp');
              assert.equal(message.value, 'Joey');
              assert.equal(message.mixinIndex, 0);

              _context5.next = 22;
              return triggerPort('objectInspector:updateProperty', {
                objectId: 'object-id',
                mixinIndex: 0,
                property: 'boundProp',
                value: {
                  inspect: 'Joey',
                  type: 'type-string',
                  computed: false
                }
              });

            case 22:

              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-property-value').textContent, 'Joey');

            case 23:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x5) {
      return _ref5.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Stringified json should not get double parsed", function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
      var obj, txtField;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 2:
              obj = {
                name: 'My Object',
                objectId: 'object-id',
                details: [{
                  name: 'Own Properties',
                  expand: true,
                  properties: [{
                    name: 'boundProp',
                    value: {
                      inspect: '{"name":"teddy"}',
                      type: 'type-string',
                      computed: false
                    }
                  }]

                }]
              };
              _context6.next = 5;
              return triggerPort('objectInspector:updateObject', obj);

            case 5:
              _context6.next = 7;
              return (0, _emberNativeDomHelpers.click)('.js-object-property-value');

            case 7:
              txtField = (0, _emberNativeDomHelpers.find)('.js-object-property-value-txt');

              assert.equal(txtField.value, '"{"name":"teddy"}"');
              _context6.next = 11;
              return (0, _emberNativeDomHelpers.fillIn)(txtField, '"{"name":"joey"}"');

            case 11:
              _context6.next = 13;
              return (0, _emberNativeDomHelpers.keyEvent)('.js-object-property-value-txt', 'keyup', 13);

            case 13:
              assert.equal(name, 'objectInspector:saveProperty');
              assert.equal(message.property, 'boundProp');
              assert.equal(message.value, '{"name":"joey"}');
              assert.equal(message.mixinIndex, 0);

            case 17:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Send to console", function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
      var obj;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 2:
              obj = {
                name: 'My Object',
                objectId: 'object-id',
                details: [{
                  name: 'Own Properties',
                  expand: true,
                  properties: [{
                    name: 'myProp',
                    value: {
                      inspect: 'Teddy',
                      type: 'type-string',
                      computed: false
                    }
                  }]

                }]
              };
              _context7.next = 5;
              return triggerPort('objectInspector:updateObject', obj);

            case 5:
              _context7.next = 7;
              return (0, _emberNativeDomHelpers.click)('.js-send-to-console-btn');

            case 7:

              assert.equal(name, 'objectInspector:sendToConsole');
              assert.equal(message.objectId, 'object-id');
              assert.equal(message.property, 'myProp');

              _context7.next = 12;
              return (0, _emberNativeDomHelpers.click)('.js-send-object-to-console-btn');

            case 12:

              assert.equal(name, 'objectInspector:sendToConsole');
              assert.equal(message.objectId, 'object-id');
              assert.equal(message.property, undefined);

            case 15:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    return function (_x7) {
      return _ref7.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Read only CPs cannot be edited", function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(assert) {
      var obj, valueElements;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 2:
              obj = {
                name: 'My Object',
                objectId: 'object-id',
                details: [{
                  name: 'Own Properties',
                  expand: true,
                  properties: [{
                    name: 'readCP',
                    readOnly: true,
                    value: {
                      computed: true,
                      inspect: 'Read',
                      type: 'type-string'
                    }
                  }, {
                    name: 'readCP',
                    readOnly: false,
                    value: {
                      computed: true,
                      inspect: 'Write',
                      type: 'type-string'
                    }
                  }]
                }]
              };
              _context8.next = 5;
              return triggerPort('objectInspector:updateObject', obj);

            case 5:
              _context8.next = 7;
              return (0, _emberNativeDomHelpers.click)('.js-object-property-value');

            case 7:
              assert.notOk((0, _emberNativeDomHelpers.find)('.js-object-property-value-txt'));

              valueElements = (0, _emberNativeDomHelpers.findAll)('.js-object-property-value');
              _context8.next = 11;
              return (0, _emberNativeDomHelpers.click)(valueElements[valueElements.length - 1]);

            case 11:

              assert.ok((0, _emberNativeDomHelpers.find)('.js-object-property-value-txt'));

            case 12:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    return function (_x8) {
      return _ref8.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Dropping an object due to destruction", function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(assert) {
      var obj;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 2:
              obj = {
                name: 'My Object',
                objectId: 'myObject',
                details: [{
                  name: 'Detail',
                  properties: []
                }]
              };
              _context9.next = 5;
              return triggerPort('objectInspector:updateObject', obj);

            case 5:

              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-name').textContent.trim(), 'My Object');
              _context9.next = 8;
              return triggerPort('objectInspector:droppedObject', { objectId: 'myObject' });

            case 8:

              assert.notOk((0, _emberNativeDomHelpers.find)('.js-object-name'));

            case 9:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    return function (_x9) {
      return _ref9.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Date fields are editable", function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(assert) {
      var date, obj, field, newDate;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 2:
              date = new Date();
              obj = {
                name: 'My Object',
                objectId: 'myObject',
                details: [{
                  name: 'First Detail',
                  expand: false,
                  properties: [{
                    name: 'dateProperty',
                    value: {
                      inspect: date.toString(),
                      type: 'type-date'
                    }
                  }]
                }]
              };
              _context10.next = 6;
              return triggerPort('objectInspector:updateObject', obj);

            case 6:
              assert.ok(true);

              _context10.next = 9;
              return (0, _emberNativeDomHelpers.click)('.js-object-detail-name');

            case 9:
              _context10.next = 11;
              return (0, _emberNativeDomHelpers.click)('.js-object-property-value');

            case 11:
              field = (0, _emberNativeDomHelpers.find)('.js-object-property-value-date');

              assert.ok(field);
              _context10.next = 15;
              return (0, _emberNativeDomHelpers.fillIn)(field, '2015-01-01');

            case 15:

              assert.equal(name, 'objectInspector:saveProperty');
              assert.equal(message.property, 'dateProperty');
              assert.equal(message.dataType, 'date');

              newDate = new Date(message.value);

              assert.equal(newDate.getMonth(), 0);
              assert.equal(newDate.getDate(), 1);
              assert.equal(newDate.getFullYear(), 2015);

            case 22:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    return function (_x10) {
      return _ref10.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Errors are correctly displayed", function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(assert) {
      var obj;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              obj = objectFactory({
                name: 'My Object',
                objectId: '1',
                errors: [{ property: 'foo' }, { property: 'bar' }]
              });
              _context11.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 3:
              _context11.next = 5;
              return triggerPort('objectInspector:updateObject', obj);

            case 5:

              assert.equal((0, _emberNativeDomHelpers.find)('.js-object-name').textContent, 'My Object');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-object-inspector-errors').length, 1);
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-object-inspector-error').length, 2);

              _context11.next = 10;
              return (0, _emberNativeDomHelpers.click)('.js-send-errors-to-console');

            case 10:

              assert.equal(name, 'objectInspector:traceErrors');
              assert.equal(message.objectId, '1');

              _context11.next = 14;
              return triggerPort('objectInspector:updateErrors', {
                objectId: '1',
                errors: [{ property: 'foo' }]
              });

            case 14:

              assert.ok((0, _emberNativeDomHelpers.find)('.js-object-inspector-error'));

              _context11.next = 17;
              return triggerPort('objectInspector:updateErrors', {
                objectId: '1',
                errors: []
              });

            case 17:

              assert.notOk((0, _emberNativeDomHelpers.find)('.js-object-inspector-errors'));

            case 18:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, this);
    }));

    return function (_x11) {
      return _ref11.apply(this, arguments);
    };
  }());
});
define('ember-inspector/tests/acceptance/promise-test', ['ember-qunit', 'qunit', 'ember-inspector/tests/helpers/start-app', 'ember-native-dom-helpers'], function (_emberQunit, _qunit, _startApp, _emberNativeDomHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var App = void 0;
  var port = void 0,
      message = void 0,
      name = void 0;

  (0, _qunit.module)('Promise Tab', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)({
        adapter: 'basic'
      });
      port = App.__container__.lookup('port:main');
      port.reopen({
        send: function send(n, m) {
          if (n === 'promise:getAndObservePromises') {
            port.trigger('promise:promisesUpdated', {
              promises: []
            });
          }
          name = n;
          message = m;
        }
      });
    },
    afterEach: function afterEach() {
      name = null;
      message = null;
      Ember.run(App, App.destroy);
    }
  });

  var guids = 0;
  function generatePromise(props) {
    return Object.assign({
      guid: ++guids,
      label: 'Generated Promise',
      parent: null,
      children: null,
      state: 'created',
      value: null,
      reason: null,
      createdAt: Date.now(),
      hasStack: false
    }, props);
  }

  (0, _emberQunit.test)("Shows page refresh hint if no promises", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 2:
              _context.next = 4;
              return triggerPort('promise:promisesUpdated', {
                promises: []
              });

            case 4:

              assert.notOk((0, _emberNativeDomHelpers.find)('.js-promise-tree'), "no promise list");
              assert.ok((0, _emberNativeDomHelpers.find)('.js-page-refresh'), "page refresh hint seen");

              _context.next = 8;
              return (0, _emberNativeDomHelpers.click)('.js-page-refresh-btn');

            case 8:

              assert.equal(name, 'general:refresh');

              _context.next = 11;
              return triggerPort('promise:promisesUpdated', {
                promises: [generatePromise({
                  guid: 1,
                  label: 'Promise 1',
                  state: 'created'
                })]
              });

            case 11:

              assert.ok((0, _emberNativeDomHelpers.find)('.js-promise-tree'), 'promise tree is seen after being populated');
              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-promise-tree-item').length, 1, '1 promise item can be seen');
              assert.notOk((0, _emberNativeDomHelpers.find)('.js-page-refresh'), 'page refresh hint hidden');

              // make sure clearing does not show the refresh hint
              _context.next = 16;
              return (0, _emberNativeDomHelpers.click)('.js-clear-promises-btn');

            case 16:

              assert.ok((0, _emberNativeDomHelpers.find)('.js-promise-tree'), 'promise-tree can be seen');
              assert.notOk((0, _emberNativeDomHelpers.find)('.js-promise-tree-item'), 'promise items cleared');
              assert.notOk((0, _emberNativeDomHelpers.find)('.js-page-refresh'), 'page refresh hint hidden');

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Pending promise", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var row;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 2:
              _context2.next = 4;
              return triggerPort('promise:promisesUpdated', {
                promises: [generatePromise({
                  guid: 1,
                  label: 'Promise 1',
                  state: 'created'
                })]
              });

            case 4:
              _context2.next = 6;
              return wait();

            case 6:

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-promise-tree-item').length, 1);
              row = (0, _emberNativeDomHelpers.find)('.js-promise-tree-item');

              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-label', row).textContent.trim(), 'Promise 1');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-state', row).textContent.trim(), 'Pending');

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Fulfilled promise", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var now, row;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 2:
              now = Date.now();


              triggerPort('promise:promisesUpdated', {
                promises: [generatePromise({
                  guid: 1,
                  label: 'Promise 1',
                  state: 'fulfilled',
                  value: {
                    inspect: 'value',
                    type: 'type-string'
                  },
                  createdAt: now,
                  settledAt: now + 10
                })]
              });
              _context3.next = 6;
              return wait();

            case 6:

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-promise-tree-item').length, 1);
              row = (0, _emberNativeDomHelpers.find)('.js-promise-tree-item');

              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-label', row).textContent.trim(), 'Promise 1');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-state', row).textContent.trim(), 'Fulfilled');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-value', row).textContent.trim(), 'value');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-time', row).textContent.trim(), '10.00ms');

            case 12:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Rejected promise", function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
      var now, row;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 2:
              now = Date.now();
              _context4.next = 5;
              return triggerPort('promise:promisesUpdated', {
                promises: [generatePromise({
                  guid: 1,
                  label: 'Promise 1',
                  state: 'rejected',
                  reason: {
                    inspect: 'reason',
                    type: 'type-string'
                  },
                  createdAt: now,
                  settledAt: now + 20
                })]
              });

            case 5:

              assert.equal((0, _emberNativeDomHelpers.findAll)('.js-promise-tree-item').length, 1);
              row = (0, _emberNativeDomHelpers.find)('.js-promise-tree-item');

              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-label', row).textContent.trim(), 'Promise 1');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-state', row).textContent.trim(), 'Rejected');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-value', row).textContent.trim(), 'reason');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-time', row).textContent.trim(), '20.00ms');

            case 11:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Chained promises", function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
      var rows;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 2:
              _context5.next = 4;
              return triggerPort('promise:promisesUpdated', {
                promises: [generatePromise({
                  guid: 2,
                  parent: 1,
                  label: 'Child'
                }), generatePromise({
                  guid: 1,
                  children: [2],
                  label: 'Parent'
                })]
              });

            case 4:
              rows = (0, _emberNativeDomHelpers.findAll)('.js-promise-tree-item');

              assert.equal(rows.length, 1, 'Collpased by default');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-label', rows[0]).textContent.trim(), 'Parent');
              _context5.next = 9;
              return (0, _emberNativeDomHelpers.click)('.js-promise-label', rows[0]);

            case 9:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-promise-tree-item');
              assert.equal(rows.length, 2, 'Chain now expanded');
              assert.equal((0, _emberNativeDomHelpers.find)('.js-promise-label', rows[1]).textContent.trim(), 'Child');

            case 12:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x5) {
      return _ref5.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Can trace promise when there is a stack", function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 2:
              _context6.next = 4;
              return triggerPort('promise:promisesUpdated', {
                promises: [generatePromise({ guid: 1, hasStack: true })]
              });

            case 4:
              _context6.next = 6;
              return (0, _emberNativeDomHelpers.click)('.js-trace-promise-btn');

            case 6:

              assert.equal(name, 'promise:tracePromise');
              assert.deepEqual(message, { promiseId: 1 });

            case 8:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Trace button hidden if promise has no stack", function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 2:
              _context7.next = 4;
              return triggerPort('promise:promisesUpdated', {
                promises: [generatePromise({ guid: 1, hasStack: false })]
              });

            case 4:

              assert.notOk((0, _emberNativeDomHelpers.find)('.js-trace-promise-btn'));

            case 5:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    return function (_x7) {
      return _ref7.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Toggling promise trace option", function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(assert) {
      var input;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              assert.expect(3);

              _context8.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 3:
              input = (0, _emberNativeDomHelpers.find)('.js-with-stack input');

              assert.notOk(input.checked, 'should not be checked by default');
              _context8.next = 7;
              return (0, _emberNativeDomHelpers.click)(input);

            case 7:

              assert.equal(name, 'promise:setInstrumentWithStack');
              assert.equal(message.instrumentWithStack, true);

            case 9:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    return function (_x8) {
      return _ref8.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Logging error stack trace in the console", function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(assert) {
      var row;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 2:
              _context9.next = 4;
              return triggerPort('promise:promisesUpdated', {
                promises: [generatePromise({
                  guid: 1,
                  state: 'rejected',
                  reason: {
                    inspect: 'some error',
                    type: 'type-error'
                  }
                })]
              });

            case 4:
              row = (0, _emberNativeDomHelpers.find)('.js-promise-tree-item');

              assert.equal((0, _emberNativeDomHelpers.find)('.js-send-to-console-btn').textContent.trim(), 'Stack trace');
              _context9.next = 8;
              return (0, _emberNativeDomHelpers.click)('.js-send-to-console-btn', row);

            case 8:

              assert.equal(name, 'promise:sendValueToConsole');
              assert.deepEqual(message, { promiseId: 1 });

            case 10:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    return function (_x9) {
      return _ref9.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Send fulfillment value to console", function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(assert) {
      var row;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 2:
              _context10.next = 4;
              return triggerPort('promise:promisesUpdated', {
                promises: [generatePromise({
                  guid: 1,
                  state: 'fulfilled',
                  value: {
                    inspect: 'some string',
                    type: 'type-string'
                  }
                })]
              });

            case 4:
              row = (0, _emberNativeDomHelpers.find)('.js-promise-tree-item');
              _context10.next = 7;
              return (0, _emberNativeDomHelpers.click)('.js-send-to-console-btn', row);

            case 7:

              assert.equal(name, 'promise:sendValueToConsole');
              assert.deepEqual(message, { promiseId: 1 });

            case 9:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    return function (_x10) {
      return _ref10.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Sending objects to the object inspector", function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(assert) {
      var row;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/promise-tree');

            case 2:
              _context11.next = 4;
              return triggerPort('promise:promisesUpdated', {
                promises: [generatePromise({
                  guid: 1,
                  state: 'fulfilled',
                  value: {
                    inspect: 'Some Object',
                    type: 'type-ember-object',
                    objectId: 100
                  }
                })]
              });

            case 4:
              row = (0, _emberNativeDomHelpers.find)('.js-promise-tree-item');
              _context11.next = 7;
              return (0, _emberNativeDomHelpers.click)('.js-promise-object-value', row);

            case 7:

              assert.equal(name, 'objectInspector:inspectById');
              assert.deepEqual(message, { objectId: 100 });

            case 9:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, this);
    }));

    return function (_x11) {
      return _ref11.apply(this, arguments);
    };
  }());
});
define('ember-inspector/tests/acceptance/render-tree-test', ['ember-qunit', 'qunit', 'ember-inspector/tests/helpers/start-app', 'ember-native-dom-helpers'], function (_emberQunit, _qunit, _startApp, _emberNativeDomHelpers) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var App = void 0;

  var port = void 0;

  (0, _qunit.module)('Render Tree Tab', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)({
        adapter: 'basic'
      });
      port = App.__container__.lookup('port:main');
      port.reopen({
        send: function send() /*n, m*/{}
      });
    },
    afterEach: function afterEach() {
      Ember.run(App, App.destroy);
    }
  });

  function generateProfiles() {
    return [{
      name: 'First View Rendering',
      duration: 476.87,
      timestamp: new Date(2014, 5, 1, 13, 16, 22, 715).getTime(),
      children: [{
        name: 'Child view',
        duration: 0.36,
        timestamp: new Date(2014, 5, 1, 13, 16, 22, 581).getTime(),
        children: []
      }]
    }, {
      name: "Second View Rendering",
      duration: 10,
      timestamp: new Date(2014, 5, 1, 13, 16, 22, 759).getTime(),
      children: []
    }];
  }

  (0, _emberQunit.test)("No profiles collected", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              port.reopen({
                send: function send(n /*, m*/) {
                  if (n === 'render:watchProfiles') {
                    this.trigger('render:profilesAdded', {
                      profiles: []
                    });
                  }
                }
              });

              _context.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/render-tree');

            case 3:

              assert.notOk((0, _emberNativeDomHelpers.find)('.js-render-tree'), "no render tree");
              assert.ok((0, _emberNativeDomHelpers.find)('.js-render-tree-empty'), "Message about empty render tree shown");

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Renders the list correctly", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var rows;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              port.reopen({
                send: function send(n /*, m*/) {
                  if (n === 'render:watchProfiles') {
                    this.trigger('render:profilesAdded', {
                      profiles: generateProfiles()
                    });
                  }
                }
              });

              _context2.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/render-tree');

            case 3:

              assert.ok((0, _emberNativeDomHelpers.find)('.js-render-tree'));
              rows = (0, _emberNativeDomHelpers.findAll)('.js-render-profile-item');

              assert.equal(rows.length, 2, "Two rows are rendered initially");

              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-name', rows[0]).textContent.trim(), "First View Rendering");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-duration', rows[0]).textContent.trim(), "476.87ms");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-timestamp', rows[0]).textContent.trim(), "13:16:22:715");

              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-name', rows[1]).textContent.trim(), "Second View Rendering");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-duration', rows[1]).textContent.trim(), "10.00ms");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-timestamp', rows[1]).textContent.trim(), "13:16:22:759");

              _context2.next = 14;
              return (0, _emberNativeDomHelpers.click)('.js-render-main-cell', rows[0]);

            case 14:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-render-profile-item');
              assert.equal(rows.length, 3, "Child is shown below the parent");

              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-name', rows[1]).textContent.trim(), "Child view");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-duration', rows[1]).textContent.trim(), "0.36ms");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-timestamp', rows[1]).textContent.trim(), "13:16:22:581");

              _context2.next = 21;
              return (0, _emberNativeDomHelpers.click)('.js-render-main-cell', rows[0]);

            case 21:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-render-profile-item');
              assert.equal(rows.length, 2, "Child is hidden when parent collapses");

            case 23:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Searching the profiles", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var rows;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              port.reopen({
                send: function send(n /*, m*/) {
                  if (n === 'render:watchProfiles') {
                    this.trigger('render:profilesAdded', {
                      profiles: generateProfiles()
                    });
                  }
                }
              });

              _context3.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/render-tree');

            case 3:
              rows = (0, _emberNativeDomHelpers.findAll)('.js-render-profile-item');

              assert.equal(rows.length, 2, "Two rows are rendered initially");

              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-name', rows[0]).textContent.trim(), "First View Rendering");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-name', rows[1]).textContent.trim(), "Second View Rendering");

              _context3.next = 9;
              return (0, _emberNativeDomHelpers.fillIn)('.js-render-profiles-search input', 'first');

            case 9:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-render-profile-item');
              assert.equal(rows.length, 2, "The first parent is rendered with the child");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-name', rows[0]).textContent.trim(), "First View Rendering");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-name', rows[1]).textContent.trim(), "Child view");

              // Minimize to hide child view
              _context3.next = 15;
              return (0, _emberNativeDomHelpers.click)('.js-render-main-cell');

            case 15:
              _context3.next = 17;
              return (0, _emberNativeDomHelpers.fillIn)('.js-render-profiles-search input', '');

            case 17:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-render-profile-item');
              assert.equal(rows.length, 2, "filter is reset");

              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-name', rows[0]).textContent.trim(), "First View Rendering");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-name', rows[1]).textContent.trim(), "Second View Rendering");

              _context3.next = 23;
              return (0, _emberNativeDomHelpers.fillIn)('.js-render-profiles-search input', 'Second');

            case 23:

              rows = (0, _emberNativeDomHelpers.findAll)('.js-render-profile-item');
              assert.equal(rows.length, 1, "The second row is the only one showing");
              assert.equal((0, _emberNativeDomHelpers.find)('.js-render-profile-name', rows[0]).textContent.trim(), "Second View Rendering");

            case 26:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
});
define('ember-inspector/tests/acceptance/route-tree-test', ['exports', 'ember-qunit', 'qunit', 'ember-inspector/tests/helpers/start-app', 'ember-native-dom-helpers'], function (exports, _emberQunit, _qunit, _startApp, _emberNativeDomHelpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isObject = isObject;
  exports.deepAssign = deepAssign;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var App = void 0;
  var run = Ember.run;


  var port = void 0;

  (0, _qunit.module)('Route Tree Tab', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)({
        adapter: 'basic'
      });
      port = App.__container__.lookup('port:main');
    },
    afterEach: function afterEach() {
      run(App, App.destroy);
    }
  });

  function isObject(item) {
    return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item);
  }

  function deepAssign(target) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    if (!sources.length) return target;
    var source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (var key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, _defineProperty({}, key, {}));
          deepAssign(target[key], source[key]);
        } else {
          Object.assign(target, _defineProperty({}, key, source[key]));
        }
      }
    }

    return deepAssign.apply(undefined, [target].concat(sources));
  }

  function routeValue(name, props) {
    var value = {
      name: name,
      controller: {
        name: name,
        className: name.replace(/\./g, '_').classify() + 'Controller',
        exists: true
      },
      routeHandler: {
        name: name,
        className: name.replace(/\./g, '_').classify() + 'Route'
      },
      template: {
        name: name.replace(/\./g, '/')
      }
    };
    props = props || {};
    return deepAssign({}, value, props);
  }

  var routeTree = {
    value: routeValue('application'),
    children: [{
      value: routeValue('post', { controller: { exists: false } }),
      children: [{
        value: routeValue('post.new', { url: 'post/new' }),
        children: []
      }, {
        value: routeValue('post.edit', { url: 'post/edit' }),
        children: []
      }]
    }]
  };

  (0, _emberQunit.test)("Route tree is successfully displayed", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var routeNodes, routeNames, routeHandlers, controllers, templates, titleTips;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              port.reopen({
                send: function send(name /*, message*/) {
                  if (name === 'route:getTree') {
                    this.trigger('route:routeTree', { tree: routeTree });
                  }
                }
              });

              _context.next = 3;
              return (0, _emberNativeDomHelpers.visit)('route-tree');

            case 3:
              routeNodes = (0, _emberNativeDomHelpers.findAll)('.js-route-tree-item');

              assert.equal(routeNodes.length, 4);

              routeNames = [].concat(_toConsumableArray((0, _emberNativeDomHelpers.findAll)('.js-route-name'))).map(function (item) {
                return item.textContent.trim();
              });

              assert.deepEqual(routeNames, ['application', 'post', 'post.new', 'post.edit']);

              routeHandlers = [].concat(_toConsumableArray((0, _emberNativeDomHelpers.findAll)('.js-route-handler'))).map(function (item) {
                return item.textContent.trim();
              });

              assert.deepEqual(routeHandlers, ['ApplicationRoute', 'PostRoute', 'PostNewRoute', 'PostEditRoute']);

              controllers = [].concat(_toConsumableArray((0, _emberNativeDomHelpers.findAll)('.js-route-controller'))).map(function (item) {
                return item.textContent.trim();
              });


              assert.deepEqual(controllers, ['ApplicationController', 'PostController', 'PostNewController', 'PostEditController']);

              templates = [].concat(_toConsumableArray((0, _emberNativeDomHelpers.findAll)('.js-route-template'))).map(function (item) {
                return item.textContent.trim();
              });


              assert.deepEqual(templates, ['application', 'post', 'post/new', 'post/edit']);

              titleTips = [].concat(_toConsumableArray((0, _emberNativeDomHelpers.findAll)('span[title]', routeNodes))).map(function (n) {
                return n.getAttribute('title');
              }).sort();


              assert.deepEqual(titleTips, ["ApplicationController", "ApplicationRoute", "PostController", "PostEditController", "PostEditRoute", "PostNewController", "PostNewRoute", "PostRoute", "application", "application", "post", "post", "post.edit", "post.new", "post/edit", "post/edit", "post/new", "post/new"], 'expected title tips');

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Clicking on route handlers and controller sends an inspection message", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var name, message, applicationRow, postRow;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              name = void 0, message = void 0, applicationRow = void 0;


              port.reopen({
                send: function send(n, m) {
                  name = n;
                  message = m;

                  if (name === 'route:getTree') {
                    this.trigger('route:routeTree', { tree: routeTree });
                  }
                }
              });

              _context2.next = 4;
              return (0, _emberNativeDomHelpers.visit)('route-tree');

            case 4:
              name = null;
              message = null;
              applicationRow = (0, _emberNativeDomHelpers.find)('.js-route-tree-item');
              _context2.next = 9;
              return (0, _emberNativeDomHelpers.click)('.js-route-handler', applicationRow);

            case 9:
              assert.equal(name, 'objectInspector:inspectRoute');
              assert.equal(message.name, 'application');

              name = null;
              message = null;
              _context2.next = 15;
              return (0, _emberNativeDomHelpers.click)('.js-route-controller', applicationRow);

            case 15:
              assert.equal(name, 'objectInspector:inspectController');
              assert.equal(message.name, 'application');

              name = null;
              message = null;
              postRow = (0, _emberNativeDomHelpers.findAll)('.js-route-tree-item')[1];
              _context2.next = 22;
              return (0, _emberNativeDomHelpers.click)('.js-route-controller', postRow);

            case 22:
              assert.equal(name, null, "If controller does not exist, clicking should have no effect.");
              assert.equal(message, null);

            case 24:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Current Route is highlighted", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var routeNodes, isCurrent;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              port.reopen({
                send: function send(name /*, message*/) {
                  if (name === 'route:getTree') {
                    this.trigger('route:routeTree', { tree: routeTree });
                  } else if (name === 'route:getCurrentRoute') {
                    this.trigger('route:currentRoute', { name: 'post.edit' });
                  }
                }
              });

              routeNodes = void 0;
              _context3.next = 4;
              return (0, _emberNativeDomHelpers.visit)('route-tree');

            case 4:
              routeNodes = (0, _emberNativeDomHelpers.findAll)('.js-route-tree-item .js-route-name');
              isCurrent = [].concat(_toConsumableArray(routeNodes)).map(function (item) {
                return item.classList.contains('list__cell_highlight');
              });

              assert.deepEqual(isCurrent, [true, true, false, true]);

              run(function () {
                return port.trigger('route:currentRoute', { name: 'post.new' });
              });
              _context3.next = 10;
              return wait();

            case 10:
              routeNodes = (0, _emberNativeDomHelpers.findAll)('.js-route-tree-item .js-route-name');
              isCurrent = [].concat(_toConsumableArray(routeNodes)).map(function (item) {
                return item.classList.contains('list__cell_highlight');
              });
              assert.deepEqual(isCurrent, [true, true, true, false], 'Current route is bound');

            case 13:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Hiding non current route", function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
      var routeNodes, checkbox;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              port.reopen({
                send: function send(name /*, message*/) {
                  if (name === 'route:getTree') {
                    this.trigger('route:routeTree', { tree: routeTree });
                  } else if (name === 'route:getCurrentRoute') {
                    this.trigger('route:currentRoute', { name: 'post.edit' });
                  }
                }
              });

              _context4.next = 3;
              return (0, _emberNativeDomHelpers.visit)('route-tree');

            case 3:
              routeNodes = (0, _emberNativeDomHelpers.findAll)('.js-route-tree-item');

              assert.equal(routeNodes.length, 4);
              checkbox = (0, _emberNativeDomHelpers.find)('.js-filter-hide-routes input');

              checkbox.checked = true;
              _context4.next = 9;
              return (0, _emberNativeDomHelpers.triggerEvent)(checkbox, 'change');

            case 9:
              routeNodes = (0, _emberNativeDomHelpers.findAll)('.js-route-tree-item');
              assert.equal(routeNodes.length, 3);

            case 11:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
});
define('ember-inspector/tests/acceptance/view-tree-test', ['ember-qunit', 'qunit', 'ember-inspector/tests/helpers/start-app', 'ember-native-dom-helpers'], function (_emberQunit, _qunit, _startApp, _emberNativeDomHelpers) {
  'use strict';

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var App = void 0;
  var run = Ember.run;


  var port = void 0;

  (0, _qunit.module)('View Tree Tab', {
    beforeEach: function beforeEach() {
      App = (0, _startApp.default)({
        adapter: 'basic'
      });
      port = App.__container__.lookup('port:main');
    },
    afterEach: function afterEach() {
      Ember.run(App, App.destroy);
    }
  });

  function textFor(selector, context) {
    return (0, _emberNativeDomHelpers.find)(selector, context).textContent.trim();
  }

  var treeId = 0;
  function viewNodeFactory(props) {
    if (!props.template) {
      props.template = props.name;
    }
    var obj = {
      value: props,
      children: [],
      treeId: ++treeId
    };
    return obj;
  }

  function viewTreeFactory(tree) {
    var children = tree.children;
    delete tree.children;
    var viewNode = viewNodeFactory(tree);
    if (children) {
      for (var i = 0; i < children.length; i++) {
        viewNode.children.push(viewTreeFactory(children[i]));
      }
    }
    return viewNode;
  }

  function defaultViewTree() {
    return viewTreeFactory({
      name: 'application',
      isVirtual: false,
      isComponent: false,
      objectId: 'applicationView',
      viewClass: 'App.ApplicationView',
      completeViewClass: 'App.ApplicationView',
      duration: 10,
      controller: {
        name: 'App.ApplicationController',
        completeName: 'App.ApplicationController',
        objectId: 'applicationController'
      },
      children: [{
        name: 'posts',
        isVirtual: false,
        isComponent: false,
        viewClass: 'App.PostsView',
        completeViewClass: 'App.PostsView',
        duration: 1,
        objectId: 'postsView',
        model: {
          name: 'PostsArray',
          completeName: 'PostsArray',
          objectId: 'postsArray',
          type: 'type-ember-object'
        },
        controller: {
          name: 'App.PostsController',
          completeName: 'App.PostsController',
          objectId: 'postsController'
        },
        children: []
      }, {
        name: 'comments',
        isVirtual: false,
        isComponent: false,
        viewClass: 'App.CommentsView',
        completeViewClass: 'App.CommentsView',
        duration: 2.5,
        objectId: 'commentsView',
        model: {
          name: 'CommentsArray',
          completeName: 'CommentsArray',
          objectId: 'commentsArray',
          type: 'type-ember-object'
        },
        controller: {
          name: 'App.CommentsController',
          completeName: 'App.CommentsController',
          objectId: 'commentsController'
        },
        children: []
      }]
    });
  }

  (0, _emberQunit.test)("It should correctly display the view tree", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var viewTree, treeNodes, controllerNames, templateNames, modelNames, viewClassNames, durations, titleTips;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              viewTree = defaultViewTree();
              _context.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 3:
              run(function () {
                port.trigger('view:viewTree', { tree: viewTree });
              });
              _context.next = 6;
              return wait();

            case 6:
              treeNodes = (0, _emberNativeDomHelpers.findAll)('.js-view-tree-item');

              assert.equal(treeNodes.length, 3, 'expected some tree nodes');

              controllerNames = [];
              templateNames = [];
              modelNames = [];
              viewClassNames = [];
              durations = [];


              [].concat(_toConsumableArray(treeNodes)).forEach(function (node) {
                templateNames.push(textFor('.js-view-template', node));
                controllerNames.push(textFor('.js-view-controller', node));
                viewClassNames.push(textFor('.js-view-class', node));
                modelNames.push(textFor('.js-view-model', node));
                durations.push(textFor('.js-view-duration', node));
              });

              assert.deepEqual(controllerNames, ['App.ApplicationController', 'App.PostsController', 'App.CommentsController'], 'expected controller names');

              assert.deepEqual(templateNames, ['application', 'posts', 'comments'], 'expected template names');

              assert.deepEqual(modelNames, ['--', 'PostsArray', 'CommentsArray'], 'expected model names');

              assert.deepEqual(viewClassNames, ['App.ApplicationView', 'App.PostsView', 'App.CommentsView'], 'expected view class names');

              assert.deepEqual(durations, ['10.00ms', '1.00ms', '2.50ms'], 'expected render durations');

              titleTips = [].concat(_toConsumableArray((0, _emberNativeDomHelpers.findAll)('span[title]'))).map(function (node) {
                return node.getAttribute('title');
              }).sort();


              assert.deepEqual(titleTips, ['App.ApplicationController', 'App.ApplicationView', 'App.CommentsController', 'App.CommentsView', 'App.PostsController', 'App.PostsView', 'CommentsArray', 'PostsArray', 'application', 'application', 'comments', 'comments', 'posts', 'posts'], 'expected title tips');

            case 21:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("It should filter the view tree using the search text", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var viewTree, treeNodes, controllerNames, templateNames, modelNames, viewClassNames, durations, titleTips;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              viewTree = defaultViewTree();
              _context2.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 3:
              run(function () {
                port.trigger('view:viewTree', { tree: viewTree });
              });
              _context2.next = 6;
              return wait();

            case 6:
              treeNodes = (0, _emberNativeDomHelpers.findAll)('.js-view-tree-item');

              assert.equal(treeNodes.length, 3, 'expected some tree nodes');

              _context2.next = 10;
              return (0, _emberNativeDomHelpers.fillIn)('.js-filter-views input', 'post');

            case 10:
              treeNodes = (0, _emberNativeDomHelpers.findAll)('.js-view-tree-item');
              assert.equal(treeNodes.length, 1, 'expected filtered tree nodes');

              controllerNames = [];
              templateNames = [];
              modelNames = [];
              viewClassNames = [];
              durations = [];


              [].concat(_toConsumableArray(treeNodes)).forEach(function (node) {
                templateNames.push(textFor('.js-view-template', node));
                controllerNames.push(textFor('.js-view-controller', node));
                viewClassNames.push(textFor('.js-view-class', node));
                modelNames.push(textFor('.js-view-model', node));
                durations.push(textFor('.js-view-duration', node));
              });

              assert.deepEqual(controllerNames, ['App.PostsController'], 'expected controller names');

              assert.deepEqual(templateNames, ['posts'], 'expected template names');

              assert.deepEqual(modelNames, ['PostsArray'], 'expected model names');

              assert.deepEqual(viewClassNames, ['App.PostsView'], 'expected view class names');

              assert.deepEqual(durations, ['1.00ms'], 'expected render durations');

              titleTips = [].concat(_toConsumableArray((0, _emberNativeDomHelpers.findAll)('span[title]'))).map(function (node) {
                return node.getAttribute('title');
              }).sort();


              assert.deepEqual(titleTips, ['App.PostsController', 'App.PostsView', 'PostsArray', 'posts', 'posts'], 'expected title tips');

            case 25:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("It should update the view tree when the port triggers a change", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var treeNodes, viewTree, viewControllersEls;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              assert.expect(4);
              treeNodes = void 0, viewTree = defaultViewTree();
              _context3.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 4:
              run(function () {
                return port.trigger('view:viewTree', { tree: viewTree });
              });
              _context3.next = 7;
              return wait();

            case 7:

              treeNodes = (0, _emberNativeDomHelpers.findAll)('.js-view-tree-item');
              assert.equal(treeNodes.length, 3);
              viewControllersEls = (0, _emberNativeDomHelpers.findAll)('.js-view-controller');

              assert.equal(viewControllersEls[viewControllersEls.length - 1].textContent.trim(), 'App.CommentsController');

              viewTree = defaultViewTree();
              viewTree.children.splice(0, 1);
              viewTree.children[0].value.controller.name = 'App.SomeController';
              run(function () {
                return port.trigger('view:viewTree', { tree: viewTree });
              });
              _context3.next = 17;
              return wait();

            case 17:
              treeNodes = (0, _emberNativeDomHelpers.findAll)('.js-view-tree-item');
              assert.equal(treeNodes.length, 2);
              viewControllersEls = (0, _emberNativeDomHelpers.findAll)('.js-view-controller');
              assert.equal(viewControllersEls[viewControllersEls.length - 1].textContent.trim(), 'App.SomeController');

            case 21:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Previewing / showing a view on the client", function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
      var messageSent, viewTree;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              messageSent = null;

              port.reopen({
                send: function send(name, message) {
                  messageSent = { name: name, message: message };
                }
              });

              _context4.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 4:
              viewTree = defaultViewTree();

              viewTree.children = [];
              run(function () {
                return port.trigger('view:viewTree', { tree: viewTree });
              });
              _context4.next = 9;
              return wait();

            case 9:
              _context4.next = 11;
              return (0, _emberNativeDomHelpers.triggerEvent)('.js-view-tree-item', 'mouseover');

            case 11:
              assert.equal(messageSent.name, 'view:previewLayer', "Client asked to preview layer");
              assert.equal(messageSent.message.objectId, 'applicationView', "Client sent correct id to preview layer");
              _context4.next = 15;
              return (0, _emberNativeDomHelpers.triggerEvent)('.js-view-tree-item', 'mouseout');

            case 15:
              assert.equal(messageSent.name, 'view:hidePreview', "Client asked to hide preview");

            case 16:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Inspecting views on hover", function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
      var messageSent;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              messageSent = null;

              port.reopen({
                send: function send(name, message) {
                  messageSent = { name: name, message: message };
                }
              });

              _context5.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 4:
              _context5.next = 6;
              return (0, _emberNativeDomHelpers.click)('.js-inspect-views');

            case 6:
              assert.equal(messageSent.name, 'view:inspectViews');
              assert.deepEqual(messageSent.message, { inspect: true });
              run(function () {
                return port.trigger('view:startInspecting');
              });
              _context5.next = 11;
              return wait();

            case 11:
              _context5.next = 13;
              return (0, _emberNativeDomHelpers.click)('.js-inspect-views');

            case 13:
              assert.equal(messageSent.name, 'view:inspectViews');
              assert.deepEqual(messageSent.message, { inspect: false });

            case 15:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x5) {
      return _ref5.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Configuring which views to show", function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
      var messageSent;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              messageSent = null;

              port.reopen({
                send: function send(name, message) {
                  messageSent = { name: name, message: message };
                }
              });

              _context6.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 4:
              _context6.next = 6;
              return (0, _emberNativeDomHelpers.click)('.js-filter-components input');

            case 6:
              assert.equal(messageSent.name, 'view:setOptions');
              assert.deepEqual(messageSent.message.options, { components: true });
              assert.equal(messageSent.name, 'view:setOptions');
              assert.deepEqual(messageSent.message.options, { components: true });

            case 10:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  }());

  (0, _emberQunit.test)("Inspecting a model", function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
      var messageSent, tree, model;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              messageSent = null;

              port.reopen({
                send: function send(name, message) {
                  messageSent = { name: name, message: message };
                }
              });

              _context7.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 4:
              tree = defaultViewTree();

              run(function () {
                port.trigger('view:viewTree', { tree: tree });
              });
              _context7.next = 8;
              return wait();

            case 8:
              model = (0, _emberNativeDomHelpers.find)('.js-view-model-clickable');
              _context7.next = 11;
              return (0, _emberNativeDomHelpers.click)(model);

            case 11:
              assert.equal(messageSent.name, 'objectInspector:inspectById');
              assert.equal(messageSent.message.objectId, 'postsArray');

            case 13:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    return function (_x7) {
      return _ref7.apply(this, arguments);
    };
  }());
});
define('ember-inspector/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/basic.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/basic.js should pass ESLint\n\n');
  });

  QUnit.test('adapters/bookmarklet.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/bookmarklet.js should pass ESLint\n\n');
  });

  QUnit.test('adapters/chrome.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/chrome.js should pass ESLint\n\n');
  });

  QUnit.test('adapters/firefox.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/firefox.js should pass ESLint\n\n');
  });

  QUnit.test('adapters/web-extension.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/web-extension.js should pass ESLint\n\n');
  });

  QUnit.test('adapters/websocket.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/websocket.js should pass ESLint\n\n');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/action-checkbox.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/action-checkbox.js should pass ESLint\n\n');
  });

  QUnit.test('components/clear-button.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/clear-button.js should pass ESLint\n\n');
  });

  QUnit.test('components/container-instance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/container-instance.js should pass ESLint\n\n');
  });

  QUnit.test('components/date-property-field.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/date-property-field.js should pass ESLint\n\n');
  });

  QUnit.test('components/deprecation-item-source.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/deprecation-item-source.js should pass ESLint\n\n');
  });

  QUnit.test('components/deprecation-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/deprecation-item.js should pass ESLint\n\n');
  });

  QUnit.test('components/drag-handle.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/drag-handle.js should pass ESLint\n\n');
  });

  QUnit.test('components/draggable-column.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/draggable-column.js should pass ESLint\n\n');
  });

  QUnit.test('components/icon-button.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/icon-button.js should pass ESLint\n\n');
  });

  QUnit.test('components/iframe-picker.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/iframe-picker.js should pass ESLint\n\n');
  });

  QUnit.test('components/main-content.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/main-content.js should pass ESLint\n\n');
  });

  QUnit.test('components/mixin-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/mixin-detail.js should pass ESLint\n\n');
  });

  QUnit.test('components/mixin-details.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/mixin-details.js should pass ESLint\n\n');
  });

  QUnit.test('components/mixin-property.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/mixin-property.js should pass ESLint\n\n');
  });

  QUnit.test('components/object-inspector.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/object-inspector.js should pass ESLint\n\n');
  });

  QUnit.test('components/promise-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/promise-item.js should pass ESLint\n\n');
  });

  QUnit.test('components/property-field.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/property-field.js should pass ESLint\n\n');
  });

  QUnit.test('components/record-filter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/record-filter.js should pass ESLint\n\n');
  });

  QUnit.test('components/record-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/record-item.js should pass ESLint\n\n');
  });

  QUnit.test('components/reload-button.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/reload-button.js should pass ESLint\n\n');
  });

  QUnit.test('components/render-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/render-item.js should pass ESLint\n\n');
  });

  QUnit.test('components/resizable-column.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/resizable-column.js should pass ESLint\n\n');
  });

  QUnit.test('components/route-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/route-item.js should pass ESLint\n\n');
  });

  QUnit.test('components/send-to-console.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/send-to-console.js should pass ESLint\n\n');
  });

  QUnit.test('components/sidebar-toggle.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/sidebar-toggle.js should pass ESLint\n\n');
  });

  QUnit.test('components/view-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/view-item.js should pass ESLint\n\n');
  });

  QUnit.test('components/x-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/x-app.js should pass ESLint\n\n');
  });

  QUnit.test('components/x-list-cell.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/x-list-cell.js should pass ESLint\n\n');
  });

  QUnit.test('components/x-list-content.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/x-list-content.js should pass ESLint\n\n');
  });

  QUnit.test('components/x-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/x-list.js should pass ESLint\n\n');
  });

  QUnit.test('computed/debounce.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'computed/debounce.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/application.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/container-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/container-type.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/container-types.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/container-types.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/deprecations.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/deprecations.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/info.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/info.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/model-types.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/model-types.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/promise-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/promise-tree.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/records.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/records.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/render-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/render-tree.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/route-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/route-tree.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/view-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/view-tree.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/build-style.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/build-style.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/escape-url.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/escape-url.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/ms-to-time.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/ms-to-time.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/one-way.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/one-way.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/schema-for.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/schema-for.js should pass ESLint\n\n');
  });

  QUnit.test('libs/promise-assembler.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'libs/promise-assembler.js should pass ESLint\n\n');
  });

  QUnit.test('libs/resizable-columns.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'libs/resizable-columns.js should pass ESLint\n\n');
  });

  QUnit.test('mixins/row-events.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/row-events.js should pass ESLint\n\n');
  });

  QUnit.test('models/promise.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/promise.js should pass ESLint\n\n');
  });

  QUnit.test('port.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'port.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/app-detected.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/app-detected.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });

  QUnit.test('routes/container-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/container-type.js should pass ESLint\n\n');
  });

  QUnit.test('routes/container-types.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/container-types.js should pass ESLint\n\n');
  });

  QUnit.test('routes/container-types/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/container-types/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/data/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/data/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/deprecations.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/deprecations.js should pass ESLint\n\n');
  });

  QUnit.test('routes/info.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/info.js should pass ESLint\n\n');
  });

  QUnit.test('routes/model-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/model-type.js should pass ESLint\n\n');
  });

  QUnit.test('routes/model-types.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/model-types.js should pass ESLint\n\n');
  });

  QUnit.test('routes/promise-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/promise-tree.js should pass ESLint\n\n');
  });

  QUnit.test('routes/records.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/records.js should pass ESLint\n\n');
  });

  QUnit.test('routes/render-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/render-tree.js should pass ESLint\n\n');
  });

  QUnit.test('routes/route-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/route-tree.js should pass ESLint\n\n');
  });

  QUnit.test('routes/tab.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/tab.js should pass ESLint\n\n');
  });

  QUnit.test('routes/view-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/view-tree.js should pass ESLint\n\n');
  });

  QUnit.test('schemas/info-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'schemas/info-list.js should pass ESLint\n\n');
  });

  QUnit.test('schemas/promise-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'schemas/promise-tree.js should pass ESLint\n\n');
  });

  QUnit.test('schemas/render-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'schemas/render-tree.js should pass ESLint\n\n');
  });

  QUnit.test('schemas/route-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'schemas/route-tree.js should pass ESLint\n\n');
  });

  QUnit.test('schemas/view-tree.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'schemas/view-tree.js should pass ESLint\n\n');
  });

  QUnit.test('services/layout.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/layout.js should pass ESLint\n\n');
  });

  QUnit.test('services/storage/local.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/storage/local.js should pass ESLint\n\n');
  });

  QUnit.test('services/storage/memory.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/storage/memory.js should pass ESLint\n\n');
  });

  QUnit.test('utils/check-current-route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/check-current-route.js should pass ESLint\n\n');
  });

  QUnit.test('utils/compare-arrays.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/compare-arrays.js should pass ESLint\n\n');
  });

  QUnit.test('utils/escape-reg-exp.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/escape-reg-exp.js should pass ESLint\n\n');
  });

  QUnit.test('utils/search-match.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/search-match.js should pass ESLint\n\n');
  });
});
define('ember-inspector/tests/ember_debug/container-debug-test', ['qunit', 'ember-native-dom-helpers', 'require'], function (_qunit, _emberNativeDomHelpers, _require2) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var run = Ember.run,
      emberA = Ember.A,
      Application = Ember.Application;

  var EmberDebug = void 0;
  var port = void 0,
      name = void 0,
      message = void 0;
  var App = void 0;

  function setupApp() {
    App = Application.create();
    App.setupForTesting();
    App.injectTestHelpers();

    App.Router.map(function () {
      this.route('simple');
    });
  }

  (0, _qunit.module)("Container Debug", {
    beforeEach: function beforeEach() {
      EmberDebug = (0, _require2.default)('ember-debug/main').default;
      EmberDebug.Port = EmberDebug.Port.extend({
        init: function init() {},
        send: function send(n, m) {
          name = n;
          message = m;
        }
      });
      run(function () {
        setupApp();
        EmberDebug.set('application', App);
      });
      run(EmberDebug, 'start');
      port = EmberDebug.port;
    },
    afterEach: function afterEach() {
      name = null;
      message = null;
      EmberDebug.destroyContainer();
      run(App, 'destroy');
    }
  });

  (0, _qunit.test)("#getTypes", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var types;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 2:

              port.trigger('container:getTypes');
              _context.next = 5;
              return wait();

            case 5:

              assert.equal(name, 'container:types');
              types = emberA(message.types);

              assert.ok(types.findBy('name', 'controller'));
              assert.ok(types.findBy('name', 'route'));

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function t(_x) {
      return _ref.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)("#getInstances", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var instances;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 2:

              port.trigger('container:getInstances', { containerType: 'controller' });
              _context2.next = 5;
              return wait();

            case 5:

              assert.equal(name, 'container:instances');
              instances = emberA(message.instances);

              assert.ok(instances.findBy('name', 'simple'));

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function t(_x2) {
      return _ref2.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)("#getInstances on a non existing type", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 2:

              port.trigger('container:getInstances', { containerType: 'not-here' });
              _context3.next = 5;
              return wait();

            case 5:

              assert.equal(name, 'container:instances');
              assert.equal(message.status, 404);

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function t(_x3) {
      return _ref3.apply(this, arguments);
    }

    return t;
  }());
});
define('ember-inspector/tests/ember_debug/deprecation-debug-test', ['qunit', 'ember-native-dom-helpers', 'require'], function (_qunit, _emberNativeDomHelpers, _require2) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var RSVP = Ember.RSVP,
      run = Ember.run;

  var EmberDebug = (0, _require2.default)("ember-debug/main").default;

  var port = void 0;
  var App = void 0;

  function setupApp() {
    App = Ember.Application.create();
    App.injectTestHelpers();
    App.setupForTesting();
  }

  (0, _qunit.module)("Deprecation Debug", {
    beforeEach: function beforeEach() {
      EmberDebug.Port = EmberDebug.Port.extend({
        init: function init() {},
        send: function send() /*n, m*/{}
      });
      run(function () {
        setupApp();
        EmberDebug.set('application', App);
      });
      run(EmberDebug, 'start');
      port = EmberDebug.port;
      EmberDebug.IGNORE_DEPRECATIONS = true;
      EmberDebug.deprecationDebug.reopen({
        fetchSourceMap: function fetchSourceMap() {
          return RSVP.resolve(null);
        },

        emberCliConfig: null
      });
    },
    afterEach: function afterEach() {
      EmberDebug.destroyContainer();
      Ember.run(App, 'destroy');
    }
  });

  (0, _qunit.test)("deprecations are caught and sent", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var messages, deprecations, deprecation, count;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              messages = [];

              port.reopen({
                send: function send(name, message) {
                  messages.push({ name: name, message: message });
                }
              });

              App.ApplicationRoute = Ember.Route.extend({
                setupController: function setupController() {
                  EmberDebug.IGNORE_DEPRECATIONS = false;
                  Ember.deprecate('Deprecation 1');
                  Ember.deprecate('Deprecation 2', false, { url: 'http://www.emberjs.com' });
                  Ember.deprecate('Deprecation 1');
                  EmberDebug.IGNORE_DEPRECATIONS = true;
                }
              });

              run(port, 'trigger', 'deprecation:watch');
              _context.next = 6;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 6:
              deprecations = messages.filterBy('name', 'deprecation:deprecationsAdded').get('lastObject').message.deprecations;

              assert.equal(deprecations.length, 2);
              deprecation = deprecations[0];

              assert.equal(deprecation.count, 2, 'Correctly combined');
              assert.equal(deprecation.message, 'Deprecation 1');
              assert.equal(deprecation.sources.length, 2, 'Correctly separated by source');
              deprecation = deprecations[1];
              assert.equal(deprecation.count, 1);
              assert.equal(deprecation.message, 'Deprecation 2');
              assert.equal(deprecation.sources.length, 1);
              assert.equal(deprecation.url, 'http://www.emberjs.com');

              count = messages.filterBy('name', 'deprecation:count').get('lastObject').message.count;

              assert.equal(count, 3, 'count correctly sent');

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function t(_x) {
      return _ref.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)('Warns once about deprecations', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var count;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              assert.expect(2);
              count = 0;

              run(port, 'trigger', 'deprecation:watch');
              port.get('adapter').reopen({
                warn: function warn(message) {
                  assert.equal(message, 'Deprecations were detected, see the Ember Inspector deprecations tab for more details.');
                  assert.equal(++count, 1, 'Warns once');
                }
              });
              App.ApplicationRoute = Ember.Route.extend({
                setupController: function setupController() {
                  EmberDebug.IGNORE_DEPRECATIONS = false;
                  Ember.deprecate('Deprecation 1');
                  Ember.deprecate('Deprecation 2');
                  EmberDebug.IGNORE_DEPRECATIONS = true;
                }
              });
              _context2.next = 7;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 7:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function t(_x2) {
      return _ref2.apply(this, arguments);
    }

    return t;
  }());
});
define('ember-inspector/tests/ember_debug/ember-debug-test', ['qunit', 'require'], function (_qunit, _require2) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var name = void 0;
  /* eslint no-empty:0 */


  var EmberDebug = void 0;
  var port = void 0,
      adapter = void 0;
  var run = Ember.run,
      Application = Ember.Application,
      EmberObject = Ember.Object;

  var App = void 0;
  var EmberInspector = void 0;

  function setupApp() {
    App = Application.create();
    App.setupForTesting();
    App.injectTestHelpers();
  }

  (0, _qunit.module)("Ember Debug", {
    beforeEach: function beforeEach() {
      EmberDebug = (0, _require2.default)('ember-debug/main').default;
      EmberDebug.Port = EmberDebug.Port.extend({
        init: function init() {},
        send: function send(n /*, m*/) {
          name = n;
        }
      });
      run(function () {
        setupApp();
        EmberDebug.set('application', App);
      });
      run(EmberDebug, 'start');
      EmberInspector = EmberDebug;
      port = EmberDebug.port;
      adapter = EmberDebug.get('port.adapter');
    },
    afterEach: function afterEach() {
      name = null;
      EmberDebug.destroyContainer();
      run(App, 'destroy');
    }
  });

  function cantSend(obj, assert) {
    try {
      EmberInspector.inspect(obj);
      assert.ok(false);
    } catch (e) {}
  }

  (0, _qunit.test)("EmberInspector#inspect sends inspectable objects", function (assert) {
    var obj = EmberObject.create();
    EmberInspector.inspect(obj);
    assert.equal(name, "objectInspector:updateObject");
    name = null;
    obj = [];
    EmberInspector.inspect(obj);
    assert.equal(name, "objectInspector:updateObject");
    cantSend(1, assert);
    cantSend({}, assert);
    cantSend("a", assert);
    cantSend(null, assert);
  });

  (0, _qunit.test)("Errors are caught and handled by EmberDebug", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var error, handleError;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              assert.expect(1);
              error = new Error('test error');

              port.on('test:errors', function () {
                throw error;
              });

              handleError = adapter.handleError;

              adapter.reopen({
                handleError: function handleError(e) {
                  assert.equal(e, error, 'Error handled');
                }
              });

              port.messageReceived('test:errors', {});

              _context.next = 8;
              return wait();

            case 8:
              adapter.reopen({ handleError: handleError });

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function t(_x) {
      return _ref.apply(this, arguments);
    }

    return t;
  }());
});
define('ember-inspector/tests/ember_debug/object-inspector-test', ['qunit', 'ember-new-computed', 'ember-native-dom-helpers', 'require'], function (_qunit, _emberNewComputed, _emberNativeDomHelpers, _require2) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var EmberDebug = void 0;
  var port = void 0,
      name = void 0,
      message = void 0;
  var App = void 0;
  var objectInspector = void 0;

  var run = Ember.run,
      guidFor = Ember.guidFor,
      EmberObject = Ember.Object;


  function setupApp() {
    App = Ember.Application.create();
    App.setupForTesting();
    App.injectTestHelpers();

    App.Router.map(function () {
      this.route('simple');
    });

    App.XSimpleComponent = Ember.Component;

    Ember.TEMPLATES.simple = Ember.HTMLBars.template({
      "id": "M/cd2+sO",
      "block": "{\"statements\":[[0,\"Simple \"],[1,[33,[\"input\"],null,[[\"class\"],[\"simple-input\"]]],false],[0,\" \"],[1,[33,[\"x-simple\"],null,[[\"class\"],[\"simple-view\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    });
  }

  var ignoreErrors = true;
  var defaultRootForFinder = void 0;
  (0, _qunit.module)("Ember Debug - Object Inspector", {
    // eslint-disable-next-line object-shorthand
    beforeEach: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                EmberDebug = (0, _require2.default)('ember-debug/main').default;
                EmberDebug.Port = EmberDebug.Port.extend({
                  init: function init() {},
                  send: function send(n, m) {
                    if (ignoreErrors && n.match(/[Ee]rror/)) {
                      return;
                    }
                    name = n;
                    message = m;
                  }
                });
                run(function () {
                  setupApp();
                  EmberDebug.set('application', App);
                });
                run(EmberDebug, 'start');
                _context.next = 6;
                return wait();

              case 6:
                objectInspector = EmberDebug.get('objectInspector');
                port = EmberDebug.port;
                defaultRootForFinder = _emberNativeDomHelpers.settings.rootElement;
                _emberNativeDomHelpers.settings.rootElement = 'body';

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function beforeEach() {
        return _ref2.apply(this, arguments);
      }

      return beforeEach;
    }(),
    afterEach: function afterEach() {
      _emberNativeDomHelpers.settings.rootElement = defaultRootForFinder;
      name = null;
      message = null;
      EmberDebug.destroyContainer();
      run(App, 'destroy');
    }
  });

  (0, _qunit.test)("An Ember Object is correctly transformed into an inspection hash", function (assert) {
    var date = new Date();

    var Parent = Ember.Object.extend({
      id: null,
      name: 'My Object'
    });

    Parent.reopenClass({
      toString: function toString() {
        return 'Parent Object';
      }
    });

    var inspected = Parent.create({
      id: 1,
      toString: function toString() {
        return 'Object:' + this.get('name');
      },

      nullVal: null,
      dateVal: date
    });

    objectInspector.sendObject(inspected);

    assert.equal(name, 'objectInspector:updateObject');

    assert.equal(message.name, 'Object:My Object');

    var firstDetail = message.details[0];
    assert.equal(firstDetail.name, 'Own Properties');

    assert.equal(firstDetail.properties.length, 3, 'methods are not included');

    var idProperty = firstDetail.properties[0];
    assert.equal(idProperty.name, 'id');
    assert.equal(idProperty.value.type, 'type-number');
    assert.equal(idProperty.value.inspect, '1');

    var nullProperty = firstDetail.properties[1];
    assert.equal(nullProperty.name, 'nullVal');
    assert.equal(nullProperty.value.type, 'type-null');
    assert.equal(nullProperty.value.inspect, 'null');

    var prop = firstDetail.properties[2];
    assert.equal(prop.name, 'dateVal');
    assert.equal(prop.value.type, 'type-date');
    assert.equal(prop.value.inspect, date.toString());

    var secondDetail = message.details[1];
    assert.equal(secondDetail.name, 'Parent Object');

    idProperty = secondDetail.properties[0];
    assert.equal(idProperty.name, 'id');
    assert.equal(idProperty.overridden, 'Own Properties');

    var nameProperty = secondDetail.properties[1];
    assert.equal(nameProperty.name, 'name');
    assert.equal(nameProperty.value.inspect, 'My Object');
  });

  (0, _qunit.test)("Computed properties are correctly calculated", function (assert) {
    var inspected = Ember.Object.extend({
      hi: (0, _emberNewComputed.default)(function () {
        return 'Hello';
      }).property(),
      _debugInfo: function _debugInfo() {
        return {
          propertyInfo: {
            expensiveProperties: ['hi']
          }
        };
      }
    }).create();

    objectInspector.sendObject(inspected);

    var computedProperty = message.details[1].properties[0];

    assert.equal(computedProperty.name, 'hi');
    assert.ok(computedProperty.value.computed);
    assert.equal(computedProperty.value.type, 'type-descriptor');
    assert.equal(computedProperty.value.inspect, '<computed>');

    var id = message.objectId;

    port.trigger('objectInspector:calculate', {
      objectId: id,
      property: 'hi',
      mixinIndex: 1
    });

    assert.equal(name, 'objectInspector:updateProperty');
    assert.equal(message.objectId, id);
    assert.equal(message.property, 'hi');
    assert.equal(message.mixinIndex, 1);
    assert.equal(message.value.type, 'type-string');
    assert.equal(message.value.inspect, 'Hello');
    assert.ok(message.value.computed);
  });

  (0, _qunit.test)("Cached Computed properties are pre-calculated", function (assert) {
    var inspected = Ember.Object.extend({
      hi: (0, _emberNewComputed.default)(function () {
        return 'Hello';
      }).property()
    }).create();

    // pre-calculate CP
    inspected.get('hi');

    objectInspector.sendObject(inspected);

    var computedProperty = message.details[1].properties[0];

    assert.equal(computedProperty.name, 'hi');
    assert.ok(computedProperty.value.computed);
    assert.equal(computedProperty.value.type, 'type-string');
    assert.equal(computedProperty.value.inspect, 'Hello');
  });

  (0, _qunit.test)("Properties are correctly bound", function (assert) {
    var inspected = Ember.Object.extend({
      name: 'Teddy',

      hi: (0, _emberNewComputed.default)({
        get: function get() {
          return 'hello';
        },
        set: function set(key, val) {
          return val;
        }
      }),

      _debugInfo: function _debugInfo() {
        return {
          propertyInfo: {
            expensiveProperties: ['hi']
          }
        };
      }
    }).create();

    objectInspector.sendObject(inspected);

    var id = message.objectId;

    inspected.set('name', 'Alex');

    assert.equal(name, 'objectInspector:updateProperty');

    assert.equal(message.objectId, id);
    assert.equal(message.property, 'name');
    assert.equal(message.mixinIndex, 1);
    assert.equal(message.value.computed, false);
    assert.equal(message.value.inspect, 'Alex');
    assert.equal(message.value.type, 'type-string');

    // un-cached computed properties are not bound until calculated

    message = null;

    inspected.set('hi', 'Hey');

    assert.equal(message, null, 'Computed properties are not bound as long as they haven\'t been calculated');

    port.trigger('objectInspector:calculate', {
      objectId: id,
      property: 'hi',
      mixinIndex: 1
    });

    message = null;
    inspected.set('hi', 'Hello!');

    assert.equal(message.objectId, id);
    assert.equal(message.property, 'hi');
    assert.equal(message.mixinIndex, 1);
    assert.ok(message.value.computed);
    assert.equal(message.value.inspect, 'Hello!');
    assert.equal(message.value.type, 'type-string');
  });

  (0, _qunit.test)("Properties can be updated through a port message", function (assert) {
    var inspected = Ember.Object.extend({
      name: 'Teddy'
    }).create();

    objectInspector.sendObject(inspected);

    var id = message.objectId;

    port.trigger('objectInspector:saveProperty', {
      objectId: id,
      mixinIndex: 1,
      property: 'name',
      value: 'Alex'
    });

    assert.equal(inspected.get('name'), 'Alex');

    // A property updated message is published
    assert.equal(name, 'objectInspector:updateProperty');
    assert.equal(message.property, 'name');
    assert.equal(message.value.inspect, 'Alex');
    assert.equal(message.value.type, 'type-string');
  });

  (0, _qunit.test)("Date properties are converted to dates before being updated", function (assert) {
    var newDate = new Date(2015, 0, 1);

    var inspected = Ember.Object.extend({
      date: null
    }).create();

    objectInspector.sendObject(inspected);

    var id = message.objectId;

    port.trigger('objectInspector:saveProperty', {
      objectId: id,
      mixinIndex: 1,
      property: 'date',
      value: newDate.getTime(),
      dataType: 'date'
    });

    assert.equal(inspected.get('date').getFullYear(), 2015);
    assert.equal(inspected.get('date').getMonth(), 0);
    assert.equal(inspected.get('date').getDate(), 1);
  });

  (0, _qunit.test)("Property grouping can be customized using _debugInfo", function (assert) {
    var mixinToSkip = Ember.Mixin.create({});
    mixinToSkip[Ember.NAME_KEY] = 'MixinToSkip';

    var Inspected = Ember.Object.extend(mixinToSkip, {
      name: 'Teddy',
      gender: 'Male',
      hasChildren: false,
      expensiveProperty: (0, _emberNewComputed.default)(function () {
        return '';
      }).property(),
      _debugInfo: function _debugInfo() {
        return {
          propertyInfo: {
            includeOtherProperties: true,
            skipProperties: ['propertyToSkip'],
            skipMixins: ['MixinToSkip'],
            expensiveProperties: ['expensiveProperty'],
            groups: [{
              name: 'Basic Info',
              properties: ['name', 'gender'],
              expand: true
            }, {
              name: 'Family Info',
              properties: ['maritalStatus']
            }]
          }
        };
      }
    });

    Inspected.toString = function () {
      return 'TestObject';
    };

    var inspected = Inspected.create({
      maritalStatus: 'Single',
      propertyToSkip: null
    });

    objectInspector.sendObject(inspected);

    assert.equal(message.details[0].name, 'Basic Info');
    assert.equal(message.details[0].properties[0].name, 'name');
    assert.equal(message.details[0].properties[1].name, 'gender');
    assert.ok(message.details[0].expand);

    assert.equal(message.details[1].name, 'Family Info');
    assert.equal(message.details[1].properties[0].name, 'maritalStatus');

    assert.equal(message.details[2].name, 'Own Properties');
    assert.equal(message.details[2].properties.length, 0, "Correctly skips properties");

    assert.equal(message.details[3].name, 'TestObject');
    assert.equal(message.details[3].properties.length, 2, "Does not duplicate properties");
    assert.equal(message.details[3].properties[0].name, 'hasChildren');
    assert.equal(message.details[3].properties[1].value.type, 'type-descriptor', "Does not calculate expensive properties");

    assert.ok(message.details[4].name !== 'MixinToSkip', "Correctly skips properties");
  });

  (0, _qunit.test)("Read Only Computed properties mush have a readOnly property", function (assert) {
    var inspected = Ember.Object.extend({
      readCP: (0, _emberNewComputed.default)(function () {}).property().readOnly(),
      writeCP: (0, _emberNewComputed.default)(function () {}).property()
    }).create();

    objectInspector.sendObject(inspected);

    var properties = message.details[1].properties;

    assert.ok(properties[0].readOnly);
    assert.ok(!properties[1].readOnly);
  });

  (0, _qunit.test)("Views are correctly handled when destroyed during transitions", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var objectId, view;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              objectId = null;
              _context2.next = 3;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 3:

              objectId = (0, _emberNativeDomHelpers.find)('.simple-view').id;
              view = App.__container__.lookup('-view-registry:main')[objectId];

              objectInspector.sendObject(view);
              _context2.next = 8;
              return wait();

            case 8:

              assert.ok(!!objectInspector.sentObjects[objectId], "Object successfully retained.");

              _context2.next = 11;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 11:

              assert.ok(true, "No exceptions thrown");

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }());

  (0, _qunit.test)("Objects are dropped on destruction", function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var didDestroy, object, objectId;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              didDestroy = false;
              object = Ember.Object.create({
                willDestroy: function willDestroy() {
                  didDestroy = true;
                }
              });
              objectId = guidFor(object);
              _context3.next = 5;
              return wait();

            case 5:

              objectInspector.sendObject(object);
              _context3.next = 8;
              return wait();

            case 8:

              assert.ok(!!objectInspector.sentObjects[objectId]);
              Ember.run(object, 'destroy');
              _context3.next = 12;
              return wait();

            case 12:

              assert.ok(didDestroy, 'Original willDestroy is preserved.');
              assert.ok(!objectInspector.sentObjects[objectId], 'Object is dropped');
              assert.equal(name, 'objectInspector:droppedObject');
              assert.deepEqual(message, { objectId: objectId });

            case 16:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }());

  (0, _qunit.test)("Properties ending with `Binding` are skipped", function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
      var object, props;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              object = Ember.Object.create({
                bar: 'test',
                fooBinding: 'bar'
              });
              _context4.next = 3;
              return wait();

            case 3:

              objectInspector.sendObject(object);
              _context4.next = 6;
              return wait();

            case 6:
              props = message.details[0].properties;

              assert.equal(props.length, 2, "Props should be foo and bar without fooBinding");
              assert.equal(props[0].name, 'bar');
              assert.equal(props[1].name, 'foo');

            case 10:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x3) {
      return _ref5.apply(this, arguments);
    };
  }());

  (0, _qunit.test)("Properties listed in _debugInfo but don't exist should be skipped silently", function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
      var object, props;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              object = Ember.Object.create({
                foo: 'test',
                _debugInfo: function _debugInfo() {
                  return {
                    propertyInfo: {
                      groups: [{
                        name: 'Attributes', properties: ['foo', 'bar']
                      }]
                    }
                  };
                }
              });
              _context5.next = 3;
              return wait();

            case 3:

              run(objectInspector, 'sendObject', object);
              _context5.next = 6;
              return wait();

            case 6:
              props = message.details[0].properties;

              assert.equal(props.length, 1, "bar should be silently skipped");
              assert.equal(props[0].name, 'foo');

            case 9:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x4) {
      return _ref6.apply(this, arguments);
    };
  }());

  (0, _qunit.test)("Errors while computing CPs are handled", function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
      var count, object, errors;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              // catch error port messages (ignored by default)
              ignoreErrors = false;

              count = 0;
              object = void 0;

              run(function () {
                object = EmberObject.extend({
                  foo: (0, _emberNewComputed.default)(function () {
                    if (count++ < 2) {
                      throw new Error('CP Calculation');
                    }
                    return 'bar';
                  })
                }).create();
              });

              run(objectInspector, 'sendObject', object);
              _context6.next = 7;
              return wait();

            case 7:
              errors = message.errors;

              assert.equal(errors.length, 1);
              assert.equal(errors[0].property, 'foo');
              ignoreErrors = false;

              // Calculate CP a second time
              run(function () {
                port.trigger('objectInspector:calculate', {
                  objectId: guidFor(object),
                  property: 'foo',
                  mixinIndex: 1
                });
              });
              _context6.next = 14;
              return wait();

            case 14:
              ignoreErrors = true;
              assert.equal(name, 'objectInspector:updateErrors');
              assert.equal(errors.length, 1);
              assert.equal(errors[0].property, 'foo');

              // Calculate CP a third time (no error this time)
              run(function () {
                port.trigger('objectInspector:calculate', {
                  objectId: guidFor(object),
                  property: 'foo',
                  mixinIndex: 1
                });
              });
              _context6.next = 21;
              return wait();

            case 21:
              assert.equal(name, 'objectInspector:updateProperty');
              assert.equal(message.value.inspect, 'bar');

              // teardown
              ignoreErrors = true;

            case 24:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function (_x5) {
      return _ref7.apply(this, arguments);
    };
  }());
});
define('ember-inspector/tests/ember_debug/profile-manager-test', ['qunit', 'require'], function (_qunit, _require2) {
  'use strict';

  var ProfileManager = (0, _require2.default)('ember-debug/models/profile-manager').default;

  (0, _qunit.test)("Construction", function (assert) {
    var manager = new ProfileManager();
    assert.ok(!!manager, "it was created");
    assert.equal(manager.profiles.length, 0, "it has no profiles");
  });
});
define('ember-inspector/tests/ember_debug/profile-node-test', ['require', 'qunit'], function (_require2, _qunit) {
  'use strict';

  var ProfileNode = (0, _require2.default)('ember-debug/models/profile-node').default;

  (0, _qunit.module)("ProfileNode");

  (0, _qunit.test)("It can create a ProfileNode", function (assert) {
    var p = new ProfileNode(1001, { template: 'application' });

    assert.ok(!!p, "it creates a ProfileNode");
    assert.equal(p.start, 1001, "it stores the start time");
    assert.equal(p.name, "application", "it extracted the correct name");
    assert.equal(p.children.length, 0, "it has no children by default");
    assert.ok(!p.time, "It has no time because it's unfinished");
  });

  (0, _qunit.test)("with no payload it has an unknown name", function (assert) {
    var p = new ProfileNode(1234);
    assert.equal(p.name, "Unknown view");
  });

  (0, _qunit.test)("It can extract the name from an object payload", function (assert) {
    var p = new ProfileNode(1000, {
      object: {
        toString: function toString() {
          return "custom toString()";
        }
      }
    });

    assert.equal(p.name, "custom toString()", "it called toString()");
  });

  (0, _qunit.test)("It can create a child ProfileNode", function (assert) {
    var p1 = new ProfileNode(new Date().getTime(), { template: 'items' });
    var p2 = new ProfileNode(new Date().getTime(), { template: 'item' }, p1);

    assert.ok(!p1.parent, "Without a parent parameter, the attribute is not set");
    assert.equal(p2.parent, p1, "If passed, p2's parent is assigned to p1");
    assert.ok(!p1.time, "p1 has no time because it's unfinished");
    assert.ok(!p2.time, "p2 has no time because it's unfinished");
  });

  (0, _qunit.test)("It can finish the timer", function (assert) {
    var p = new ProfileNode(1000, { template: 'users' });
    p.finish(1004);
    assert.equal(p.time, 4, "it took 4 ms");
  });

  (0, _qunit.test)("When a node has children, they are inserted when finished", function (assert) {
    var p1 = new ProfileNode(1000, { template: 'candies' });
    var p2 = new ProfileNode(1001, { template: 'candy' }, p1);

    assert.equal(p1.children.length, 0, "has no children at first");
    p2.finish(2022);
    assert.equal(p1.children[0], p2, "has a child after p2 finishes");
  });

  (0, _qunit.test)("Can be serialized as JSON", function (assert) {
    var p1 = new ProfileNode(1000, { template: 'donuts' });
    var p2 = new ProfileNode(1001, { template: 'donut' }, p1);

    p2.finish(1003);
    p1.finish(1004);

    assert.ok(JSON.stringify(p1), "it can serialize due to no cycles in the object");
  });

  (0, _qunit.test)("Name takes the following priority: display, containerKey, object", function (assert) {
    var p = void 0;
    p = new ProfileNode(1000, { view: { instrumentDisplay: 'donuts', _debugContainerKey: 'candy' }, object: 'coffee' });
    assert.equal(p.name, 'donuts');
    p = new ProfileNode(1000, { view: { _debugContainerKey: 'candy' }, object: 'coffee' });
    assert.equal(p.name, 'candy');
    p = new ProfileNode(1000, { object: 'coffee' });
    assert.equal(p.name, 'coffee');
  });
});
define('ember-inspector/tests/ember_debug/promise-assembler-test', ['qunit', 'require'], function (_qunit, _require2) {
  'use strict';

  var PromiseAssembler = (0, _require2.default)('ember-debug/libs/promise-assembler').default;

  var assembler = void 0;

  var fakeRSVP = void 0;

  function stubRSVP() {
    fakeRSVP = Ember.Object.extend(Ember.Evented, {
      configure: function configure() {}
    }).create();
  }

  function startAssembler() {
    Ember.run(assembler, 'start');
  }

  (0, _qunit.module)("PromiseAssembler", {
    beforeEach: function beforeEach() {
      stubRSVP();
      Ember.run(function () {
        assembler = PromiseAssembler.create({
          RSVP: fakeRSVP
        });
      });
    },
    afterEach: function afterEach() {
      if (assembler) {
        Ember.run(assembler, 'destroy');
        assembler = null;
      }
    }
  });

  (0, _qunit.test)("Creates promises correctly", function (assert) {
    startAssembler();
    var date = new Date();
    var event = void 0;

    assembler.on('created', function (e) {
      event = e;
    });

    fakeRSVP.trigger('created', {
      guid: 1,
      label: 'label',
      timeStamp: date,
      stack: 'stack'
    });

    assert.ok(event);
    var promise = event.promise;
    assert.equal(event.promise, assembler.find(promise.get('guid')));

    assert.equal(assembler.find().get('length'), 1);

    assert.equal(promise.get('guid'), 1);
    assert.equal(promise.get('label'), 'label');
    assert.equal(promise.get('createdAt'), date);
    assert.equal(promise.get('stack'), 'stack');
    assert.equal(promise.get('state'), 'created');
  });

  (0, _qunit.test)("Chains a promise correctly (parent and child not-existing)", function (assert) {
    startAssembler();
    var date = new Date();
    var event = void 0;

    assembler.on('chained', function (e) {
      event = e;
    });

    fakeRSVP.trigger('chained', {
      guid: 1,
      label: 'label',
      timeStamp: date,
      childGuid: 2
    });

    var parent = event.promise;
    var child = event.child;

    assert.equal(assembler.find(parent.get('guid')), parent);
    assert.equal(assembler.find(child.get('guid')), child);

    assert.equal(assembler.find().get('length'), 2);

    assert.equal(parent.get('guid'), 1);
    assert.equal(parent.get('label'), 'label');
    assert.equal(parent.get('chainedAt'), date);
    assert.equal(parent.get('children.length'), 1);
    assert.equal(child.get('guid'), 2);
    assert.equal(child.get('parent'), parent);
  });

  (0, _qunit.test)("Chains a promise correctly (parent and child existing)", function (assert) {

    startAssembler();
    var date = new Date();
    var event = void 0;
    var parent = void 0;
    var child = void 0;

    assembler.on('created', function (e) {
      parent = e.promise;
    });

    fakeRSVP.trigger('created', {
      guid: 1
    });

    assembler.off('created');

    assembler.on('created', function (e) {
      child = e.promise;
    });

    fakeRSVP.trigger('created', {
      guid: 2
    });

    assembler.on('chained', function (e) {
      event = e;
    });

    fakeRSVP.trigger('chained', {
      guid: 1,
      label: 'label',
      timeStamp: date,
      childGuid: 2
    });

    assert.equal(parent, event.promise);
    assert.equal(child, event.child);

    assert.equal(assembler.find(parent.get('guid')), parent);
    assert.equal(assembler.find(child.get('guid')), child);

    assert.equal(assembler.find().get('length'), 2);

    assert.equal(parent.get('guid'), 1);
    assert.equal(parent.get('label'), 'label');
    assert.equal(parent.get('chainedAt'), date);
    assert.equal(parent.get('children.length'), 1);
    assert.equal(child.get('guid'), 2);
    assert.equal(child.get('parent'), parent);
  });

  (0, _qunit.test)("Fulfills a promise correctly", function (assert) {
    startAssembler();
    var date = new Date();
    var event = void 0;
    var promise = void 0;

    assembler.on('created', function (e) {
      promise = e.promise;
    });

    fakeRSVP.trigger('created', {
      guid: 1
    });

    assembler.off('created');

    assert.equal(promise.get('state'), 'created');

    assembler.on('fulfilled', function (e) {
      event = e;
    });

    fakeRSVP.trigger('fulfilled', {
      guid: 1,
      detail: 'value',
      timeStamp: date
    });

    assert.equal(event.promise, promise);
    assert.equal(promise.get('state'), 'fulfilled');
    assert.equal(promise.get('value'), 'value');
    assert.equal(promise.get('settledAt'), date);
    assert.equal(assembler.find().get('length'), 1);
  });

  (0, _qunit.test)("Rejects a promise correctly", function (assert) {
    startAssembler();
    var date = new Date();
    var event = void 0;
    var promise = void 0;

    assembler.on('created', function (e) {
      promise = e.promise;
    });

    fakeRSVP.trigger('created', {
      guid: 1
    });

    assembler.off('created');

    assert.equal(promise.get('state'), 'created');

    assembler.on('rejected', function (e) {
      event = e;
    });

    fakeRSVP.trigger('rejected', {
      guid: 1,
      detail: 'reason',
      timeStamp: date
    });

    assert.equal(event.promise, promise);
    assert.equal(promise.get('state'), 'rejected');
    assert.equal(promise.get('reason'), 'reason');
    assert.equal(promise.get('settledAt'), date);
    assert.equal(assembler.find().get('length'), 1);
  });

  (0, _qunit.test)('#stop', function (assert) {
    startAssembler();

    fakeRSVP.trigger('created', {
      guid: 1
    });
    assert.equal(assembler.find().get('length'), 1);

    Ember.run(assembler, 'stop');

    assert.equal(assembler.find().get('length'), 0);
    assembler.on('created', function () {
      assert.ok(false);
    });
    fakeRSVP.trigger('created', { guid: 1 });
    assert.equal(assembler.find().get('length'), 0);
  });
});
define('ember-inspector/tests/ember_debug/promise-debug-test', ['qunit', 'require'], function (_qunit, _require2) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var EmberDebug = (0, _require2.default)("ember-debug/main").default;

  var port = void 0,
      name = void 0,
      message = void 0,
      RSVP = Ember.RSVP;
  var App = void 0;
  var run = Ember.run,
      emberA = Ember.A;


  function setupApp() {
    App = Ember.Application.create();
    App.injectTestHelpers();
    App.setupForTesting();
  }

  // RSVP instrumentation is out of band (50 ms delay)

  var rsvpDelay = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              Ember.run.later(function () {}, 100);
              _context.next = 3;
              return wait();

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function rsvpDelay() {
      return _ref.apply(this, arguments);
    };
  }();

  (0, _qunit.module)("Promise Debug", {
    beforeEach: function beforeEach() {

      EmberDebug.Port = EmberDebug.Port.extend({
        init: function init() {},
        send: function send(n, m) {
          name = n;
          message = m;
        }
      });
      run(function () {
        setupApp();
        EmberDebug.set('application', App);
      });
      Ember.run(EmberDebug, 'start');
      EmberDebug.get('promiseDebug').reopen({
        delay: 5,
        session: {
          getItem: function getItem() {},
          setItem: function setItem() {},
          removeItem: function removeItem() {}
        }
      });
      port = EmberDebug.port;
    },
    afterEach: function afterEach() {
      name = null;
      message = null;
      EmberDebug.destroyContainer();
      Ember.run(App, 'destroy');
    }
  });

  (0, _qunit.test)("Existing promises sent when requested", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var promise1, child1, promise2, promises;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              promise1 = void 0, child1 = void 0, promise2 = void 0;


              run(function () {
                RSVP.resolve('value', "Promise1").then(function () {}, null, "Child1");

                // catch so we don't get a promise failure
                RSVP.reject('reason', "Promise2").catch(function () {});
              });

              _context2.next = 4;
              return rsvpDelay();

            case 4:

              port.trigger('promise:getAndObservePromises');

              assert.equal(name, 'promise:promisesUpdated');

              promises = emberA(message.promises);


              promise1 = promises.findBy('label', 'Promise1');
              child1 = promises.findBy('label', 'Child1');
              promise2 = promises.findBy('label', 'Promise2');

              assert.equal(promise1.label, 'Promise1');
              assert.equal(promise1.state, 'fulfilled');
              assert.equal(promise1.children.length, 1);
              assert.equal(promise1.children[0], child1.guid);

              assert.equal(child1.label, 'Child1');
              assert.equal(child1.state, 'fulfilled');
              assert.equal(child1.parent, promise1.guid);

              assert.equal(promise2.label, 'Promise2');
              assert.equal(promise2.state, 'rejected');

            case 19:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function t(_x) {
      return _ref2.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)("Updates are published when they happen", function (assert) {
    port.trigger('promise:getAndObservePromises');

    var p = void 0;

    run(function () {
      p = new RSVP.Promise(function () {}, "Promise1");
    });

    var done = assert.async();
    Ember.run.later(function () {
      assert.equal(name, 'promise:promisesUpdated');
      var promises = emberA(message.promises);
      var promise = promises.findBy('label', 'Promise1');
      assert.ok(!!promise);
      if (promise) {
        assert.equal(promise.label, 'Promise1');
        p.then(function () {}, null, "Child1");
        Ember.run.later(function () {
          assert.equal(name, 'promise:promisesUpdated');
          assert.equal(message.promises.length, 2);
          var child = message.promises[0];
          assert.equal(child.parent, promise.guid);
          assert.equal(child.label, 'Child1');
          var parent = message.promises[1];
          assert.equal(parent.guid, promise.guid);
          done();
        }, 200);
      }
    }, 200);
  });

  (0, _qunit.test)("Instrumentation with stack is persisted to session storage", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var withStack;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              withStack = false;

              EmberDebug.get('promiseDebug').reopen({
                session: {
                  getItem: function getItem() /*key*/{
                    return withStack;
                  },
                  setItem: function setItem(key, val) {
                    withStack = val;
                  }
                }
              });
              // Clear CP cache
              EmberDebug.get('promiseDebug').propertyDidChange('instrumentWithStack');

              _context3.next = 5;
              return wait();

            case 5:
              port.trigger('promise:getInstrumentWithStack');

              _context3.next = 8;
              return wait();

            case 8:
              assert.equal(name, 'promise:instrumentWithStack');
              assert.equal(message.instrumentWithStack, false);
              port.trigger('promise:setInstrumentWithStack', {
                instrumentWithStack: true
              });

              _context3.next = 13;
              return wait();

            case 13:
              assert.equal(name, 'promise:instrumentWithStack');
              assert.equal(message.instrumentWithStack, true);
              assert.equal(withStack, true, 'persisted');
              port.trigger('promise:setInstrumentWithStack', {
                instrumentWithStack: false
              });

              _context3.next = 19;
              return wait();

            case 19:
              assert.equal(name, 'promise:instrumentWithStack');
              assert.equal(message.instrumentWithStack, false);
              assert.equal(withStack, false, 'persisted');

            case 22:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());

  (0, _qunit.test)("Responds even if no promises detected", function (assert) {
    port.trigger('promise:getAndObservePromises');
    assert.equal(name, 'promise:promisesUpdated');
    assert.equal(message.promises.length, 0);
  });
});
define('ember-inspector/tests/ember_debug/render-debug-test', ['qunit', 'ember-native-dom-helpers', 'require'], function (_qunit, _emberNativeDomHelpers, _require2) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var EmberDebug = (0, _require2.default)('ember-debug/main').default;
  var run = Ember.run,
      Application = Ember.Application;

  var port = void 0,
      App = void 0;

  function setupApp() {
    App = Application.create();
    App.setupForTesting();
    App.injectTestHelpers();

    App.Router.map(function () {
      this.route('simple');
    });
    Ember.TEMPLATES.simple = Ember.HTMLBars.template({
      "id": "5fP4EWun",
      "block": "{\"statements\":[[0,\"Simple template\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    });
  }

  (0, _qunit.module)("Render Debug", {
    beforeEach: function beforeEach() {
      EmberDebug.Port = EmberDebug.Port.extend({
        init: function init() {},
        send: function send() {}
      });
      run(function () {
        setupApp();
        EmberDebug.set('application', App);
      });
      run(EmberDebug, 'start');
      port = EmberDebug.port;
    },
    afterEach: function afterEach() {
      EmberDebug.destroyContainer();
      run(App, 'destroy');
    }
  });

  (0, _qunit.test)("Simple Render", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var profiles;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              profiles = [];

              port.reopen({
                send: function send(n, m) {
                  if (n === "render:profilesAdded") {
                    profiles = profiles.concat(m.profiles);
                  }
                }
              });
              port.trigger('render:watchProfiles');

              _context.next = 5;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 5:

              assert.ok(profiles.length > 0, "it has created profiles");

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function t(_x) {
      return _ref2.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)("Clears correctly", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var profiles;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              profiles = [];


              port.reopen({
                send: function send(n, m) {
                  if (n === "render:profilesAdded") {
                    profiles.push(m.profiles);
                  }
                  if (n === "render:profilesUpdated") {
                    profiles = m.profiles;
                  }
                }
              });

              port.trigger('render:watchProfiles');

              _context2.next = 5;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 5:

              assert.ok(profiles.length > 0, "it has created profiles");
              port.trigger('render:clear');
              _context2.next = 9;
              return wait();

            case 9:

              assert.ok(profiles.length === 0, "it has cleared the profiles");

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function t(_x2) {
      return _ref3.apply(this, arguments);
    }

    return t;
  }());
});
define('ember-inspector/tests/ember_debug/route-debug-test', ['qunit', 'ember-native-dom-helpers', 'require'], function (_qunit, _emberNativeDomHelpers, _require2) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var run = Ember.run,
      Application = Ember.Application,
      Route = Ember.Route;

  var get = Ember.get;

  var EmberDebug = (0, _require2.default)('ember-debug/main').default;
  var port = void 0;
  var App = void 0;

  function setupApp() {
    App = Application.create();
    App.toString = function () {
      return 'App';
    };
    App.setupForTesting();
    App.injectTestHelpers();

    App.Router.map(function () {
      this.route('simple');
      this.route('posts', { resetNamespace: true });
      this.route('comments', { resetNamespace: true }, function () {
        this.route('new');
        this.route('edit', { path: '/edit/:comment_id' });
      });
    });

    App.LoadingRoute = App.ErrorRoute = Route;
  }

  function getChildrenProperty(route, prop) {
    return route.children.map(function (item) {
      return get(item.value, prop);
    });
  }

  (0, _qunit.module)("Route Tree Debug", {
    beforeEach: function beforeEach() {
      EmberDebug.Port = EmberDebug.Port.extend({
        init: function init() {},
        send: function send() {}
      });
      run(function () {
        setupApp();
        EmberDebug.set('application', App);
      });
      run(EmberDebug, 'start');
      EmberDebug.get('generalDebug').reopen({
        emberCliConfig: null
      });
      port = EmberDebug.port;
    },
    afterEach: function afterEach() {
      EmberDebug.destroyContainer();
      run(App, 'destroy');
    }
  });

  (0, _qunit.test)("Route tree", function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var name, message, route, commentsRoute;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              name = null, message = null, route = void 0;

              port.reopen({
                send: function send(n, m) {
                  name = n;
                  message = m;
                }
              });

              _context.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/');

            case 4:

              run(port, 'trigger', 'route:getTree');
              _context.next = 7;
              return wait();

            case 7:

              assert.equal(name, 'route:routeTree');

              route = message.tree.children[0];
              assert.equal(route.value.name, 'application');
              assert.equal(route.value.type, 'resource');
              assert.equal(route.value.controller.name, 'application');
              assert.equal(route.value.controller.className, 'ApplicationController');
              assert.equal(route.value.routeHandler.name, 'application');
              assert.equal(route.value.routeHandler.className, 'ApplicationRoute');
              assert.equal(route.value.template.name, 'application');
              assert.equal(route.children.length, 6);

              assert.deepEqual(getChildrenProperty(route, 'name'), ['loading', 'error', 'simple', 'posts', 'comments', 'index']);

              commentsRoute = route.children.filter(function (child) {
                return child.value.name === 'comments';
              })[0];


              assert.ok(commentsRoute, 'expected comment steps');

              assert.equal(commentsRoute.children.length, 3);
              assert.equal(commentsRoute.value.type, 'resource');
              assert.equal(commentsRoute.value.controller.className, 'CommentsController');
              assert.equal(commentsRoute.value.routeHandler.className, 'CommentsRoute');

              assert.deepEqual(getChildrenProperty(commentsRoute, 'name'), ['comments.new', 'comments.edit', 'comments.index']);

              assert.deepEqual(getChildrenProperty(commentsRoute, 'url'), ['/comments/new', '/comments/edit/:comment_id', '/comments']);
              assert.deepEqual(getChildrenProperty(commentsRoute, 'type'), ['route', 'route', 'route']);
              assert.deepEqual(getChildrenProperty(commentsRoute, 'controller.className'), ['CommentsNewController', 'CommentsEditController', 'CommentsIndexController']);
              assert.deepEqual(getChildrenProperty(commentsRoute, 'routeHandler.className'), ['CommentsNewRoute', 'CommentsEditRoute', 'CommentsIndexRoute']);
              assert.deepEqual(getChildrenProperty(commentsRoute, 'template.name'), ['comments/new', 'comments/edit', 'comments/index']);

            case 30:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function t(_x) {
      return _ref.apply(this, arguments);
    }

    return t;
  }());
});
define('ember-inspector/tests/ember_debug/view-debug-test', ['qunit', 'ember-native-dom-helpers', 'require'], function (_qunit, _emberNativeDomHelpers, _require2) {
  'use strict';

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var Application = Ember.Application;


  var EmberDebug = (0, _require2.default)('ember-debug/main').default;
  var Route = Ember.Route,
      EmberObject = Ember.Object,
      Controller = Ember.Controller;

  var port = void 0;
  var App = void 0,
      run = Ember.run;
  var OLD_TEMPLATES = {};

  function setTemplate(name, template) {
    OLD_TEMPLATES = Ember.TEMPLATES[name];
    template.meta.moduleName = name;
    Ember.TEMPLATES[name] = template;
  }

  function destroyTemplates() {
    for (var name in OLD_TEMPLATES) {
      Ember.TEMPLATES[name] = OLD_TEMPLATES[name];
    }
    OLD_TEMPLATES = {};
  }

  function isVisible(elem) {
    return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
  }

  function setupApp() {
    App = Application.create();
    App.setupForTesting();
    App.injectTestHelpers();

    App.Router.map(function () {
      this.route('simple');
      this.route('comments', { resetNamespace: true }, function () {});
      this.route('posts', { resetNamespace: true });
    });

    App.ApplicationRoute = Route.extend({
      model: function model() {
        return EmberObject.create({
          toString: function toString() {
            return 'Application model';
          }
        });
      }
    });

    App.SimpleRoute = Route.extend({
      model: function model() {
        return EmberObject.create({
          toString: function toString() {
            return 'Simple Model';
          }
        });
      }
    });

    App.CommentsIndexRoute = Route.extend({
      model: function model() {
        return Ember.A(['first comment', 'second comment', 'third comment']);
      }
    });

    App.PostsRoute = Route.extend({
      model: function model() {
        return 'String as model';
      }
    });

    App.ApplicationController = Controller.extend();
    App.ApplicationController.reopenClass({
      toString: function toString() {
        return 'App.ApplicationController';
      }
    });
    App.SimpleController = Controller.extend();
    App.SimpleController.reopenClass({
      toString: function toString() {
        return 'App.SimpleController';
      }
    });

    setTemplate('application', Ember.HTMLBars.template({
      "id": "8ihaQt84",
      "block": "{\"statements\":[[11,\"div\",[]],[15,\"class\",\"application\"],[13],[1,[26,[\"outlet\"]],false],[14]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));
    setTemplate('simple', Ember.HTMLBars.template({
      "id": "/BitCTck",
      "block": "{\"statements\":[[0,\"Simple \"],[1,[33,[\"input\"],null,[[\"class\"],[\"simple-input\"]]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));
    setTemplate('comments/index', Ember.HTMLBars.template({
      "id": "T3lOpZ4a",
      "block": "{\"statements\":[[6,[\"each\"],null,null,{\"statements\":[[1,[28,[null]],false]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));
    setTemplate('posts', Ember.HTMLBars.template({
      "id": "MRtcATCq",
      "block": "{\"statements\":[[0,\"Posts\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));
  }
  var defaultRootForFinder = void 0;
  (0, _qunit.module)("View Debug", {
    beforeEach: function beforeEach() {
      EmberDebug.Port = EmberDebug.Port.extend({
        init: function init() {},
        send: function send() {}
      });
      run(function () {
        setupApp();
        EmberDebug.set('application', App);
      });
      EmberDebug.IGNORE_DEPRECATIONS = true;
      run(EmberDebug, 'start');
      port = EmberDebug.port;
      defaultRootForFinder = _emberNativeDomHelpers.settings.rootElement;
      _emberNativeDomHelpers.settings.rootElement = 'body';
    },
    afterEach: function afterEach() {
      EmberDebug.destroyContainer();
      run(App, 'destroy');
      destroyTemplates();
      _emberNativeDomHelpers.settings.rootElement = defaultRootForFinder;
    }
  });

  (0, _qunit.test)("Simple View Tree", function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(assert) {
      var name, message, tree, value;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              name = null, message = null;

              port.reopen({
                send: function send(n, m) {
                  name = n;
                  message = m;
                }
              });

              _context.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 4:

              assert.equal(name, 'view:viewTree');
              tree = message.tree;
              value = tree.value;

              assert.equal(tree.children.length, 1);
              assert.equal(value.controller.name, 'App.ApplicationController');
              assert.equal(value.name, 'application');
              assert.equal(value.tagName, 'div');
              assert.equal(value.template, 'application');

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function t(_x) {
      return _ref2.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)("Components in view tree", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(assert) {
      var message, tree, simple, component;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              message = void 0;

              port.reopen({
                send: function send(n, m) {
                  message = m;
                }
              });

              _context2.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 4:
              tree = message.tree;
              simple = tree.children[0];

              assert.equal(simple.children.length, 0, "Components are not listed by default.");
              run(function () {
                port.trigger('view:setOptions', { options: { components: true } });
              });

              _context2.next = 10;
              return wait();

            case 10:

              tree = message.tree;
              simple = tree.children[0];
              assert.equal(simple.children.length, 1, "Components can be configured to show.");
              component = simple.children[0];

              assert.equal(component.value.viewClass, 'Ember.TextField');

            case 15:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function t(_x2) {
      return _ref3.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)("Highlighting Views on hover", function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(assert) {
      var name, message, previewDiv, layerDiv, controller;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              name = void 0, message = void 0;

              port.reopen({
                send: function send(n, m) {
                  name = n;
                  message = m;
                }
              });

              _context3.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 4:

              run(function () {
                return port.trigger('view:inspectViews', { inspect: true });
              });
              _context3.next = 7;
              return wait();

            case 7:
              _context3.next = 9;
              return (0, _emberNativeDomHelpers.triggerEvent)('.application', 'mousemove');

            case 9:
              previewDiv = (0, _emberNativeDomHelpers.find)('[data-label=preview-div]');


              assert.ok(isVisible(previewDiv));
              assert.notOk((0, _emberNativeDomHelpers.find)('[data-label=layer-component]'), "Component layer not shown on outlet views");
              assert.equal((0, _emberNativeDomHelpers.find)('[data-label=layer-controller]', previewDiv).textContent, 'App.ApplicationController');
              assert.equal((0, _emberNativeDomHelpers.find)('[data-label=layer-model]', previewDiv).textContent, 'Application model');

              layerDiv = (0, _emberNativeDomHelpers.find)('[data-label=layer-div]');
              _context3.next = 17;
              return (0, _emberNativeDomHelpers.triggerEvent)(layerDiv, 'mouseup');

            case 17:

              assert.ok(isVisible(layerDiv));
              assert.equal((0, _emberNativeDomHelpers.find)('[data-label=layer-model]', layerDiv).textContent, 'Application model');
              _context3.next = 21;
              return (0, _emberNativeDomHelpers.click)('[data-label=layer-controller]', layerDiv);

            case 21:
              controller = App.__container__.lookup('controller:application');

              assert.equal(name, 'objectInspector:updateObject');
              assert.equal(controller.toString(), message.name);
              name = null;
              message = null;

              _context3.next = 28;
              return (0, _emberNativeDomHelpers.click)('[data-label=layer-model]', layerDiv);

            case 28:

              assert.equal(name, 'objectInspector:updateObject');
              assert.equal(message.name, 'Application model');
              _context3.next = 32;
              return (0, _emberNativeDomHelpers.click)('[data-label=layer-close]');

            case 32:

              assert.notOk(isVisible(layerDiv));

              run(function () {
                return port.trigger('view:inspectViews', { inspect: true });
              });
              _context3.next = 36;
              return wait();

            case 36:
              _context3.next = 38;
              return (0, _emberNativeDomHelpers.triggerEvent)('.simple-input', 'mousemove');

            case 38:

              previewDiv = (0, _emberNativeDomHelpers.find)('[data-label=preview-div]');
              assert.ok(isVisible(previewDiv));
              assert.equal((0, _emberNativeDomHelpers.find)('[data-label=layer-component]').textContent.trim(), "Ember.TextField");
              assert.notOk((0, _emberNativeDomHelpers.find)('[data-label=layer-controller]', previewDiv));
              assert.notOk((0, _emberNativeDomHelpers.find)('[data-label=layer-model]', previewDiv));

            case 43:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function t(_x3) {
      return _ref4.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)("Highlighting a view without an element should not throw an error", function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(assert) {
      var message, tree, postsView;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              message = null;

              port.reopen({
                send: function send(n, m) {
                  message = m;
                }
              });

              _context4.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/posts');

            case 4:
              tree = message.tree;
              postsView = tree.children[0];

              port.trigger('view:previewLayer', { objectId: postsView.value.objectId });
              _context4.next = 9;
              return wait();

            case 9:

              assert.ok(true, "Does not throw an error.");

            case 10:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function t(_x4) {
      return _ref5.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)("Supports a view with a string as model", function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(assert) {
      var message;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              message = null;

              port.reopen({
                send: function send(n, m) {
                  message = m;
                }
              });

              _context5.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/posts');

            case 4:

              assert.equal(message.tree.children[0].value.model.name, 'String as model');
              assert.equal(message.tree.children[0].value.model.type, 'type-string');

            case 6:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function t(_x5) {
      return _ref6.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)("Supports applications that don't have the ember-application CSS class", function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(assert) {
      var name, rootElement;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              name = null;
              rootElement = (0, _emberNativeDomHelpers.find)('');
              _context6.next = 4;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 4:

              assert.ok(rootElement.classList.contains('ember-application'), "The rootElement has the .ember-application CSS class");
              rootElement.classList.remove('ember-application');

              // Restart the inspector
              EmberDebug.start();
              port = EmberDebug.port;

              port.reopen({
                send: function send(n /*, m*/) {
                  name = n;
                }
              });

              _context6.next = 11;
              return (0, _emberNativeDomHelpers.visit)('/simple');

            case 11:

              assert.equal(name, 'view:viewTree');

            case 12:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function t(_x6) {
      return _ref7.apply(this, arguments);
    }

    return t;
  }());

  (0, _qunit.test)("Does not list nested {{yield}} views", function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(assert) {
      var message;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              message = null;

              port.reopen({
                send: function send(n, m) {
                  message = m;
                }
              });

              setTemplate('posts', Ember.HTMLBars.template({
                "id": "Pv4u7GU4",
                "block": "{\"statements\":[[6,[\"x-first\"],null,null,{\"statements\":[[0,\"Foo\"]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
                "meta": {}
              }));
              setTemplate('components/x-first', Ember.HTMLBars.template({
                "id": "k8JWQ6z4",
                "block": "{\"statements\":[[6,[\"x-second\"],null,null,{\"statements\":[[18,\"default\"]],\"locals\":[]},null]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}",
                "meta": {}
              }));
              setTemplate('components/x-second', Ember.HTMLBars.template({
                "id": "+QzkJC2M",
                "block": "{\"statements\":[[18,\"default\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}",
                "meta": {}
              }));

              _context7.next = 7;
              return (0, _emberNativeDomHelpers.visit)('/posts');

            case 7:

              assert.equal(message.tree.children.length, 1, 'Only the posts view should render');
              assert.equal(message.tree.children[0].children.length, 0, 'posts view should have no children');

            case 9:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function t(_x7) {
      return _ref8.apply(this, arguments);
    }

    return t;
  }());
});
define('ember-inspector/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('ember-inspector/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember-inspector/tests/helpers/start-app', 'ember-inspector/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var Promise = Ember.RSVP.Promise;
});
define('ember-inspector/tests/helpers/resolver', ['exports', 'ember-inspector/resolver', 'ember-inspector/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('ember-inspector/tests/helpers/start-app', ['exports', 'ember-inspector/app', 'ember-inspector/config/environment', 'ember-inspector/tests/helpers/trigger-port'], function (exports, _app, _environment, _triggerPort) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  var generateGuid = Ember.generateGuid;
  function startApp(attrs) {

    var attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    _app.default.instanceInitializer({
      name: generateGuid() + '-detectEmberApplication',
      initialize: function initialize(instance) {
        instance.lookup('route:app-detected').reopen({
          model: function model() {}
        });
      }
    });

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('ember-inspector/tests/helpers/trigger-port', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var run = Ember.run,
      registerHelper = Ember.Test.registerHelper;
  exports.default = registerHelper('triggerPort', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(app) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              run(function () {
                var _app$__container__$lo;

                return (_app$__container__$lo = app.__container__.lookup('port:main')).trigger.apply(_app$__container__$lo, _toConsumableArray(args));
              });
              _context.next = 3;
              return wait();

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function t(_x) {
      return _ref.apply(this, arguments);
    }

    return t;
  }());
});
define("ember-inspector/tests/template-deprecations-test", [], function () {
  "use strict";
});
define('ember-inspector/tests/test-helper', ['ember-inspector/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);

  window.NO_EMBER_DEBUG = true;
  (0, _emberCliQunit.start)();
});
define('ember-inspector/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('acceptance/container-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/container-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/data-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/data-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/deprecation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/deprecation-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/info-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/info-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/object-inspector-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/object-inspector-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/promise-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/promise-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/render-tree-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/render-tree-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/route-tree-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/route-tree-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/view-tree-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/view-tree-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/container-debug-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/container-debug-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/deprecation-debug-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/deprecation-debug-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/ember-debug-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/ember-debug-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/object-inspector-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/object-inspector-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/profile-manager-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/profile-manager-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/profile-node-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/profile-node-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/promise-assembler-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/promise-assembler-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/promise-debug-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/promise-debug-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/render-debug-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/render-debug-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/route-debug-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/route-debug-test.js should pass ESLint\n\n');
  });

  QUnit.test('ember_debug/view-debug-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'ember_debug/view-debug-test.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/trigger-port.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/trigger-port.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/build-style-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/build-style-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/check-current-route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/check-current-route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/ms-to-time-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/ms-to-time-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/resizable-columns-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/resizable-columns-test.js should pass ESLint\n\n');
  });
});
define('ember-inspector/tests/unit/build-style-test', ['ember-inspector/helpers/build-style', 'qunit'], function (_buildStyle, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Helper | buildStyle');

  (0, _qunit.test)('it should convert options to a string', function (assert) {
    var options = { prop1: '1', prop2: '2' };
    var style = (0, _buildStyle.buildStyle)(null, options);
    assert.equal(style.toString(), 'prop1:1;prop2:2;');
  });
});
define('ember-inspector/tests/unit/check-current-route-test', ['ember-inspector/utils/check-current-route', 'qunit'], function (_checkCurrentRoute, _qunit) {
  'use strict';

  (0, _qunit.module)("Unit | Helper | checkCurrentRoute");

  (0, _qunit.test)("matches the correct routes", function (assert) {
    assert.ok((0, _checkCurrentRoute.default)('whatever', 'application'), 'application is always current');
    assert.ok((0, _checkCurrentRoute.default)('index', 'index'), 'index route matches correctly');
    assert.ok(!(0, _checkCurrentRoute.default)('posts.index', 'index'), 'resource match fails even when route name same as resource name');

    assert.ok((0, _checkCurrentRoute.default)('posts.show', 'posts'), 'resource matches correctly');
    assert.ok(!(0, _checkCurrentRoute.default)('posts.show', 'comments'), 'resource matches correctly');
    assert.ok((0, _checkCurrentRoute.default)('posts.comments.show', 'posts'), 'parent resource of nested resources matches correctly');
    assert.ok((0, _checkCurrentRoute.default)('comments.show', 'comments.show'), 'exact resource and route matches correctly');
    assert.ok((0, _checkCurrentRoute.default)('posts.comments.show', 'comments.show'), 'child resource and route matches correctly');
  });
});
define('ember-inspector/tests/unit/ms-to-time-test', ['ember-inspector/helpers/ms-to-time', 'qunit'], function (_msToTime, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Helper | ms to time');

  (0, _qunit.test)('it should format time to a readable string', function (assert) {
    assert.equal((0, _msToTime.msToTime)([0.42]), '0.42ms');
  });
});
define('ember-inspector/tests/unit/resizable-columns-test', ['ember-inspector/libs/resizable-columns', 'qunit'], function (_resizableColumns, _qunit) {
  'use strict';

  var _keys = Object.keys;


  var storage = void 0;

  function getOptions() {
    return {
      key: 'my-key',
      tableWidth: 30,
      minWidth: 5,
      storage: {
        setItem: function setItem(key, value) {
          storage[key] = value;
        },
        getItem: function getItem(key) {
          return storage[key];
        },
        removeItem: function removeItem(key) {
          delete storage[key];
        },
        keys: function keys() {
          return _keys(storage);
        }
      },
      columnSchema: [{
        id: '1',
        name: 'Column 1',
        visible: true
      }, {
        id: '2',
        name: 'Column 2',
        visible: true
      }, {
        id: '3',
        name: 'Column 3',
        visible: true
      }]
    };
  }

  (0, _qunit.module)('Unit | Lib | ResizableColumns', {
    beforeEach: function beforeEach() {
      storage = {};
      this.options = getOptions();
    },
    afterEach: function afterEach() {
      storage = null;
    }
  });

  (0, _qunit.test)('calculates the correct width', function (assert) {
    var resizableColumns = new _resizableColumns.default(this.options);
    resizableColumns.build();
    assert.equal(resizableColumns.columns.length, 3, "shows all columns");

    var column = resizableColumns.columns[0];
    assert.equal(column.id, '1', "correct first column id");
    assert.equal(column.name, 'Column 1', "correct first column name");
    assert.equal(column.width, 10, "correct first column width");

    column = resizableColumns.columns[1];
    assert.equal(column.id, '2', "correct second column id");
    assert.equal(column.name, 'Column 2', "correct second column name");
    assert.equal(column.width, 10, "correct second colum width");

    column = resizableColumns.columns[2];
    assert.equal(column.id, '3', "correct third column id");
    assert.equal(column.name, 'Column 3', "correct third column name");
    assert.equal(column.width, 10, "correct first column width");
  });

  (0, _qunit.test)('updates the width correctly', function (assert) {
    var resizableColumns = new _resizableColumns.default(this.options);
    resizableColumns.build();

    resizableColumns.updateColumnWidth('1', 5);
    assert.equal(resizableColumns.columns[0].width, 5, "first column should have the correct width");
    assert.equal(resizableColumns.columns[1].width, 10, "second column should have the correct width");
    assert.equal(resizableColumns.columns[2].width, 15, "last column should have the correct width");

    resizableColumns.updateColumnWidth('1', 15);
    assert.equal(resizableColumns.columns[0].width, 15, "first column should have the correct width");
    assert.equal(resizableColumns.columns[1].width, 10, "second column should have the correct width");
    assert.equal(resizableColumns.columns[2].width, 5, "last column should have the correct width");

    // Check if it caches the updated widths
    resizableColumns = new _resizableColumns.default(this.options);
    resizableColumns.build();
    assert.equal(resizableColumns.columns[0].width, 15, "first column should have the correct width");
    assert.equal(resizableColumns.columns[1].width, 10, "second column should have the correct width");
    assert.equal(resizableColumns.columns[2].width, 5, "last column should have the correct width");

    resizableColumns.resetWidths();
    assert.equal(resizableColumns.columns[0].width, 10, "first column should have the correct width");
    assert.equal(resizableColumns.columns[1].width, 10, "second column should have the correct width");
    assert.equal(resizableColumns.columns[2].width, 10, "last column should have the correct width");

    // Table width upate
    resizableColumns.setTableWidth(15);
    assert.equal(resizableColumns.columns[0].width, 5, "first column should have the correct width");
    assert.equal(resizableColumns.columns[1].width, 5, "second column should have the correct width");
    assert.equal(resizableColumns.columns[2].width, 5, "last column should have the correct width");
  });

  (0, _qunit.test)('uses the correct cache key', function (assert) {
    var resizableColumns = new _resizableColumns.default(this.options);
    resizableColumns.build();
    assert.equal(this.options.storage.keys().length, 1, "Only uses one key");
    assert.equal(this.options.storage.keys()[0], 'x-list__my-key', "Uses the correct key");
  });

  (0, _qunit.test)('shows/hides the correct columns', function (assert) {
    this.options.columnSchema[2].visible = false;
    var resizableColumns = new _resizableColumns.default(this.options);
    resizableColumns.build();

    assert.deepEqual(resizableColumns.columns.mapBy('id'), ['1', '2'], "shows/hides according to schema");
    assert.deepEqual(resizableColumns.getColumnVisibility().mapBy('visible'), [true, true, false]);

    resizableColumns.toggleVisibility('3');
    assert.deepEqual(resizableColumns.columns.mapBy('id'), ['1', '2', '3'], "toggles the third column correctly");
    assert.deepEqual(resizableColumns.getColumnVisibility().mapBy('visible'), [true, true, true]);

    resizableColumns.toggleVisibility('1');
    assert.deepEqual(resizableColumns.columns.mapBy('id'), ['2', '3'], "toggles the first column correctly");
    assert.deepEqual(resizableColumns.getColumnVisibility().mapBy('visible'), [false, true, true]);

    // Confirm correct caching
    resizableColumns = new _resizableColumns.default(this.options);
    resizableColumns.build();
    assert.deepEqual(resizableColumns.columns.mapBy('id'), ['2', '3'], "caching overrides schema visibility settings");
    assert.deepEqual(resizableColumns.getColumnVisibility().mapBy('visible'), [false, true, true]);
  });

  (0, _qunit.test)("resets cache correctly if schema doesn't match cache", function (assert) {
    assert.expect(1);
    this.options.storage.removeItem = function (key) {
      assert.equal(key, 'x-list__my-key', "cache was cleared");
    };
    var resizableColumns = new _resizableColumns.default(this.options);
    resizableColumns.build();
    this.options.columnSchema = [{
      id: '1',
      name: 'Column 1',
      visible: true
    }];
    resizableColumns = new _resizableColumns.default(this.options);
    resizableColumns.build();
  });

  (0, _qunit.test)("clears expired cache", function (assert) {
    var sixtyDaysAgo = 1000 * 60 * 60 * 24 * 30 * 2;
    storage['x-list__my-key'] = { updatedAt: Date.now() - sixtyDaysAgo };
    assert.expect(1);
    this.options.storage.removeItem = function (key) {
      assert.equal(key, 'x-list__my-key', "cache was cleared");
    };
    var resizableColumns = new _resizableColumns.default(this.options);
    resizableColumns.build();
  });
});
require('ember-inspector/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
