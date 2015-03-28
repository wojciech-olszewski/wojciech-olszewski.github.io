/* jshint ignore:start */

/* jshint ignore:end */

define('sudoku/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'sudoku/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('sudoku/constraints/cannot-have-duplicated-values', ['exports', 'ember', 'sudoku/constraints/result'], function (exports, Ember, ConstraintResult) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({

    cells: null,

    validate: function validate() {
      var compactValues = this.get("cells").map(function (cell) {
        return cell.get("number");
      }).compact();

      var compactCells = this.get("cells").filter(function (cell) {
        return compactValues.contains(cell.get("number"));
      });

      var isDuplicate = function isDuplicate(cell) {
        var sameValueCells = compactCells.filter(function (innerCell) {
          return cell.get("number") === innerCell.get("number");
        });

        return sameValueCells.length > 1;
      };

      var duplicates = this.get("cells").filter(isDuplicate);

      return ConstraintResult['default'].create({
        valid: 0 === duplicates.length,
        invalidCells: duplicates
      });
    }

  });

});
define('sudoku/constraints/result', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({

    valid: false,
    invalidCells: null,

    init: function init() {
      if (null === this.get("invalidCells")) {
        this.set("invalidCells", []);
      }
    }

  });

});
define('sudoku/constraints/should-have-all-values', ['exports', 'ember', 'sudoku/constraints/result'], function (exports, Ember, ConstraintResult) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({

    allValues: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    cells: null,

    validate: function validate() {
      var values = this.get("cells").map(function (cell) {
        return cell.get("number");
      }).compact();

      return ConstraintResult['default'].create({
        valid: this.get("allValues").every(function (value) {
          return values.contains(value);
        })
      });
    }

  });

});
define('sudoku/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var ARROWS_MAP = {
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40
  };

  exports['default'] = Ember['default'].Controller.extend({

    board: null,

    init: function init() {
      this._super();
      this.set("board", this.get("boardFactoryService").createBoard());

      //    console.log(this.board);
    },

    actions: {
      mouseEnter: function mouseEnter(cell) {},

      mouseLeave: function mouseLeave(cell) {},

      click: function click(cell) {
        this.activateCell(cell);
      },

      arrowPress: function arrowPress(cell, event) {
        this.moveCell(cell, event.which);
      },

      deletePress: function deletePress(cell) {
        cell.set("number", null);
      },

      numberPress: function numberPress(cell, number) {
        cell.set("number", number);
        this.validateBoard();
      }
    },

    activateCell: function activateCell(cell) {
      if (cell.get("isEnabled")) {
        this.get("board.cells").setEach("isActive", false);
        cell.set("isActive", true);
      }
    },

    moveCell: function moveCell(cell, direction) {
      var newActiveCell = null;

      switch (direction) {
        case ARROWS_MAP.ARROW_LEFT:
          newActiveCell = this.get("board").cellLeftFor(cell);
          break;
        case ARROWS_MAP.ARROW_UP:
          newActiveCell = this.get("board").cellUpFor(cell);
          break;
        case ARROWS_MAP.ARROW_RIGHT:
          newActiveCell = this.get("board").cellRightFor(cell);
          break;
        case ARROWS_MAP.ARROW_DOWN:
          newActiveCell = this.get("board").cellDownFor(cell);
          break;
      }

      if (undefined !== newActiveCell) {
        this.activateCell(newActiveCell);
      }
    },

    validateBoard: function validateBoard() {
      var result = this.get("boardValidatorService").validate(this.get("board"));

      if (!result.get("valid")) {
        this.get("board.cells").setEach("isValid", true);
        result.get("invalidCells").forEach(function (cell) {
          cell.set("isValid", false);
        });
      }
    }

  });

  //      this.get('board').rowCellsFor(cell).setEach('isInvalid', true);
  //      this.get('board').columnCellsFor(cell).setEach('isInvalid', true);

  //      this.get('board').rowCellsFor(cell).setEach('isInvalid', false);
  //      this.get('board').columnCellsFor(cell).setEach('isInvalid', false);

});
define('sudoku/controllers/game/start', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var ARROWS_MAP = {
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40
  };

  exports['default'] = Ember['default'].Controller.extend({

    board: null,

    init: function init() {
      this._super();
      this.set("board", this.get("boardFactoryService").createBoard());

      //    console.log(this.board);
    },

    actions: {
      mouseEnter: function mouseEnter(cell) {},

      mouseLeave: function mouseLeave(cell) {},

      click: function click(cell) {
        this.activateCell(cell);
      },

      arrowPress: function arrowPress(cell, event) {
        this.moveCell(cell, event.which);
      },

      deletePress: function deletePress(cell) {
        cell.set("number", null);
      },

      numberPress: function numberPress(cell, number) {
        cell.set("number", number);
        this.validateBoard();
      }
    },

    activateCell: function activateCell(cell) {
      if (cell.get("isEnabled")) {
        this.get("board.cells").setEach("isActive", false);
        cell.set("isActive", true);
      }
    },

    moveCell: function moveCell(cell, direction) {
      var newActiveCell = null;

      switch (direction) {
        case ARROWS_MAP.ARROW_LEFT:
          newActiveCell = this.get("board").cellLeftFor(cell);
          break;
        case ARROWS_MAP.ARROW_UP:
          newActiveCell = this.get("board").cellUpFor(cell);
          break;
        case ARROWS_MAP.ARROW_RIGHT:
          newActiveCell = this.get("board").cellRightFor(cell);
          break;
        case ARROWS_MAP.ARROW_DOWN:
          newActiveCell = this.get("board").cellDownFor(cell);
          break;
      }

      if (undefined !== newActiveCell) {
        this.activateCell(newActiveCell);
      }
    },

    validateBoard: function validateBoard() {
      var result = this.get("boardValidatorService").validate(this.get("board"));

      if (!result.get("valid")) {
        this.get("board.cells").setEach("isValid", true);
        result.get("invalidCells").forEach(function (cell) {
          cell.set("isValid", false);
        });
      }
    }

  });

  //      this.get('board').rowCellsFor(cell).setEach('isInvalid', true);
  //      this.get('board').columnCellsFor(cell).setEach('isInvalid', true);

  //      this.get('board').rowCellsFor(cell).setEach('isInvalid', false);
  //      this.get('board').columnCellsFor(cell).setEach('isInvalid', false);

});
define('sudoku/initializers/app-version', ['exports', 'sudoku/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('sudoku/initializers/board-factory-service', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject("controller", "boardFactoryService", "service:board-factory");
  }

  exports['default'] = {
    name: "board-factory-service",
    initialize: initialize
  };

});
define('sudoku/initializers/board-initializer-service', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject("service:board-factory", "boardInitializerService", "service:board-initializer");
  }

  exports['default'] = {
    name: "board-initializer-service",
    initialize: initialize
  };

});
define('sudoku/initializers/board-validator-service', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    application.inject("controller", "boardValidatorService", "service:board-validator");
  }

  exports['default'] = {
    name: "board-validator-service",
    initialize: initialize
  };

});
define('sudoku/initializers/export-application-global', ['exports', 'ember', 'sudoku/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('sudoku/models/block', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({

    x1: null,
    x2: null,

    y1: null,
    y2: null,

    cells: null,

    contains: function contains(cell) {
      return this.get("cells").find(function (blockCell) {
        return blockCell.isSame(cell);
      });
    }

  });

});
define('sudoku/models/board', ['exports', 'ember', 'sudoku/models/cell', 'sudoku/models/block'], function (exports, Ember, Cell, Block) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({

    cells: null,
    blocks: null,
    constraints: null,

    init: function init() {
      var board = this;
      var x;
      var y;

      board._super();
      board.set("cells", []);
      board.set("blocks", []);
      board.set("constraints", []);

      for (x = 0; x < 9; x++) {
        for (y = 0; y < 9; y++) {
          board.get("cells").addObject(Cell['default'].create({
            x: x,
            y: y
          }));
        }
      }

      var cellsForBlockFilter = function cellsForBlockFilter(cell) {
        return cell.get("x") >= x1 && cell.get("x") <= x2 && cell.get("y") >= y1 && cell.get("y") <= y2;
      };

      for (x = 0; x < 9; x += 3) {
        for (y = 0; y < 9; y += 3) {
          var x1 = x;
          var x2 = x + 2;
          var y1 = y;
          var y2 = y + 2;

          this.get("blocks").addObject(Block['default'].create({
            x1: x1,
            x2: x2,
            y1: y1,
            y2: y2,
            cells: board.get("cells").filter(cellsForBlockFilter)
          }));
        }
      }
    },

    rows: (function () {
      var rows = [];
      for (var x = 0; x < 9; x++) {
        rows.addObject(this.rowCellsFor(this.cellAt(x, x)));
      }

      return rows;
    }).property(),

    columns: (function () {
      var columns = [];
      for (var y = 0; y < 9; y++) {
        columns.addObject(this.columnCellsFor(this.cellAt(y, y)));
      }

      return columns;
    }).property(),

    blockCellsFor: function blockCellsFor(relativeCell) {
      var block = this.get("blocks").find(function (block) {
        return block.contains(relativeCell);
      });

      if (undefined === block) {
        return [];
      }

      return block.cells;
    },

    rowCellsFor: function rowCellsFor(relativeCell) {
      return this.get("cells").filter(function (cell) {
        return cell.isInRowWith(relativeCell);
      });
    },

    columnCellsFor: function columnCellsFor(relativeCell) {
      return this.get("cells").filter(function (cell) {
        return cell.isInColumnWith(relativeCell);
      });
    },

    cellLeftFor: function cellLeftFor(relativeCell) {
      return this.cellAt(relativeCell.get("x"), relativeCell.get("y") - 1);
    },

    cellUpFor: function cellUpFor(relativeCell) {
      return this.cellAt(relativeCell.get("x") - 1, relativeCell.get("y"));
    },

    cellRightFor: function cellRightFor(relativeCell) {
      return this.cellAt(relativeCell.get("x"), relativeCell.get("y") + 1);
    },

    cellDownFor: function cellDownFor(relativeCell) {
      return this.cellAt(relativeCell.get("x") + 1, relativeCell.get("y"));
    },

    cellAt: function cellAt(x, y) {
      return this.get("cells").find(function (cell) {
        return cell.get("x") === x && cell.get("y") === y;
      });
    }

  });

});
define('sudoku/models/cell', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({

    number: null,
    x: null,
    y: null,
    isActive: false,
    isValid: true,
    isEnabled: false,

    isSame: function isSame(cell) {
      return cell.get("x") === this.get("x") && cell.get("y") === this.get("y");
    },

    isInRowWith: function isInRowWith(cell) {
      return cell.get("x") === this.get("x");
    },

    isInColumnWith: function isInColumnWith(cell) {
      return cell.get("y") === this.get("y");
    }

  });

});
define('sudoku/router', ['exports', 'ember', 'sudoku/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route("game", function () {
      this.route("index", { path: "/" });
      this.route("start", { path: "/start" });
      this.route("end", { path: "/end" });
    });
  });

  exports['default'] = Router;

});
define('sudoku/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function beforeModel() {
      this.transitionTo("game.index");
    }
  });

});
define('sudoku/routes/game/end', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('sudoku/routes/game/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('sudoku/routes/game/start', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('sudoku/services/board-factory', ['exports', 'ember', 'sudoku/models/board', 'sudoku/constraints/cannot-have-duplicated-values', 'sudoku/constraints/should-have-all-values'], function (exports, Ember, Board, CannotHaveDuplicatedValuesConstraint, ShouldHaveAllValuesConstraint) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({

    createBoard: function createBoard() {
      return this.applyConstraints(this.initialize(Board['default'].create()));
    },

    applyConstraints: function applyConstraints(board) {
      var applyConstraintsForCells = function applyConstraintsForCells(cells) {
        board.get("constraints").pushObjects([CannotHaveDuplicatedValuesConstraint['default'].create({ cells: cells }), ShouldHaveAllValuesConstraint['default'].create({ cells: cells })]);
      };

      board.get("blocks").forEach(function (block) {
        applyConstraintsForCells(block.get("cells"));
      });

      board.get("rows").forEach(function (row) {
        applyConstraintsForCells(row);
      });

      board.get("columns").forEach(function (column) {
        applyConstraintsForCells(column);
      });

      return board;
    },

    initialize: function initialize(board) {
      return this.get("boardInitializerService").initialize(board);
    }

  });

});
define('sudoku/services/board-initializer', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({

    initialize: function initialize(board) {
      var numbers = [[7, 1, 8, 5, 4, 3, 6, 2, 9], [6, 9, 3, 2, 1, 8, 5, 7, 4], [5, 4, 2, 9, 7, 6, 3, 1, 8], [4, 3, 5, 7, 9, 1, 8, 6, 2], [1, 6, 7, 8, 3, 2, 4, 9, 5], [2, 8, 9, 4, 6, 5, 7, 3, 1], [8, 5, 1, 6, 2, 7, 9, 4, 3], [9, 2, 6, 3, 5, 4, 1, 8, 7], [3, 7, 4, 1, 8, 9, 2, 5, 6]];

      numbers.forEach(function (row, x) {
        row.forEach(function (number, y) {
          board.cellAt(x, y).set("number", number);
        });
      });

      var getRandom = function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };

      var getRandomCell = function getRandomCell(board) {
        return board.cellAt(getRandom(0, 8), getRandom(0, 8));
      };

      var cellsToDisable = getRandom(40, 60);
      var cell;
      while (cellsToDisable > 0) {
        cell = getRandomCell(board);

        if (null !== cell.get("number")) {
          cell.set("number", null);
          cellsToDisable--;
        }
      }

      board.get("cells").forEach(function (cell) {
        if (null === cell.get("number")) {
          cell.set("isEnabled", true);
        }
      });

      return board;
    }

  });

});
define('sudoku/services/board-validator', ['exports', 'ember', 'sudoku/constraints/result'], function (exports, Ember, ConstraintResult) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({

    validate: function validate(board) {
      var results = board.get("constraints").map(function (constraint) {
        return constraint.validate();
      });

      return ConstraintResult['default'].create({
        valid: results.every(function (result) {
          return result.get("valid");
        }),
        invalidCells: results
        // here we have to reduce result object to concatenated invalidCells array
        .reduce(function (reduce, result) {
          return reduce.concat(result.get("invalidCells"));
        }, [])
        // here we have to reduce duplicated objects
        .reduce(function (reduce, cell) {
          if (undefined === reduce.find(function (uniqCell) {
            return uniqCell.isSame(cell);
          })) {
            reduce.addObject(cell);
          }

          return reduce;
        }, [])
      });
    }

  });

});
define('sudoku/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('sudoku/templates/cell', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","point");
        var el2 = dom.createTextNode("\n    x = ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(", y = ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","number");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,0,1);
        var morph1 = dom.createMorphAt(element0,1,2);
        var morph2 = dom.createMorphAt(dom.childAt(fragment, [2]),0,1);
        content(env, morph0, context, "cell.x");
        content(env, morph1, context, "cell.y");
        content(env, morph2, context, "cell.number");
        return fragment;
      }
    };
  }()));

});
define('sudoku/templates/game/end', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("index");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("start");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("end");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("end");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[4]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        var morph1 = dom.createMorphAt(fragment,1,2,contextualElement);
        var morph2 = dom.createMorphAt(fragment,2,3,contextualElement);
        var morph3 = dom.createMorphAt(fragment,3,4,contextualElement);
        content(env, morph0, context, "outlet");
        block(env, morph1, context, "link-to", ["game.index"], {}, child0, null);
        block(env, morph2, context, "link-to", ["game.start"], {}, child1, null);
        block(env, morph3, context, "link-to", ["game.end"], {}, child2, null);
        return fragment;
      }
    };
  }()));

});
define('sudoku/templates/game/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createElement("button");
          dom.setAttribute(el0,"class","game-start");
          var el1 = dom.createTextNode("start");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        block(env, morph0, context, "link-to", ["game.start"], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('sudoku/templates/game/start', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            inline(env, morph0, context, "view", ["cell"], {"cell": get(env, context, "cell")});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","block");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,1);
          block(env, morph0, context, "each", [get(env, context, "block.cells")], {"keyword": "cell"}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("index");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("start");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("end");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","board");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[4]); }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,-1);
        var morph1 = dom.createMorphAt(fragment,1,2,contextualElement);
        var morph2 = dom.createMorphAt(fragment,2,3,contextualElement);
        var morph3 = dom.createMorphAt(fragment,3,4,contextualElement);
        block(env, morph0, context, "each", [get(env, context, "board.blocks")], {"keyword": "block"}, child0, null);
        block(env, morph1, context, "link-to", ["game.index"], {}, child1, null);
        block(env, morph2, context, "link-to", ["game.start"], {}, child2, null);
        block(env, morph3, context, "link-to", ["game.end"], {}, child3, null);
        return fragment;
      }
    };
  }()));

});
define('sudoku/tests/app.jshint', function () {

  'use strict';

  describe('JSHint - app.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'app.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/constraints/cannot-have-duplicated-values.jshint', function () {

  'use strict';

  describe('JSHint - constraints/cannot-have-duplicated-values.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'constraints/cannot-have-duplicated-values.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/constraints/result.jshint', function () {

  'use strict';

  describe('JSHint - constraints/result.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'constraints/result.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/constraints/should-have-all-values.jshint', function () {

  'use strict';

  describe('JSHint - constraints/should-have-all-values.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'constraints/should-have-all-values.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/controllers/application.jshint', function () {

  'use strict';

  describe('JSHint - controllers/application.js', function(){
  it('should pass jshint', function() { 
    expect(false, 'controllers/application.js should pass jshint.\ncontrollers/application.js: line 22, col 26, \'cell\' is defined but never used.\ncontrollers/application.js: line 27, col 26, \'cell\' is defined but never used.\n\n2 errors').to.be.ok; 
  })});

});
define('sudoku/tests/controllers/game/start.jshint', function () {

  'use strict';

  describe('JSHint - controllers/game/start.js', function(){
  it('should pass jshint', function() { 
    expect(false, 'controllers/game/start.js should pass jshint.\ncontrollers/game/start.js: line 22, col 26, \'cell\' is defined but never used.\ncontrollers/game/start.js: line 27, col 26, \'cell\' is defined but never used.\n\n2 errors').to.be.ok; 
  })});

});
define('sudoku/tests/helpers/resolver', ['exports', 'ember/resolver', 'sudoku/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('sudoku/tests/helpers/resolver.jshint', function () {

  'use strict';

  describe('JSHint - helpers/resolver.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'helpers/resolver.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/helpers/start-app', ['exports', 'ember', 'sudoku/app', 'sudoku/router', 'sudoku/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('sudoku/tests/helpers/start-app.jshint', function () {

  'use strict';

  describe('JSHint - helpers/start-app.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'helpers/start-app.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/initializers/board-factory-service.jshint', function () {

  'use strict';

  describe('JSHint - initializers/board-factory-service.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'initializers/board-factory-service.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/initializers/board-initializer-service.jshint', function () {

  'use strict';

  describe('JSHint - initializers/board-initializer-service.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'initializers/board-initializer-service.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/initializers/board-validator-service.jshint', function () {

  'use strict';

  describe('JSHint - initializers/board-validator-service.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'initializers/board-validator-service.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/models/block.jshint', function () {

  'use strict';

  describe('JSHint - models/block.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'models/block.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/models/board.jshint', function () {

  'use strict';

  describe('JSHint - models/board.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'models/board.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/models/cell.jshint', function () {

  'use strict';

  describe('JSHint - models/cell.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'models/cell.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/router.jshint', function () {

  'use strict';

  describe('JSHint - router.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'router.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/routes/application.jshint', function () {

  'use strict';

  describe('JSHint - routes/application.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'routes/application.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/routes/game/end.jshint', function () {

  'use strict';

  describe('JSHint - routes/game/end.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'routes/game/end.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/routes/game/index.jshint', function () {

  'use strict';

  describe('JSHint - routes/game/index.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'routes/game/index.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/routes/game/start.jshint', function () {

  'use strict';

  describe('JSHint - routes/game/start.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'routes/game/start.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/services/board-factory.jshint', function () {

  'use strict';

  describe('JSHint - services/board-factory.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'services/board-factory.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/services/board-initializer.jshint', function () {

  'use strict';

  describe('JSHint - services/board-initializer.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'services/board-initializer.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/services/board-validator.jshint', function () {

  'use strict';

  describe('JSHint - services/board-validator.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'services/board-validator.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/test-helper', ['sudoku/tests/helpers/resolver', 'ember-mocha'], function (resolver, ember_mocha) {

	'use strict';

	ember_mocha.setResolver(resolver['default']);

});
define('sudoku/tests/test-helper.jshint', function () {

  'use strict';

  describe('JSHint - test-helper.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'test-helper.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/constraints/cannot-have-duplicated-values-test', ['chai', 'mocha', 'sudoku/constraints/cannot-have-duplicated-values', 'sudoku/models/cell'], function (chai, mocha, CannotHaveDuplicatedValuesConstraint, Cell) {

  'use strict';

  /* jshint expr:true */
  mocha.describe("CannotHaveDuplicatedValuesConstraint", function () {
    mocha.it("CannotHaveDuplicatedValuesConstraint.validate() pass for nulls", function () {
      var constraint = CannotHaveDuplicatedValuesConstraint['default'].create({
        cells: [Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null })]
      });

      var result = constraint.validate();
      chai.assert.isObject(result);
      chai.expect(result.get("valid")).to.be["true"];
      chai.expect(result.get("invalidCells").length).to.be.eq(0);
    });

    mocha.it("CannotHaveDuplicatedValuesConstraint.validate() pass for non duplicated values & nulls", function () {
      var constraint = CannotHaveDuplicatedValuesConstraint['default'].create({
        cells: [Cell['default'].create({ number: 1 }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null })]
      });

      var result = constraint.validate();
      chai.assert.isObject(result);
      chai.expect(result.get("valid")).to.be["true"];
      chai.expect(result.get("invalidCells").length).to.be.eq(0);
    });

    mocha.it("CannotHaveDuplicatedValuesConstraint.validate() pass for non duplicated values", function () {
      var constraint = CannotHaveDuplicatedValuesConstraint['default'].create({
        cells: [Cell['default'].create({ number: 1 }), Cell['default'].create({ number: 2 }), Cell['default'].create({ number: 3 }), Cell['default'].create({ number: 4 }), Cell['default'].create({ number: 5 }), Cell['default'].create({ number: 6 }), Cell['default'].create({ number: 7 }), Cell['default'].create({ number: 8 }), Cell['default'].create({ number: 9 })]
      });

      var result = constraint.validate();
      chai.assert.isObject(result);
      chai.expect(result.get("valid")).to.be["true"];
      chai.expect(result.get("invalidCells").length).to.be.eq(0);
    });

    mocha.it("CannotHaveDuplicatedValuesConstraint.validate() fails for duplicated values & nulls", function () {
      var duplicatedNumber = 1;
      var constraint = CannotHaveDuplicatedValuesConstraint['default'].create({
        cells: [Cell['default'].create({ number: duplicatedNumber }), Cell['default'].create({ number: duplicatedNumber }), Cell['default'].create({ number: duplicatedNumber }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null })]
      });

      var result = constraint.validate();
      chai.assert.isObject(result);
      chai.expect(result.get("valid")).to.be["false"];
      chai.expect(result.get("invalidCells").length).to.be.eq(3);
      chai.expect(result.get("invalidCells.firstObject.number")).to.be.eq(duplicatedNumber);
    });
  });

});
define('sudoku/tests/unit/constraints/cannot-have-duplicated-values-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/constraints/cannot-have-duplicated-values-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/constraints/cannot-have-duplicated-values-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/constraints/should-have-all-values-test', ['chai', 'mocha', 'sudoku/constraints/should-have-all-values', 'sudoku/models/cell'], function (chai, mocha, ShouldHaveAllValuesConstraint, Cell) {

  'use strict';

  /* jshint expr:true */
  mocha.describe("ShouldHaveAllValuesConstraint", function () {
    mocha.it("ShouldHaveAllValuesConstraint.validate() fails for nulls", function () {
      var constraint = ShouldHaveAllValuesConstraint['default'].create({
        cells: [Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null })]
      });

      var result = constraint.validate();
      chai.assert.isObject(result);
      chai.expect(result.get("valid")).to.be["false"];
    });

    mocha.it("ShouldHaveAllValuesConstraint.validate() fails for duplicated values", function () {
      var constraint = ShouldHaveAllValuesConstraint['default'].create({
        cells: [Cell['default'].create({ number: 1 }), Cell['default'].create({ number: 1 }), Cell['default'].create({ number: 1 }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null })]
      });

      var result = constraint.validate();
      chai.assert.isObject(result);
      chai.expect(result.get("valid")).to.be["false"];
    });

    mocha.it("ShouldHaveAllValuesConstraint.validate() fails for non all values", function () {
      var constraint = ShouldHaveAllValuesConstraint['default'].create({
        cells: [Cell['default'].create({ number: 1 }), Cell['default'].create({ number: 2 }), Cell['default'].create({ number: 3 }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null }), Cell['default'].create({ number: null })]
      });

      var result = constraint.validate();
      chai.assert.isObject(result);
      chai.expect(result.get("valid")).to.be["false"];
    });

    mocha.it("ShouldHaveAllValuesConstraint.validate() pass for unique all values", function () {
      var constraint = ShouldHaveAllValuesConstraint['default'].create({
        cells: [Cell['default'].create({ number: 1 }), Cell['default'].create({ number: 2 }), Cell['default'].create({ number: 3 }), Cell['default'].create({ number: 4 }), Cell['default'].create({ number: 5 }), Cell['default'].create({ number: 6 }), Cell['default'].create({ number: 7 }), Cell['default'].create({ number: 8 }), Cell['default'].create({ number: 9 })]
      });

      var result = constraint.validate();
      chai.assert.isObject(result);
      chai.expect(result.get("valid")).to.be["true"];
    });
  });

});
define('sudoku/tests/unit/constraints/should-have-all-values-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/constraints/should-have-all-values-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/constraints/should-have-all-values-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/controllers/game/start-test', ['chai', 'ember-mocha'], function (chai, ember_mocha) {

  'use strict';

  /* jshint expr:true */
  ember_mocha.describeModule("controller:game/start", "GameStartController", {}, function () {
    // Replace this with your real tests.
    ember_mocha.it("exists", function () {
      var controller = this.subject();
      chai.expect(controller).to.be.ok;
    });
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('sudoku/tests/unit/controllers/game/start-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/controllers/game/start-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/controllers/game/start-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/models/board-test', ['chai', 'mocha', 'sudoku/models/board', 'sudoku/models/cell'], function (chai, mocha, Board, Cell) {

  'use strict';

  /* jshint expr:true */
  mocha.describe("Board", function () {
    mocha.it("Board.create() returns board with cells & blocks", function () {
      var board = Board['default'].create();

      chai.expect(board).to.be.ok;
      chai.assert.isArray(board.cells);
      chai.expect(board.cells.length).to.be.equal(81);

      board.cells.forEach(function (cell) {
        chai.expect(cell).to.be.ok;
        chai.assert.isNumber(cell.x);
        chai.assert.isNumber(cell.y);
      });

      chai.expect(board.blocks.length).to.be.equal(9);
    });

    mocha.it("Board.blockCellsFor() returns array with correct cells for valid relative cell", function () {
      var board = Board['default'].create();
      var testCases = [{
        relativeCell: Cell['default'].create({ x: 0, y: 0 }),
        blockCells: [Cell['default'].create({ x: 0, y: 0 }), Cell['default'].create({ x: 0, y: 1 }), Cell['default'].create({ x: 0, y: 2 }), Cell['default'].create({ x: 1, y: 0 }), Cell['default'].create({ x: 1, y: 1 }), Cell['default'].create({ x: 1, y: 2 }), Cell['default'].create({ x: 2, y: 0 }), Cell['default'].create({ x: 2, y: 1 }), Cell['default'].create({ x: 2, y: 2 })]
      }, {
        relativeCell: Cell['default'].create({ x: 2, y: 2 }),
        blockCells: [Cell['default'].create({ x: 0, y: 0 }), Cell['default'].create({ x: 0, y: 1 }), Cell['default'].create({ x: 0, y: 2 }), Cell['default'].create({ x: 1, y: 0 }), Cell['default'].create({ x: 1, y: 1 }), Cell['default'].create({ x: 1, y: 2 }), Cell['default'].create({ x: 2, y: 0 }), Cell['default'].create({ x: 2, y: 1 }), Cell['default'].create({ x: 2, y: 2 })]
      }, {
        relativeCell: Cell['default'].create({ x: 4, y: 4 }),
        blockCells: [Cell['default'].create({ x: 3, y: 3 }), Cell['default'].create({ x: 3, y: 4 }), Cell['default'].create({ x: 3, y: 5 }), Cell['default'].create({ x: 4, y: 3 }), Cell['default'].create({ x: 4, y: 4 }), Cell['default'].create({ x: 4, y: 5 }), Cell['default'].create({ x: 5, y: 3 }), Cell['default'].create({ x: 5, y: 4 }), Cell['default'].create({ x: 5, y: 5 })]
      }, {
        relativeCell: Cell['default'].create({ x: 6, y: 6 }),
        blockCells: [Cell['default'].create({ x: 6, y: 6 }), Cell['default'].create({ x: 6, y: 7 }), Cell['default'].create({ x: 6, y: 8 }), Cell['default'].create({ x: 7, y: 6 }), Cell['default'].create({ x: 7, y: 7 }), Cell['default'].create({ x: 7, y: 8 }), Cell['default'].create({ x: 8, y: 6 }), Cell['default'].create({ x: 8, y: 7 }), Cell['default'].create({ x: 8, y: 8 })]
      }, {
        relativeCell: Cell['default'].create({ x: 8, y: 8 }),
        blockCells: [Cell['default'].create({ x: 6, y: 6 }), Cell['default'].create({ x: 6, y: 7 }), Cell['default'].create({ x: 6, y: 8 }), Cell['default'].create({ x: 7, y: 6 }), Cell['default'].create({ x: 7, y: 7 }), Cell['default'].create({ x: 7, y: 8 }), Cell['default'].create({ x: 8, y: 6 }), Cell['default'].create({ x: 8, y: 7 }), Cell['default'].create({ x: 8, y: 8 })]
      }, {
        relativeCell: Cell['default'].create({ x: 0, y: 8 }),
        blockCells: [Cell['default'].create({ x: 0, y: 6 }), Cell['default'].create({ x: 0, y: 7 }), Cell['default'].create({ x: 0, y: 8 }), Cell['default'].create({ x: 1, y: 6 }), Cell['default'].create({ x: 1, y: 7 }), Cell['default'].create({ x: 1, y: 8 }), Cell['default'].create({ x: 2, y: 6 }), Cell['default'].create({ x: 2, y: 7 }), Cell['default'].create({ x: 2, y: 8 })]
      }, {
        relativeCell: Cell['default'].create({ x: 6, y: 2 }),
        blockCells: [Cell['default'].create({ x: 6, y: 0 }), Cell['default'].create({ x: 6, y: 1 }), Cell['default'].create({ x: 6, y: 2 }), Cell['default'].create({ x: 7, y: 0 }), Cell['default'].create({ x: 7, y: 1 }), Cell['default'].create({ x: 7, y: 2 }), Cell['default'].create({ x: 8, y: 0 }), Cell['default'].create({ x: 8, y: 1 }), Cell['default'].create({ x: 8, y: 2 })]
      }];

      testCases.forEach(function (testCase) {
        var blockCells = board.blockCellsFor(testCase.relativeCell);
        chai.expect(blockCells.length).to.be.equal(testCase.blockCells.length).and.to.be.equal(9);

        blockCells.forEach(function (blockCell) {
          chai.expect(testCase.blockCells.find(function (testCaseBlockCell) {
            return testCaseBlockCell.isSame(blockCell);
          })).to.be.ok;
        });
      });
    });

    mocha.it("Board.rows() returns array", function () {
      var rows = Board['default'].create().get("rows");

      chai.assert.isArray(rows);
      chai.expect(rows.length).to.be.equal(9);

      rows.forEach(function (row) {
        chai.assert.isArray(row);
        chai.expect(row.length).to.be.equal(9);
      });
    });

    mocha.it("Board.columns() returns array", function () {
      var columns = Board['default'].create().get("columns");

      chai.assert.isArray(columns);
      chai.expect(columns.length).to.be.equal(9);

      columns.forEach(function (column) {
        chai.assert.isArray(column);
        chai.expect(column.length).to.be.equal(9);
      });
    });

    mocha.it("Board.blockCellsFor() returns empty array for invalid relative cell", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 100,
        y: 100
      });
      var row = board.rowCellsFor(relativeCell);

      chai.assert.isArray(row);
      chai.expect(row.length).to.be.equal(0);
    });

    mocha.it("Board.rowCellsFor() returns array with correct cells for valid relative cell", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 0,
        y: 0
      });
      var row = board.rowCellsFor(relativeCell);

      chai.assert.isArray(row);
      chai.expect(row.length).to.be.equal(9);

      row.forEach(function (cell) {
        chai.expect(cell.x).to.be.equal(relativeCell.x);
      });
    });

    mocha.it("Board.rowCellsFor() returns empty array for invalid relative cell", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 100,
        y: 100
      });
      var row = board.rowCellsFor(relativeCell);

      chai.assert.isArray(row);
      chai.expect(row.length).to.be.equal(0);
    });

    mocha.it("Board.columnCellsFor() for valid relative cell", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 8,
        y: 8
      });
      var row = board.columnCellsFor(relativeCell);

      chai.assert.isArray(row);
      chai.expect(row.length).to.be.equal(9);

      row.forEach(function (cell) {
        chai.expect(cell.y).to.be.equal(relativeCell.y);
      });
    });

    mocha.it("Board.columnCellsFor() for invalid relative cell", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 100,
        y: 100
      });
      var row = board.columnCellsFor(relativeCell);

      chai.assert.isArray(row);
      chai.expect(row.length).to.be.equal(0);
    });

    mocha.it("Board.cellLeftFor() valid case", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 4,
        y: 4
      });
      var cell = board.cellLeftFor(relativeCell);

      chai.expect(cell).to.be.ok;
      chai.expect(cell.x).to.be.equal(relativeCell.x);
      chai.expect(cell.y).to.be.equal(relativeCell.y - 1);
    });

    mocha.it("Board.cellLeftFor() edge case", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 0,
        y: 0
      });
      var cell = board.cellLeftFor(relativeCell);

      chai.assert.isUndefined(cell);
    });

    mocha.it("Board.cellUpFor() valid case", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 4,
        y: 4
      });
      var cell = board.cellUpFor(relativeCell);

      chai.expect(cell).to.be.ok;
      chai.expect(cell.x).to.be.equal(relativeCell.x - 1);
      chai.expect(cell.y).to.be.equal(relativeCell.y);
    });

    mocha.it("Board.cellUpFor() edge case", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 0,
        y: 0
      });
      var cell = board.cellUpFor(relativeCell);

      chai.assert.isUndefined(cell);
    });

    mocha.it("Board.cellRightFor() valid case", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 4,
        y: 4
      });
      var cell = board.cellRightFor(relativeCell);

      chai.expect(cell).to.be.ok;
      chai.expect(cell.x).to.be.equal(relativeCell.x);
      chai.expect(cell.y).to.be.equal(relativeCell.y + 1);
    });

    mocha.it("Board.cellRightFor() edge case", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 0,
        y: 8
      });
      var cell = board.cellRightFor(relativeCell);

      chai.assert.isUndefined(cell);
    });

    mocha.it("Board.cellDownFor() valid case", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 4,
        y: 4
      });
      var cell = board.cellDownFor(relativeCell);

      chai.expect(cell).to.be.ok;
      chai.expect(cell.x).to.be.equal(relativeCell.x + 1);
      chai.expect(cell.y).to.be.equal(relativeCell.y);
    });

    mocha.it("Board.cellDownFor() edge case", function () {
      var board = Board['default'].create();
      var relativeCell = Cell['default'].create({
        x: 8,
        y: 8
      });
      var cell = board.cellDownFor(relativeCell);

      chai.assert.isUndefined(cell);
    });

    mocha.it("Board.cellAt() valid case", function () {
      var board = Board['default'].create();
      var x = 4;
      var y = 4;
      var cell = board.cellAt(x, y);

      chai.expect(cell).to.be.ok;
      chai.expect(cell.x).to.be.equal(x);
      chai.expect(cell.y).to.be.equal(y);
    });

    mocha.it("Board.cellAt() edge case", function () {
      var board = Board['default'].create();
      var cell = board.cellAt(100, 100);

      chai.assert.isUndefined(cell);
    });
  });

});
define('sudoku/tests/unit/models/board-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/models/board-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/models/board-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/models/cell-test', ['chai', 'mocha', 'sudoku/models/cell'], function (chai, mocha, Cell) {

  'use strict';

  /* jshint expr:true */
  mocha.describe("Cell", function () {
    mocha.it("Cell.isSame() with valid cell", function () {
      var cell = Cell['default'].create({
        x: 0,
        y: 0
      });

      var relativeCell = Cell['default'].create({
        x: 0,
        y: 0
      });

      chai.expect(cell.isSame(relativeCell)).to.be["true"];
    });

    mocha.it("Cell.isSame() with invalid cell", function () {
      var cell = Cell['default'].create({
        x: 0,
        y: 0
      });

      var relativeCell = Cell['default'].create({
        x: 1,
        y: 1
      });

      chai.expect(cell.isSame(relativeCell)).to.be["false"];
    });

    mocha.it("Cell.isInRowWith() with valid cell", function () {
      var cell = Cell['default'].create({
        x: 0,
        y: 0
      });

      var relativeCell = Cell['default'].create({
        x: 0,
        y: 1
      });

      chai.expect(cell.isInRowWith(relativeCell)).to.be["true"];
    });

    mocha.it("Cell.isInRowWith() with invalid cell", function () {
      var cell = Cell['default'].create({
        x: 0,
        y: 0
      });

      var relativeCell = Cell['default'].create({
        x: 1,
        y: 1
      });

      chai.expect(cell.isInRowWith(relativeCell)).to.be["false"];
    });

    mocha.it("Cell.isInColumnWith() with valid cell", function () {
      var cell = Cell['default'].create({
        x: 0,
        y: 0
      });

      var relativeCell = Cell['default'].create({
        x: 1,
        y: 0
      });

      chai.expect(cell.isInColumnWith(relativeCell)).to.be["true"];
    });

    mocha.it("Cell.isInColumnWith() with invalid cell", function () {
      var cell = Cell['default'].create({
        x: 0,
        y: 0
      });

      var relativeCell = Cell['default'].create({
        x: 1,
        y: 1
      });

      chai.expect(cell.isInColumnWith(relativeCell)).to.be["false"];
    });
  });

});
define('sudoku/tests/unit/models/cell-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/models/cell-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/models/cell-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/routes/application-test', ['chai', 'ember-mocha'], function (chai, ember_mocha) {

  'use strict';

  /* jshint expr:true */
  ember_mocha.describeModule("route:application", "ApplicationRoute", {}, function () {
    ember_mocha.it("exists", function () {
      var route = this.subject();
      chai.expect(route).to.be.ok;
    });
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('sudoku/tests/unit/routes/application-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/routes/application-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/routes/application-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/routes/game/end-test', ['chai', 'ember-mocha'], function (chai, ember_mocha) {

  'use strict';

  /* jshint expr:true */
  ember_mocha.describeModule("route:game/end", "GameEndRoute", {}, function () {
    ember_mocha.it("exists", function () {
      var route = this.subject();
      chai.expect(route).to.be.ok;
    });
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('sudoku/tests/unit/routes/game/end-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/routes/game/end-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/routes/game/end-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/routes/game/index-test', ['chai', 'ember-mocha'], function (chai, ember_mocha) {

  'use strict';

  /* jshint expr:true */
  ember_mocha.describeModule("route:game/index", "GameIndexRoute", {}, function () {
    ember_mocha.it("exists", function () {
      var route = this.subject();
      chai.expect(route).to.be.ok;
    });
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('sudoku/tests/unit/routes/game/index-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/routes/game/index-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/routes/game/index-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/routes/game/start-test', ['chai', 'ember-mocha'], function (chai, ember_mocha) {

  'use strict';

  /* jshint expr:true */
  ember_mocha.describeModule("route:game/start", "GameStartRoute", {}, function () {
    ember_mocha.it("exists", function () {
      var route = this.subject();
      chai.expect(route).to.be.ok;
    });
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('sudoku/tests/unit/routes/game/start-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/routes/game/start-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/routes/game/start-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/services/board-factory-test', ['chai', 'ember-mocha', 'sudoku/models/cell'], function (chai, ember_mocha, Cell) {

  'use strict';

  /* jshint expr:true */
  ember_mocha.describeModule("service:board-factory", "BoardFactoryService", {}, function () {
    ember_mocha.it("createBoard()", function () {
      var factory = this.subject();

      chai.expect(factory).to.be.ok;
      chai.expect(factory.createBoard).to.be["function"];
    });
  });

});
define('sudoku/tests/unit/services/board-factory-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/services/board-factory-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/services/board-factory-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/unit/services/board-validator-test', ['chai', 'ember-mocha'], function (chai, ember_mocha) {

  'use strict';

  /* jshint expr:true */
  ember_mocha.describeModule("service:board-validator", "BoardValidatorService", {
    needs: ["service:board-factory"]
  }, function () {

    var assertCell = function assertCell(testedCell, board) {
      var cell = board.cellAt(testedCell.get("x"), testedCell.get("y"));

      chai.expect(cell).to.be.ok;
      chai.expect(cell.get("number")).to.be.eq(testedCell.get("number"));
    };

    var createBoardFactoryService = function createBoardFactoryService(context) {
      var cells = arguments[1] === undefined ? [] : arguments[1];

      var boardFactoryService = context.container.lookup("service:board-factory");

      boardFactoryService.set("boardInitializerService", {
        initialize: function initialize(board) {
          cells.forEach(function (cell) {
            board.cellAt(cell.x, cell.y).set("number", cell.number);
          });

          board.get("cells").forEach(function (cell) {
            if (null === cell.get("number")) {
              cell.set("isEnabled", true);
            }
          });

          return board;
        }
      });

      return boardFactoryService;
    };

    ember_mocha.it("exists", function () {
      var boardFactoryService = createBoardFactoryService(this);
      var board = boardFactoryService.createBoard();
      var validator = this.subject();

      chai.assert.isObject(validator);
    });

    ember_mocha.it("BoardValidatorService.validate() fails when 2 cells in row are duplicated", function () {
      var boardFactoryService = createBoardFactoryService(this);
      var board = boardFactoryService.createBoard();
      var validator = this.subject();
      var cells = [board.cellAt(0, 0), board.cellAt(0, 8)];

      cells.setEach("number", 1);

      var result = validator.validate(board);

      chai.expect(result).to.be.ok;
      chai.expect(result.get("valid")).to.be["false"];
      chai.expect(result.get("invalidCells").length).to.be.eq(2);

      cells.forEach(function (cell) {
        assertCell(cell, board);
      });
    });

    ember_mocha.it("BoardValidatorService.validate() fails when 2 cells in column are duplicated", function () {
      var boardFactoryService = createBoardFactoryService(this);
      var board = boardFactoryService.createBoard();
      var validator = this.subject();
      var cells = [board.cellAt(0, 0), board.cellAt(8, 0)];

      cells.setEach("number", 1);

      var result = validator.validate(board);

      chai.expect(result).to.be.ok;
      chai.expect(result.get("valid")).to.be["false"];
      chai.expect(result.get("invalidCells").length).to.be.eq(2);

      cells.forEach(function (cell) {
        assertCell(cell, board);
      });
    });

    ember_mocha.it("BoardValidatorService.validate() fails when 2 cells in block are duplicated", function () {
      var boardFactoryService = createBoardFactoryService(this);
      var board = boardFactoryService.createBoard();
      var validator = this.subject();
      var cells = [board.cellAt(0, 0), board.cellAt(0, 1)];

      cells.setEach("number", 1);

      var result = validator.validate(board);

      chai.expect(result).to.be.ok;
      chai.expect(result.get("valid")).to.be["false"];
      chai.expect(result.get("invalidCells").length).to.be.eq(2);

      cells.forEach(function (cell) {
        assertCell(cell, board);
      });
    });

    ember_mocha.it("BoardValidatorService.validate() fails when 2 cells in row & 2 cells in column & 2 cells in block are duplicated", function () {
      var boardFactoryService = createBoardFactoryService(this);
      var board = boardFactoryService.createBoard();
      var validator = this.subject();
      var cells = [
      /**
       * row: board.cellAt(0, 0) + board.cellAt(0, 8)
       * column: board.cellAt(0, 0) + board.cellAt(8, 0)
       * block: board.cellAt(0, 0) + board.cellAt(1, 1)
       */
      board.cellAt(0, 0), board.cellAt(0, 8), board.cellAt(8, 0), board.cellAt(1, 1)];

      cells.setEach("number", 1);
      cells.setEach("number", 1);

      var result = validator.validate(board);

      chai.expect(result).to.be.ok;
      chai.expect(result.get("valid")).to.be["false"];
      chai.expect(result.get("invalidCells").length).to.be.eq(4);

      cells.forEach(function (cell) {
        assertCell(cell, board);
      });
    });

    ember_mocha.it("BoardValidatorService.validate() fails when 2 cells in row & 2 cells in column & 2 cells in block are duplicated", function () {
      var boardFactoryService = createBoardFactoryService(this);
      var board = boardFactoryService.createBoard();
      var validator = this.subject();
      var cells = [
      /**
       * row: board.cellAt(0, 0) + board.cellAt(0, 8)
       * column: board.cellAt(0, 0) + board.cellAt(8, 0)
       * block: board.cellAt(0, 0) + board.cellAt(1, 1)
       */
      board.cellAt(0, 0), board.cellAt(0, 8), board.cellAt(8, 0), board.cellAt(1, 1)];

      cells.setEach("number", 1);

      var result = validator.validate(board);

      chai.expect(result).to.be.ok;
      chai.expect(result.get("valid")).to.be["false"];
      chai.expect(result.get("invalidCells").length).to.be.eq(4);

      cells.forEach(function (cell) {
        assertCell(cell, board);
      });
    });

    ember_mocha.it("BoardValidatorService.validate() fails when board is initiliazed and inserted cell conflicts with preinserted ones in block", function () {
      var boardFactoryService = createBoardFactoryService(this, [
      /**
       * [ ][ ][ ]  [ ][ ][ ]  [ ][ ][ ]
       * [ ][ ][ ]  [ ][ ][ ]  [ ][ ][ ]
       * [ ][ ][ ]  [ ][ ][ ]  [ ][ ][ ]
       *
       * [ ][ ][ ]  [5][1][3]  [ ][ ][ ]
       * [1][ ][ ]  [ ][ ][8]  [ ][ ][ ]
       * [ ][ ][ ]  [9][7][ ]  [ ][ ][ ]
       *
       * [ ][ ][ ]  [1][ ][ ]  [ ][ ][ ]
       * [ ][ ][ ]  [ ][ ][ ]  [ ][ ][ ]
       * [ ][ ][ ]  [ ][ ][ ]  [ ][ ][ ]
       */
      { x: 3, y: 3, number: 5 }, { x: 3, y: 4, number: 1 }, { x: 3, y: 5, number: 3 }, { x: 4, y: 0, number: 1 }, { x: 4, y: 3, number: null }, { x: 4, y: 4, number: null }, { x: 4, y: 5, number: 8 }, { x: 5, y: 3, number: 9 }, { x: 5, y: 4, number: 7 }, { x: 5, y: 5, number: null }, { x: 6, y: 3, number: 1 }]);
      var board = boardFactoryService.createBoard();
      var validator = this.subject();

      /**
       * test case:
       *
       * [ ][ ][ ]  [ ][ ][ ]  [ ][ ][ ]
       * [ ][ ][ ]  [ ][ ][ ]  [ ][ ][ ]
       * [ ][ ][ ]  [ ][ ][ ]  [ ][ ][ ]
       *
       * [ ][ ][ ]  [5][1][3]  [ ][ ][ ]
       * [1][ ][ ]  [1][ ][8]  [ ][ ][ ]
       * [ ][ ][ ]  [9][7][ ]  [ ][ ][ ]
       *
       * [ ][ ][ ]  [1][ ][ ]  [ ][ ][ ]
       * [ ][ ][ ]  [ ][ ][ ]  [ ][ ][ ]
       * [ ][ ][ ]  [ ][ ][ ]  [ ][ ][ ]
       */
      board.cellAt(4, 3).set("number", 1);

      var result = validator.validate(board);

      chai.expect(result).to.be.ok;
      chai.expect(result.get("valid")).to.be["false"];
      chai.expect(result.get("invalidCells").length).to.be.eq(4);

      result.get("invalidCells").forEach(function (cell) {
        assertCell(cell, board);
      });
    });
  });

});
define('sudoku/tests/unit/services/board-validator-test.jshint', function () {

  'use strict';

  describe('JSHint - unit/services/board-validator-test.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'unit/services/board-validator-test.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/tests/views/cell.jshint', function () {

  'use strict';

  describe('JSHint - views/cell.js', function(){
  it('should pass jshint', function() { 
    expect(true, 'views/cell.js should pass jshint.').to.be.ok; 
  })});

});
define('sudoku/views/cell', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var arrowCharCodes = [37, // left arrow
  38, // up arrow
  39, // right arrow
  40 // down arrow
  ];

  var deleteCharCodes = [8, // backspace
  46 // delete
  ];

  var numberCharCodes = [49, // 1
  50, // 2
  51, // 3
  52, // 4
  53, // 5
  54, // 6
  55, // 7
  56, // 8
  57 // 9
  ];

  exports['default'] = Ember['default'].View.extend({

    templateName: "cell",
    classNameBindings: [":cell", "isActive:active", "isValid::invalid", "isEnabled:enabled:disabled"],

    isActive: (function () {
      return this.get("cell.isActive");
    }).property("cell.isActive"),

    isValid: (function () {
      return this.get("cell.isValid");
    }).property("cell.isValid"),

    isEnabled: (function () {
      return this.get("cell.isEnabled");
    }).property("cell.isEnabled"),

    becomeFocused: (function () {
      this.$().attr({ tabindex: 1 });
      this.$().focus();
    }).observes("cell.isActive"),

    eventManager: Ember['default'].Object.create({
      mouseEnter: function mouseEnter(event, view) {
        view.get("controller").send("mouseEnter", view.get("cell"));
      },

      mouseLeave: function mouseLeave(event, view) {
        view.get("controller").send("mouseLeave", view.get("cell"));
      },

      click: function click(event, view) {
        view.get("controller").send("click", view.get("cell"));
      },

      keyDown: function keyDown(event, view) {
        if (arrowCharCodes.contains(event.which)) {
          event.preventDefault();
          view.get("controller").send("arrowPress", view.get("cell"), event);
        }

        if (deleteCharCodes.contains(event.which)) {
          event.preventDefault();
          view.get("controller").send("deletePress", view.get("cell"));
        }
      },

      keyPress: function keyPress(event, view) {
        if (numberCharCodes.contains(event.which)) {
          view.get("controller").send("numberPress", view.get("cell"), Number.parseInt(String.fromCharCode(event.which)));
        }
      }
    })

  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('sudoku/config/environment', ['ember'], function(Ember) {
  var prefix = 'sudoku';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("sudoku/tests/test-helper");
} else {
  require("sudoku/app")["default"].create({"name":"sudoku","version":"0.0.0.21988076"});
}

/* jshint ignore:end */
//# sourceMappingURL=sudoku.map