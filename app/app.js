/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//add to the date prototype...sneaky
// Date.prototype.toISODate = function() {
//   var mm = this.getMonth() + 1; // getMonth() is zero-based
//   var dd = this.getDate();
//   return [this.getFullYear(),
//           (mm>9 ? '' : '0') + mm,
//           (dd>9 ? '' : '0') + dd
//          ].join('');
// };
module.exports = {
  createGuid: function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  },
  toMMDDYYYY: function (date) {
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  },
  toISODate: function (date) {
    //TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS").
    let mm = date.getMonth() + 1; // getMonth() is zero-based

    let dd = date.getDate();
    const yyyy = date.getFullYear();
    mm = (mm > 9 ? "" : "0") + mm;
    dd = (dd > 9 ? "" : "0") + dd;
    return yyyy + "-" + mm + "-" + dd + " 00:00:00.000";
  },
  parseOFXDate: function (ofxDate) {
    const yyyy = ofxDate.substring(0, 4);
    const mm = ofxDate.substring(4, 6);
    const dd = ofxDate.substring(6, 8);
    const hh = ofxDate.substring(8, 10);
    const mi = ofxDate.substring(10, 12);
    const ss = ofxDate.substring(12, 14);
    return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + mi + ":" + ss + ".000";
  },
  nullToSpace: function (value) {
    return value == null ? "" : value;
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _repo = _interopRequireDefault(__webpack_require__(4));

var _utilities = _interopRequireDefault(__webpack_require__(1));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getPayeeByName = function (payee_name, callback) {
  const sql = "SELECT * FROM payees WHERE name = ?";
  const params = [payee_name.trim()];

  _repo.default.getRow(sql, params, function (payee, error) {
    callback(payee, error);
  });
};

const getPayeeByReferenceName = function (reference_name, callback) {
  const sql = `SELECT p.*
                FROM payee_lookup pl
                JOIN payees p
                  ON pl.payee_id = p.id
                WHERE pl.reference_name = ?`;
  const params = [reference_name];

  _repo.default.getRow(sql, params, function (payee, error) {
    callback(payee, error);
  });
};

const findPayeeId = function (payeeName, callback) {
  getPayeeByName(payeeName, function (payee, error) {
    if (payee) {
      callback(payee.id, error);
      return;
    }

    getPayeeByReferenceName(payeeName, function (payee) {
      if (payee) {
        callback(payee.id, error);
        return;
      }

      callback(null);
    });
  });
};

const getAllPayees = function (callback) {
  const sql = `SELECT * FROM payees`;
  const params = [];

  _repo.default.getData(sql, params, function (payees, error) {
    callback(payees, error);
  });
};

const createPayee = function (payee, callback) {
  const sql = `INSERT INTO payees(id, name, default_category_id) VALUES(?,?,?)`;
  const params = [payee.id, payee.name, payee.defaultCategoryId];

  _repo.default.executeStatement(sql, params, function (error) {
    callback(error);
  });
};

const createPayeePromise = function (payee) {
  const createPayeePromise = new Promise(function (resolve, reject) {
    createPayee(payee, function (error) {
      if (error) {
        console.error(error);
        reject(error);
        return;
      }

      resolve();
    });
  });
  return createPayeePromise;
};

const findOrCreatePayee = function (payeeName, default_category_id, callback) {
  getPayeeByName(payeeName, function (payee) {
    if (payee) {
      return callback(payee);
    }

    const newPayee = {
      id: _utilities.default.createGuid(),
      name: payeeName,
      default_category_id: default_category_id
    };
    createPayee(newPayee, function (error) {
      if (error) {
        console.error(error);
      }
    }); //TODO: handle errors...this fire and forget could cause foreign key problems

    callback(newPayee);
  });
};

const findOrCreatePayeePromise = function (payeeName, default_category_id) {
  return new Promise(function (resolve, reject) {
    findOrCreatePayee(payeeName, default_category_id, function (payee) {
      resolve(payee);
    });
  });
};

const getAllPayeesPromise = function () {
  return new Promise(function (resolve, reject) {
    getAllPayees(function (payees, error) {
      if (error) {
        reject(error);
        return;
      }

      resolve(payees);
    });
  });
};

module.exports = {
  getPayeeByName: getPayeeByName,
  getPayeeByReferenceName: getPayeeByReferenceName,
  createPayee: createPayee,
  createPayeePromise: createPayeePromise,
  findPayeeId: findPayeeId,
  getAllPayees: getAllPayees,
  getAllPayeesPromise: getAllPayeesPromise,
  findOrCreatePayee: findOrCreatePayee,
  findOrCreatePayeePromise: findOrCreatePayeePromise
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Database = __webpack_require__(28);

const path = __webpack_require__(2);

const dbPath = path.resolve(__dirname, '../src/data/checkbook.db');
module.exports = {
  getData: function (sql, params, callback) {
    const db = new Database(dbPath);
    let records = [];
    var stmt = db.prepare(sql);
    const rows = stmt.all(params);
    callback(rows);
    db.close();
  },
  getRow: function (sql, params, callback) {
    const db = new Database(dbPath);
    var stmt = db.prepare(sql);
    const row = stmt.get(params);
    callback(row);
    db.close();
  },
  executeStatement: function (sql, params, callback) {
    const db = new Database(dbPath);
    var stmt = db.prepare(sql);
    const response = stmt.run(params);
    callback();
    db.close();
  }
};

function handleError(err) {
  if (err) {
    console.log(err);
    return true;
  }

  return false;
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("fs-jetpack");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {"name":"development","description":"Add here any environment specific stuff you like."}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _repo = _interopRequireDefault(__webpack_require__(4));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getTransactions = function (render_callback) {
  const sql = `SELECT t.id,
                      p.name as payee,
                      c.name as category,
                      t.transaction_date as date,
                      t.amount,
                      t.memo
                FROM transactions t
                LEFT JOIN categories c
                        ON IFNULL(t.category_id, 'f74a549c-3d46-4efd-95bb-935c642b649b') = c.id
                LEFT JOIN payees p
                        ON t.payee_id = p.id
                ORDER BY t.transaction_date`;
  const params = [];

  _repo.default.getData(sql, params, function (data) {
    render_callback(data);
  });
};

const saveTransaction = function (newTransaction, callback) {
  const sql = `INSERT INTO transactions (id, transaction_date, payee_id, memo, category_id, amount,reference_code)
                  VALUES (?, ?, ?, ?, ?, ?, ?);`;
  const params = [newTransaction.id, newTransaction.transaction_date, newTransaction.payee_id, newTransaction.memo, newTransaction.category_id, newTransaction.amount, newTransaction.reference_code];

  _repo.default.executeStatement(sql, params, function (error) {
    callback(error);
  });
};

const saveOFXTransaction = function (newTransaction, callback) {
  const sql = `INSERT INTO transactions (id, transaction_date, payee_id, memo, category_id, amount,reference_code)
                  SELECT ?, ?, ?, ?, p.default_category_id, ?, ?
                  FROM payees p
                  WHERE p.id = ?;`;
  const params = [newTransaction.id, newTransaction.transaction_date, newTransaction.payee_id, newTransaction.memo, newTransaction.amount, newTransaction.reference_code, newTransaction.payee_id];

  _repo.default.executeStatement(sql, params, function (error) {
    callback(error);
  });
};

const saveQIFTransaction = function (newTransaction, callback) {
  const sql = `INSERT INTO transactions (id, transaction_date, payee_id, memo, category_id, amount, reference_code)
               SELECT ?, ?, ?, ?, ?, ?, ?
               WHERE NOT EXISTS (SELECT 1 FROM transactions WHERE reference_code = ?);`;
  const params = [newTransaction.id, newTransaction.transaction_date, newTransaction.payee_id, newTransaction.memo, newTransaction.category_id, newTransaction.amount, newTransaction.reference_code, newTransaction.reference_code];

  _repo.default.executeStatement(sql, params, function (error) {
    callback(error);
  });
};

const saveOFXTransactionPromise = function (transaction) {
  return new Promise(function (resolve, reject) {
    saveOFXTransaction(transaction, function (error) {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
};

const saveQIFTransactionPromise = function (transaction) {
  return new Promise(function (resolve, reject) {
    saveQIFTransaction(transaction, function (error) {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
};

const getTransactionByReferenceCode = function (reference_code, callback) {
  const sql = `SELECT * FROM transactions WHERE reference_code = ?`;
  const params = [reference_code];

  _repo.default.getRow(sql, params, function (payee, error) {
    callback(payee, error);
  });
};

module.exports = {
  getTransactions: getTransactions,
  getTransactionByReferenceCode: getTransactionByReferenceCode,
  saveTransaction: saveTransaction,
  saveOFXTransaction: saveOFXTransaction,
  saveQIFTransaction: saveQIFTransaction,
  saveOFXTransactionPromise: saveOFXTransactionPromise,
  saveQIFTransactionPromise: saveQIFTransactionPromise
  /**** PRIVATE FUNCTIONS ****/

};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(21);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utilities = _interopRequireDefault(__webpack_require__(1));

var _repo = _interopRequireDefault(__webpack_require__(4));

var _enums = _interopRequireDefault(__webpack_require__(11));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCategoryByName = function (category_name, callback) {
  const sql = `SELECT *
            FROM categories
            WHERE name = ?`;
  const params = [category_name];

  _repo.default.getRow(sql, params, function (category) {
    callback(category);
  });
};

const getAllCategories = function (callback) {
  const sql = `SELECT * FROM categories`;
  const params = [];

  _repo.default.getData(sql, params, function (categories, error) {
    callback(categories, error);
  });
};

const getAllCategoriesPromise = function () {
  return new Promise(function (resolve, reject) {
    getAllCategories(function (categories, error) {
      if (error) {
        reject(error);
        return;
      }

      resolve(categories);
    });
  });
};

const createCategory = function (category, callback) {
  const sql = `INSERT INTO categories(id, name) VALUES(?,?)`;
  const params = [category.id, category.name];

  _repo.default.executeStatement(sql, params, function (error) {
    callback(error);
  });
};

const findOrCreateCategory = function (categoryName, callback, categoryLookups) {
  if (!categoryName || categoryName == "") {
    return _enums.default.categories.uncategorized;
  }

  const fetchedCategory = categoryLookups && categoryLookups[categoryName];

  if (fetchedCategory) {
    return callback(fetchedCategory);
  }

  getCategoryByName(categoryName, function (category) {
    if (category) {
      return callback(category);
    }

    const newCategory = {
      id: _utilities.default.createGuid(),
      name: categoryName
    };
    createCategory(newCategory, function (error) {
      if (error) {
        console.error(error);
        callback(null, error);
        return;
      }

      if (categoryLookups) {
        categoryLookups[newCategory.name] = newCategory;
      }
    }); //TODO: handle errors

    callback(newCategory);
  });
};

const findOrCreateCategoryPromise = function (categoryName) {
  return new Promise(function (resolve, reject) {
    findOrCreateCategory(categoryName, function (category, error) {
      if (error) {
        console.error(error);
        reject(error);
        return;
      }

      resolve(category);
    });
  });
};

module.exports = {
  getCategoryByName: getCategoryByName,
  getAllCategories: getAllCategories,
  getAllCategoriesPromise: getAllCategoriesPromise,
  findOrCreateCategoryPromise: findOrCreateCategoryPromise,
  findOrCreateCategory: findOrCreateCategory
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  categories: {
    "uncategorized": 'f74a549c-3d46-4efd-95bb-935c642b649b'
  }
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(19);

__webpack_require__(22);

__webpack_require__(24);

__webpack_require__(25);

var _electron = __webpack_require__(0);

var _fsJetpack = _interopRequireDefault(__webpack_require__(5));

var _env = _interopRequireDefault(__webpack_require__(6));

var _main2 = _interopRequireDefault(__webpack_require__(26));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Small helpers you might want to keep
// ----------------------------------------------------------------------------
// Everything below is just to show you how it works. You can delete all of it.
// ----------------------------------------------------------------------------
//import { greet } from "./hello_world/hello_world";
//import { register } from "./hello_world/hello_world";
//<script src="../node_modules/js-datepicker/datepicker.min.js"></script>
const app = _electron.remote.app;

const appDir = _fsJetpack.default.cwd(app.getAppPath()); // Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)


const manifest = appDir.read("package.json", "json");
const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};
document.querySelector("#app").style.display = "block"; //document.querySelector("#greet").innerHTML = greet();
//document.querySelector("#os").innerHTML = osMap[process.platform];
//document.querySelector("#author").innerHTML = manifest.author;
//document.querySelector("#env").innerHTML = env.name;
//document.querySelector("#electron-version").innerHTML =
// process.versions.electron;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(9)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./main.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(false);
// imports


// module
exports.push([module.i, "html,\r\nbody {\r\n  width: 100%;\r\n  height: 100%;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\nbody {\r\n  /* display: flex; */\r\n  justify-content: center;\r\n  align-items: center;\r\n  font-family: sans-serif;\r\n  color: #525252;\r\n}\r\n\r\na {\r\n  text-decoration: none;\r\n  color: #cb3837;\r\n}\r\n\r\ninput:focus::-webkit-input-placeholder { color:transparent; }\r\ninput:focus:-moz-placeholder { color:transparent; } /* FF 4-18 */\r\ninput:focus::-moz-placeholder { color:transparent; } /* FF 19+ */\r\ninput:focus:-ms-input-placeholder { color:transparent; } /* IE 10+ */\r\n\r\n.container {\r\n  text-align: center;\r\n  padding: 10px;\r\n}\r\n\r\n.register{\r\n  width: 80%;\r\n  display: flex;\r\n}\r\n\r\n.record {\r\n  width: 100%;\r\n  border: 1px solid #000000;\r\n  text-align: left;\r\n}\r\n\r\n.record #date{\r\n  width: 15%; display: inline-block;\r\n}\r\n\r\n.record #payee_category_memo{\r\n  width: 70%;\r\n  display: inline-block;\r\n  border-left: 1px solid #000000;\r\n  border-right: 1px solid #000000;\r\n}\r\n\r\n.record #category_memo{\r\n  border-top: 1px solid #000000;\r\n}\r\n\r\n.record #category_memo #category{\r\n  display: inline-block;\r\n  border-right: 1px solid #000000;\r\n  width: 50%\r\n}\r\n\r\n.record #category_memo #memo{\r\n  display: inline-block;\r\n  width: 48%;\r\n}\r\n\r\n.record #amount{\r\n  display: inline-block;\r\n  width: 10%;\r\n}\r\n\r\n.record.header {\r\n  font-weight: bold;\r\n}\r\n\r\n.record.input input {\r\n  /*color: rgb(185, 178, 178);\r\n  font-style: italic;*/\r\n  outline: none;\r\n  box-shadow: none;\r\n  width: 99%;\r\n}\r\n\r\n.record.input #amount{\r\n  width: 12%;\r\n}\r\n\r\n.record.input #txt_amount{\r\n  width: 30%;\r\n}\r\n\r\n#map_import{\r\n  display: none;\r\n  position:fixed;\r\n  top: 50%;\r\n  left: 50%;\r\n  width:50em;\r\n  height:30em;\r\n  margin-top: -15em; /*set to a negative number 1/2 of your height*/\r\n  margin-left: -25em; /*set to a negative number 1/2 of your width*/\r\n  border: 1px solid #ccc;\r\n  background-color: #f3f3f3;\r\n}\r\n\r\n#mappingButtons{\r\n  position:absolute;\r\n  bottom:0;\r\n  right:0;\r\n}\r\n\r\n\r\n#transactionMapping{\r\n  overflow:scroll;\r\n  height: 25em;\r\n}\r\n\r\n#transactionMapping .mappingHeader div{\r\n  display: inline-block;\r\n}\r\n\r\n#transactionMapping .mapping div{\r\n  display: inline-block;\r\n}\r\n\r\n\r\n#transactionMapping .mapping .sourcePayee{\r\n  width: 50%;\r\n}\r\n\r\n#transactionMapping .mapping .targetPayee{\r\n  width: 30%;\r\n}\r\n\r\n#transactionMapping .mapping .newPayee{\r\n  width: 15%;\r\n}\r\n\r\n#ofx_transactions{\r\n  display: none;\r\n}\r\n\r\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(9)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../css-loader/index.js!./datepicker.css", function() {
			var newContent = require("!!../css-loader/index.js!./datepicker.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(false);
// imports


// module
exports.push([module.i, ".qs-datepicker {\n  color: black;\n  position: absolute;\n  width: 250px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  font-family: sans-serif;\n  font-size: 14px;\n  z-index: 9001;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  border: 1px solid gray;\n  border-radius: 4.22275px;\n  overflow: hidden;\n  background: white;\n  box-shadow: 0 20px 20px -15px rgba(0, 0, 0, 0.3);\n}\n.qs-datepicker * {\n  box-sizing: border-box;\n}\n.qs-datepicker.qs-centered {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.qs-datepicker.qs-hidden {\n  display: none;\n}\n.qs-datepicker .qs-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: rgba(0, 0, 0, 0.75);\n  color: white;\n  width: 100%;\n  height: 100%;\n  padding: .5em;\n  z-index: 1;\n  opacity: 1;\n  transition: opacity 0.3s;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -ms-flex-align: center;\n      align-items: center;\n}\n.qs-datepicker .qs-overlay.qs-hidden {\n  opacity: 0;\n  z-index: -1;\n}\n.qs-datepicker .qs-overlay .qs-close {\n  -ms-flex-item-align: end;\n      align-self: flex-end;\n  display: inline-table;\n  padding: .5em;\n  line-height: .77;\n  cursor: pointer;\n  position: absolute;\n}\n.qs-datepicker .qs-overlay .qs-overlay-year {\n  display: block;\n  border: none;\n  background: transparent;\n  border-bottom: 1px solid white;\n  border-radius: 0;\n  color: white;\n  font-size: 14px;\n  padding: .25em 0;\n  margin: auto 0 .5em;\n  width: calc(100% - 1em);\n}\n.qs-datepicker .qs-overlay .qs-overlay-year::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n}\n.qs-datepicker .qs-overlay .qs-submit {\n  border: 1px solid white;\n  border-radius: 4.22275px;\n  padding: .5em;\n  margin: 0 auto auto;\n  cursor: pointer;\n  background: rgba(128, 128, 128, 0.4);\n}\n.qs-datepicker .qs-overlay .qs-submit.qs-disabled {\n  color: gray;\n  border-color: gray;\n  cursor: not-allowed;\n}\n.qs-datepicker .qs-controls {\n  width: 100%;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-positive: 1;\n      flex-grow: 1;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  background: lightgray;\n  filter: blur(0px);\n  transition: filter 0.3s;\n}\n.qs-datepicker .qs-controls.qs-blur {\n  filter: blur(5px);\n}\n.qs-datepicker .qs-arrow {\n  height: 25px;\n  width: 25px;\n  position: relative;\n  cursor: pointer;\n  border-radius: 5px;\n  transition: background .15s;\n}\n.qs-datepicker .qs-arrow:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n.qs-datepicker .qs-arrow:hover.qs-left:after {\n  border-right-color: black;\n}\n.qs-datepicker .qs-arrow:hover.qs-right:after {\n  border-left-color: black;\n}\n.qs-datepicker .qs-arrow:after {\n  content: '';\n  border: 6.25px solid transparent;\n  position: absolute;\n  top: 50%;\n  transition: border .2s;\n}\n.qs-datepicker .qs-arrow.qs-left:after {\n  border-right-color: gray;\n  right: 50%;\n  transform: translate(25%, -50%);\n}\n.qs-datepicker .qs-arrow.qs-right:after {\n  border-left-color: gray;\n  left: 50%;\n  transform: translate(-25%, -50%);\n}\n.qs-datepicker .qs-month-year {\n  font-weight: bold;\n  transition: border .2s;\n  border-bottom: 1px solid transparent;\n  cursor: pointer;\n}\n.qs-datepicker .qs-month-year:hover {\n  border-bottom: 1px solid gray;\n}\n.qs-datepicker .qs-month-year:focus,\n.qs-datepicker .qs-month-year:active:focus {\n  outline: none;\n}\n.qs-datepicker .qs-month {\n  padding-right: .5ex;\n}\n.qs-datepicker .qs-year {\n  padding-left: .5ex;\n}\n.qs-datepicker .qs-squares {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  padding: 5px;\n  filter: blur(0px);\n  transition: filter 0.3s;\n}\n.qs-datepicker .qs-squares.qs-blur {\n  filter: blur(5px);\n}\n.qs-datepicker .qs-square {\n  width: 14.28571429%;\n  height: 25px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  cursor: pointer;\n  transition: background .1s;\n  border-radius: 4.22275px;\n}\n.qs-datepicker .qs-square.qs-current {\n  font-weight: bold;\n}\n.qs-datepicker .qs-square.qs-active {\n  background: lightblue;\n}\n.qs-datepicker .qs-square.qs-disabled span {\n  opacity: .2;\n}\n.qs-datepicker .qs-square.qs-empty {\n  cursor: default;\n}\n.qs-datepicker .qs-square.qs-disabled {\n  cursor: not-allowed;\n}\n.qs-datepicker .qs-square.qs-day {\n  cursor: default;\n  font-weight: bold;\n  color: gray;\n}\n.qs-datepicker .qs-square:not(.qs-empty):not(.qs-disabled):not(.qs-day):hover {\n  background: orange;\n}\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _electron = __webpack_require__(0);

// This gives you default context menu (cut, copy, paste)
// in all input fields and textareas across your app.
const Menu = _electron.remote.Menu;
const MenuItem = _electron.remote.MenuItem;

const isAnyTextSelected = () => {
  return window.getSelection().toString() !== "";
};

const cut = new MenuItem({
  label: "Cut",
  click: () => {
    document.execCommand("cut");
  }
});
const copy = new MenuItem({
  label: "Copy",
  click: () => {
    document.execCommand("copy");
  }
});
const paste = new MenuItem({
  label: "Paste",
  click: () => {
    document.execCommand("paste");
  }
});
const normalMenu = new Menu();
normalMenu.append(copy);
const textEditingMenu = new Menu();
textEditingMenu.append(cut);
textEditingMenu.append(copy);
textEditingMenu.append(paste);
document.addEventListener("contextmenu", event => {
  switch (event.target.nodeName) {
    case "TEXTAREA":
    case "INPUT":
      event.preventDefault();
      textEditingMenu.popup(_electron.remote.getCurrentWindow());
      break;

    default:
      if (isAnyTextSelected()) {
        event.preventDefault();
        normalMenu.popup(_electron.remote.getCurrentWindow());
      }

  }
}, false);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _electron = __webpack_require__(0);

// Convenient way for opening links in external browser, not in the app.
// Useful especially if you have a lot of links to deal with.
//
// Usage:
//
// Every link with class ".js-external-link" will be opened in external browser.
// <a class="js-external-link" href="http://google.com">google</a>
//
// The same behaviour for many links can be achieved by adding
// this class to any parent tag of an anchor tag.
// <p class="js-external-link">
//    <a href="http://google.com">google</a>
//    <a href="http://bing.com">bing</a>
// </p>
const supportExternalLinks = event => {
  let href;
  let isExternal = false;

  const checkDomElement = element => {
    if (element.nodeName === "A") {
      href = element.getAttribute("href");
    }

    if (element.classList.contains("js-external-link")) {
      isExternal = true;
    }

    if (href && isExternal) {
      _electron.shell.openExternal(href);

      event.preventDefault();
    } else if (element.parentElement) {
      checkDomElement(element.parentElement);
    }
  };

  checkDomElement(event.target);
};

document.addEventListener("click", supportExternalLinks, false);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _main = _interopRequireDefault(__webpack_require__(27));

var _transaction = _interopRequireDefault(__webpack_require__(7));

var _category = _interopRequireDefault(__webpack_require__(10));

var _datepicker = _interopRequireDefault(__webpack_require__(29));

var _utilities = _interopRequireDefault(__webpack_require__(1));

var _payee = _interopRequireDefault(__webpack_require__(3));

var _payee_lookup = _interopRequireDefault(__webpack_require__(30));

var _ofx_importer = _interopRequireDefault(__webpack_require__(31));

var _qif_importer = _interopRequireDefault(__webpack_require__(32));

var _enums = _interopRequireDefault(__webpack_require__(11));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findOrCreatePayeeId(payeeName, callback) {
  _payee.default.findPayeeId(payeeName, function (payee_id) {
    if (!payee_id) {
      const payee = {
        id: _utilities.default.createGuid(),
        name: payeeName,
        defaultCategoryId: _enums.default.categories.uncategorized
      };

      _payee.default.createPayee(payee, function (err) {
        //TODO: handle errors
        callback(payee.id);
        return;
      });
    }

    callback(payee_id);
  });
}

const saveTransaction = function () {
  const ddlCategory = document.getElementById("ddlCategory");
  const category_id = ddlCategory.options[ddlCategory.selectedIndex].value;

  const transactionDate = _utilities.default.toISODate(new Date(document.querySelector("#txt_date").value));

  const payeeName = document.querySelector("#txt_payee").value;
  findOrCreatePayeeId(payeeName, function (payee_id) {
    const newTransaction = {
      "id": _utilities.default.createGuid(),
      "transaction_date": transactionDate,
      "payee_id": payee_id,
      "category_id": category_id,
      "memo": document.querySelector("#txt_memo").value,
      "amount": document.querySelector("#txt_amount").value
    };

    _transaction.default.saveTransaction(newTransaction, function (response) {
      loadTransactions();
      resetInput();
    });
  });
};

const mapOFXTransactions = function (filename) {
  const payeesPromise = _payee.default.getAllPayeesPromise();

  const categoriesPromise = _category.default.getAllCategoriesPromise();

  const transactionPromise = new Promise(function (resolve, reject) {
    const filename = '../src/data/samples/suntrust_export.ofx';

    _ofx_importer.default.parseOFXfile(filename, resolve);
  });
  const promises = [payeesPromise, categoriesPromise, transactionPromise];
  Promise.all(promises).then(function (values) {
    const payees = values[0];
    const categories = values[1];
    const transactions = values[2];

    _main.default.render_transaction_mapping(payees, categories, transactions);
  });
};

const saveOFXTransactions = function () {
  const str_ofx_transactions = document.getElementById('ofx_transactions').getAttribute("data-transactions");
  const ofx_transactions = JSON.parse(str_ofx_transactions);
  const mappingDivs = document.getElementsByClassName('mapping');
  let transactionsToCreate = false;
  let payeePromises = []; //iterate through the mapping rows (divs)

  for (let i = 0; i < mappingDivs.length; i++) {
    var transDiv = mappingDivs[i];
    const reference_code = transDiv.getAttribute("data-reference_code").trim();

    _transaction.default.getTransactionByReferenceCode(reference_code, function (existingTransaction) {
      if (existingTransaction) {
        //transaction exists...bail
        return;
      }

      transactionsToCreate = true; //TODO: check for null references?

      const targetDiv = transDiv.getElementsByClassName("targetPayee");
      const targetSelect = targetDiv[0].getElementsByClassName("ddlPayee")[0];
      const payee_id = targetSelect == null ? -1 : targetSelect.value; //iterate through transactions, find this reference_code and set the payee_id

      for (let i = 0; i < ofx_transactions.length; i++) {
        const transaction = ofx_transactions[i];

        if (transaction.reference_code == reference_code) {
          if (payee_id == -1) {
            //payee was not selected
            const new_payee_id = _utilities.default.createGuid();

            const payee = {
              id: new_payee_id,
              name: transaction.payee,
              defaultCategoryId: _enums.default.categories.uncategorized
            };
            transaction.payee_id = new_payee_id;
            payeePromises.push(_payee.default.createPayeePromise(payee));
          } else {
            //payee was selected
            transaction.payee_id = targetSelect.value; //create a lookup for the payee if it does not already exist

            const payeeLookup = {
              "id": _utilities.default.createGuid(),
              "payee_id": targetSelect.value,
              "reference_name": transaction.payee
            };

            _payee_lookup.default.createPayeeLookup(payeeLookup, function (error) {
              if (error) {
                console.log(error);
              }
            });
          }

          break;
        }
      }
    });
  }

  if (transactionsToCreate) {
    //save OFX transactions
    Promise.all(payeePromises).then(function (resolve) {
      var ofx_transaction_promises = [];

      for (let i = 0; i < ofx_transactions.length; i++) {
        let transaction = ofx_transactions[i];
        transaction.id = _utilities.default.createGuid();

        const promise = _transaction.default.saveOFXTransactionPromise(transaction);

        ofx_transaction_promises.push(promise);
      }

      Promise.all(ofx_transaction_promises).then(function (resolve) {
        loadTransactions();
        closeMappingWindow();
      });
    });
  } else {
    closeMappingWindow();
  }
};

const newPayee = function () {
  alert("new payee");
};

const importQIF = function () {
  const filename = '../src/data/samples/sample.qif';

  _qif_importer.default.importQIFfile(filename, function () {
    loadTransactions();
  });
};
/**** PRIVATE FUNCTIONS ****/


function resetInput() {
  document.querySelector("#txt_date").value = _utilities.default.toMMDDYYYY(new Date());
  document.querySelector("#txt_payee").value = "";
  document.getElementById("ddlCategory").selectedIndex = 0;
  document.querySelector("#txt_memo").value = "";
  document.querySelector("#txt_amount").value = "";
}

function wireUpEvents() {
  const postButton = document.getElementById("btn_post");
  postButton.addEventListener("click", saveTransaction);
  const importButton = document.getElementById("btn_mapTransactions");
  importButton.addEventListener("click", mapOFXTransactions);
  const importQIFButton = document.getElementById("btn_importQIF");
  importQIFButton.addEventListener("click", importQIF);
  var newPayeeLinks = document.getElementsByClassName("lnk_newPayee");

  for (let i = 0, len = newPayeeLinks.length; i < len;) {
    lnkNewPayee = newPayeeLinks[i];
    lnkNewPayee.addEventListener("click", newPayee);
  }

  const saveOFXTransactionsButton = document.getElementById("btn_save_OFX_transactions");
  saveOFXTransactionsButton.addEventListener("click", saveOFXTransactions);
  const cancelOFXButton = document.getElementById("btn_cancel_OFX");
  cancelOFXButton.addEventListener("click", closeMappingWindow);
}

function populateElements() {
  loadTransactions();
  buildDatePicker();
  buildCategoryList();
}

function loadTransactions() {
  _transaction.default.getTransactions(_main.default.render_transactions);
}

function closeMappingWindow() {
  let map_import = document.querySelector("#map_import");
  map_import.style.display = "none";
}

function buildDatePicker() {
  const options = {
    dateSelected: new Date(),
    formatter: function (el, date) {
      const formattedDate = _utilities.default.toMMDDYYYY(date);

      el.value = formattedDate;
    }
  };
  (0, _datepicker.default)('#txt_date', options);
}

function buildCategoryList() {
  _category.default.getAllCategories(function (categories) {
    const options = _main.default.buildCategoryOptions(categories);

    document.querySelector("#ddlCategory").innerHTML = options;
  });
} //on_load...this is probably a terrible way to do this


(function onLoad() {
  wireUpEvents();
  populateElements();
})();

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utilities = _interopRequireDefault(__webpack_require__(1));

var _payee = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const buildPayeeOptions = function (payees, payee_id) {
  let options = "<option value='-1'>Use source payee...</option>";

  for (let i = 0, len = payees.length; i < len; i++) {
    const payee = payees[i];
    const selected = payee.id == payee_id ? "selected" : "";
    const option = "<option value='" + payee.id + "'" + selected + ">" + payee.name + "</option>";
    options += option;
  }

  return options;
};

module.exports = {
  render_transactions: function (transactions) {
    let html = "";

    for (let i = 0, len = transactions.length; i < len; i++) {
      const transaction = transactions[i];

      const transactionDate = _utilities.default.toMMDDYYYY(new Date(transaction.date));

      let record = `<div class="record">
          <div id="date">${transactionDate}</div>
          <div id="payee_category_memo">
            <div id="payee" >${transaction.payee}</div>
            <div id="category_memo">
              <div id="category">${transaction.category}</div>
              <div id="memo">${_utilities.default.nullToSpace(transaction.memo)}</div>
            </div>
          </div>
          <div id="amount">${transaction.amount}</div>
        </div>`;
      html += record;
    }

    document.querySelector("#transactions").innerHTML = html;
  },
  render_transaction_mapping: function (payees, categories, transactions) {
    let map_import = document.querySelector("#map_import");
    map_import.style.display = "inline";
    let html = `<div id="ofx_transactions" data-transactions='${JSON.stringify(transactions)}'></div>
                  <div class="mappingHeader">
                    <div class="sourcePayee">Source Payee</div>
                    <div class="targetPayee">Target Payee</div>
                  </div>`;
    let distinctPayees = [];

    for (let i = 0, len = transactions.length; i < len; i++) {
      const transaction = transactions[i];

      if (distinctPayees.indexOf(transaction.payee) > 0) {
        continue;
      }

      distinctPayees.push(transaction.payee);
      const row = `<div class="mapping" data-reference_code="${transaction.reference_code}">
                          <div class="sourcePayee">${transaction.payee}</div>
                          <div class="targetPayee"><select class="ddlPayee">${buildPayeeOptions(payees, transaction.payee_id)} </select></div>
                          <div class="newPayee"><a id="newPayee${i}" href="#" class="lnk_newPayee">New Payee</a></div>
                        </div>`;
      html += row;
    }

    document.querySelector("#transactionMapping").innerHTML = html;
  },
  buildCategoryOptions: function (categories) {
    let options = "<option value=''>Select a category...</option>";

    for (let i = 0, len = categories.length; i < len; i++) {
      const category = categories[i];
      const option = "<option value='" + category.id + "'>" + category.name + "</option>";
      options += option;
    }

    return options;
  },
  buildPayeeOptions: buildPayeeOptions
};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("better-sqlite3");

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!function(t,e){var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};"object"===( false?"undefined":n(exports))?module.exports=e(): true?!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return e()}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):t.datepicker=e()}(this,function(){"use strict";function t(t,a){var s=t.split?document.querySelector(t):t;a=e(a||n(),s,t);var r=s.parentElement,i=document.createElement("div"),c=a,u=c.startDate,d=c.dateSelected,p=s===document.body||s===document.querySelector("html"),v={el:s,parent:r,nonInput:"INPUT"!==s.nodeName,noPosition:p,position:!p&&a.position,startDate:u,dateSelected:d,disabledDates:a.disabledDates,minDate:a.minDate,maxDate:a.maxDate,noWeekends:!!a.noWeekends,calendar:i,currentMonth:(u||d).getMonth(),currentMonthName:(a.months||w)[(u||d).getMonth()],currentYear:(u||d).getFullYear(),setDate:h,reset:f,remove:y,onSelect:a.onSelect,onShow:a.onShow,onHide:a.onHide,onMonthChange:a.onMonthChange,formatter:a.formatter,months:a.months||w,days:a.customDays||g,startDay:a.startDay,overlayPlaceholder:a.overlayPlaceholder||"4-digit year",overlayButton:a.overlayButton||"Submit",disableMobile:a.disableMobile,isMobile:"ontouchstart"in window};return d&&l(s,v),i.classList.add("qs-datepicker"),i.classList.add("qs-hidden"),b.push(s),o(u||d,v),S.forEach(function(t){window.addEventListener(t,D.bind(v))}),"static"===getComputedStyle(r).position&&(r.style.position="relative"),r.appendChild(i),v}function e(t,e){if(b.includes(e))throw"A datepicker already exists on that element.";var n=t.position,o=t.maxDate,s=t.minDate,r=t.dateSelected,i=t.formatter,c=t.customMonths,l=t.customDays,u=t.overlayPlaceholder,d=t.overlayButton,h=t.startDay,f=t.disabledDates,y=+v(r);if(t.disabledDates=(f||[]).map(function(t){if(!p(t))throw'You supplied an invalid date to "options.disabledDates".';if(+v(t)===y)throw'"disabledDates" cannot contain the same date as "dateSelected".';return+v(t)}),n){if(!["tr","tl","br","bl","c"].some(function(t){return n===t}))throw'"options.position" must be one of the following: tl, tr, bl, br, or c.';t.position=a(n)}else t.position=a("bl");if(["startDate","dateSelected","minDate","maxDate"].forEach(function(e){if(t[e]){if(!p(t[e])||isNaN(+t[e]))throw'"options.'+e+'" needs to be a valid JavaScript Date object.';t[e]=v(t[e])}}),t.startDate=v(t.startDate||t.dateSelected||new Date),t.formatter="function"==typeof i?i:null,o<s)throw'"maxDate" in options is less than "minDate".';if(r){if(s>r)throw'"dateSelected" in options is less than "minDate".';if(o<r)throw'"dateSelected" in options is greater than "maxDate".'}if(["onSelect","onShow","onHide","onMonthChange"].forEach(function(e){t[e]="function"==typeof t[e]&&t[e]}),[c,l].forEach(function(e,n){if(e){var a=['"customMonths" must be an array with 12 strings.','"customDays" must be an array with 7 strings.'];if("[object Array]"!=={}.toString.call(e)||e.length!==(n?7:12))throw a[n];t[n?"days":"months"]=e}}),void 0!==h&&+h&&+h>0&&+h<7){var m=(t.customDays||g).slice(),q=m.splice(0,h);t.customDays=m.concat(q),t.startDay=+h}else t.startDay=0;return[u,d].forEach(function(e,n){e&&e.split&&(n?t.overlayButton=e:t.overlayPlaceholder=e)}),t}function n(){return{startDate:v(new Date),position:"bl"}}function a(t){var e={};return e[M[t[0]]]=1,"c"===t?e:(e[M[t[1]]]=1,e)}function o(t,e){var n=s(t,e),a=r(t,e),o=i(e);e.calendar.innerHTML=n+a+o}function s(t,e){return'\n      <div class="qs-controls">\n        <div class="qs-arrow qs-left"></div>\n        <div class="qs-month-year">\n          <span class="qs-month">'+e.months[t.getMonth()]+'</span>\n          <span class="qs-year">'+t.getFullYear()+'</span>\n        </div>\n        <div class="qs-arrow qs-right"></div>\n      </div>\n    '}function r(t,e){var n=e.minDate,a=e.maxDate,o=e.dateSelected,s=e.currentYear,r=e.currentMonth,i=e.noWeekends,c=e.days,l=e.disabledDates,u=new Date,d=u.toJSON().slice(0,7)===t.toJSON().slice(0,7),h=new Date(new Date(t).setDate(1)),f=h.getDay()-e.startDay,p=f<0?7:0;h.setMonth(h.getMonth()+1),h.setDate(0);var y=h.getDate(),m=[],q=p+7*((f+y)/7|0);q+=(f+y)%7?7:0,0!==e.startDay&&0===f&&(q+=7);for(var D=1;D<=q;D++){var b=c[(D-1)%7],S=D-(f>=0?f:7+f),g=new Date(s,r,S),w=S<1||S>y,M="",L='<span class="qs-num">'+S+"</span>";if(w)M="qs-empty",L="";else{var N=n&&g<n||a&&g>a||l.includes(+v(g)),x=c[6],Y=c[0],C=b===x||b===Y,P=d&&!N&&S===u.getDate();N=N||i&&C,M=N?"qs-disabled":P?"qs-current":""}+g!=+o||w||(M+=" qs-active"),m.push('<div class="qs-square qs-num '+b+" "+M+'">'+L+"</div>")}var k=c.map(function(t){return'<div class="qs-square qs-day">'+t+"</div>"}).concat(m);if(k.length%7!=0)throw"Calendar not constructed properly. The # of squares should be a multiple of 7.";return k.unshift('<div class="qs-squares">'),k.push("</div>"),k.join("")}function i(t){return'\n      <div class="qs-overlay qs-hidden">\n        <div class="qs-close">&#10005;</div>\n        <input type="number" class="qs-overlay-year" placeholder="'+t.overlayPlaceholder+'" />\n        <div class="qs-submit qs-disabled">'+t.overlayButton+"</div>\n      </div>\n    "}function c(t,e){var n=e.currentMonth,a=e.currentYear,o=e.calendar,s=e.el,r=e.onSelect,i=o.querySelector(".qs-active"),c=t.textContent;e.dateSelected=new Date(a,n,c),i&&i.classList.remove("qs-active"),t.classList.add("qs-active"),l(s,e),m(e),r&&r(e)}function l(t,e){if(!e.nonInput)return e.formatter?e.formatter(t,e.dateSelected):void(t.value=e.dateSelected.toDateString())}function u(t,e,n){n?e.currentYear=n:(e.currentMonth+=t.contains("qs-right")?1:-1,12===e.currentMonth?(e.currentMonth=0,e.currentYear++):-1===e.currentMonth&&(e.currentMonth=11,e.currentYear--)),o(new Date(e.currentYear,e.currentMonth,1),e),e.currentMonthName=e.months[e.currentMonth],e.onMonthChange&&e.onMonthChange(e)}function d(t){if(!t.noPosition){var e=t.el,n=t.calendar,a=t.position,o=t.parent,s=a.top,r=a.right;if(a.centered)return n.classList.add("qs-centered");var i=o.getBoundingClientRect(),c=e.getBoundingClientRect(),l=n.getBoundingClientRect(),u=c.top-i.top+o.scrollTop,d="\n      top:"+(u-(s?l.height:-1*c.height))+"px;\n      left:"+(c.left-i.left+(r?c.width-l.width:0))+"px;\n    ";n.setAttribute("style",d)}}function h(t,e){if(!p(t))throw"`setDate` needs a JavaScript Date object.";t=v(t),this.currentYear=t.getFullYear(),this.currentMonth=t.getMonth(),this.currentMonthName=this.months[t.getMonth()],this.dateSelected=e?void 0:t,!e&&l(this.el,this),o(t,this),e&&(this.el.value="")}function f(){this.setDate(this.startDate,!0)}function p(t){return["[object Date]"==={}.toString.call(t),"Invalid Date"!==t.toString()].every(Boolean)}function v(t){return t?new Date(t.toDateString()):t}function y(){var t=this.calendar,e=this.parent,n=this.el;S.forEach(function(t){window.removeEventListener(t,D)}),t.remove(),t.hasOwnProperty("parentStyle")&&(e.style.position=""),b=b.filter(function(t){return t!==n})}function m(t){t.calendar.classList.add("qs-hidden"),t.onHide&&t.onHide(t)}function q(t){t.calendar.classList.remove("qs-hidden"),d(t),t.onShow&&t.onShow(t)}function D(t){function e(e){var o=e.calendar,s=l.classList,r=o.querySelector(".qs-month-year"),d=s.contains("qs-close");if(s.contains("qs-num")){var h="SPAN"===l.nodeName?l.parentNode:l;!["qs-disabled","qs-active","qs-empty"].some(function(t){return h.classList.contains(t)})&&c(h,e)}else if(s.contains("qs-arrow"))u(s,e);else if(i.includes(r)||d)n(o,d,e);else if(l.classList.contains("qs-submit")){var f=o.querySelector(".qs-overlay-year");a(t,f,e)}}function n(t,e,n){[".qs-overlay",".qs-controls",".qs-squares"].forEach(function(e,n){t.querySelector(e).classList.toggle(n?"qs-blur":"qs-hidden")});var a=t.querySelector(".qs-overlay-year");e?a.value="":a.focus()}function a(t,e,n){var a=isNaN((new Date).setFullYear(e.value||void 0));if(13===t.which||"click"===t.type){if(a||e.classList.contains("qs-disabled"))return;u(null,n,e.value)}else{n.calendar.querySelector(".qs-submit").classList[a?"add":"remove"]("qs-disabled")}}if(!this.isMobile||!this.disableMobile){if(!t.path){for(var o=t.target,s=[];o!==document;)s.push(o),o=o.parentNode;t.path=s}var r=t.type,i=t.path,l=t.target,d=this.calendar,h=this.el,f=d.classList,p=f.contains("qs-hidden"),v=i.includes(d);if("keydown"===r){var y=d.querySelector(".qs-overlay"),D=!y.classList.contains("qs-hidden");if(13===t.which&&D)return t.stopPropagation(),a(t,l,this);if(27===t.which&&D)return n(d,!0,this);if(9!==t.which)return}if("focusin"===r)return l===h&&q(this);this.noPosition?v?e(this):p?q(this):m(this):p?l===h&&q(this):"click"===r&&v?e(this):"input"===r?a(t,l,this):l!==h&&m(this)}}Array.prototype.includes||(Array.prototype.includes=function(t){return this.reduce(function(e,n){return e||n===t},!1)});var b=[],S=["click","focusin","keydown","input"],g=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],w=["January","February","March","April","May","June","July","August","September","October","November","December"],M={t:"top",r:"right",b:"bottom",l:"left",c:"centered"};return t});

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _repo = _interopRequireDefault(__webpack_require__(4));

var _utilities = _interopRequireDefault(__webpack_require__(1));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createPayeeLookup = function (payeeLookup, callback) {
  const sql = `INSERT INTO payee_lookup(id, payee_id, reference_name)
                SELECT ?,?,?
                WHERE NOT EXISTS (SELECT * FROM payee_lookup WHERE reference_name = ?)`;
  const params = [payeeLookup.id, payeeLookup.payee_id, payeeLookup.reference_name, payeeLookup.reference_name];

  _repo.default.executeStatement(sql, params, function (error) {
    callback(error);
  });
};

module.exports = {
  createPayeeLookup: createPayeeLookup
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _payee = _interopRequireDefault(__webpack_require__(3));

var _transaction = _interopRequireDefault(__webpack_require__(7));

var _utilities = _interopRequireDefault(__webpack_require__(1));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getElement(strTransaction, strElement) {
  strElement = "<" + strElement + ">";
  let element = strTransaction.substring(strTransaction.indexOf(strElement) + strElement.length);
  element = element.substring(0, element.indexOf("<") - 1); //remove carriage return

  return element;
}

function parseTransaction(strTransaction) {
  const transaction_date = _utilities.default.parseOFXDate(getElement(strTransaction, "DTPOSTED"));

  const transaction = {
    transaction_type: getElement(strTransaction, "TRNTYPE").trim(),
    transaction_date: transaction_date.trim(),
    amount: getElement(strTransaction, "TRNAMT").trim(),
    payee: getElement(strTransaction, "NAME").trim(),
    reference_code: getElement(strTransaction, "REFNUM").trim()
  };
  return transaction;
}

function isValidTransaction(transaction) {
  if (transaction.reference_code == "") {
    return false;
  }

  if (transaction.amount == "") {
    return false;
  }

  if (transaction.payee == "") {
    return false;
  }

  return true;
}

const parseOFXfile = function (filename, callback) {
  const fs = __webpack_require__(12);

  const path = __webpack_require__(2);

  const filepath = path.resolve(__dirname, filename);
  fs.readFile(filepath, 'utf-8', (err, data) => {
    if (err) {
      alert("An error ocurred reading the file :" + err.message);
      return;
    }

    const ofx = data.substring(data.indexOf("<OFX>"), data.length);
    const banktranlist = ofx.substring(ofx.indexOf("<BANKTRANLIST>"), ofx.indexOf("</BANKTRANLIST>") + 16);
    const str_transactions = banktranlist.substring(banktranlist.indexOf("<STMTTRN>"), banktranlist.length - 16);
    const ofx_transactions = str_transactions.split("<STMTTRN>");
    let promises = [];

    for (let i = 0, len = ofx_transactions.length; i < len; i++) {
      let newTransaction = parseTransaction(ofx_transactions[i]);

      if (isValidTransaction(newTransaction)) {
        const promise = new Promise(function (resolve, reject) {
          _payee.default.findPayeeId(newTransaction.payee, function (payeeId) {
            newTransaction.payee_id = payeeId;
            resolve(newTransaction);
          });
        });
        promises.push(promise);
      }
    }

    Promise.all(promises).then(function (transactions) {
      callback(transactions);
    });
  });
};

module.exports = {
  parseOFXfile: parseOFXfile
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utilities = _interopRequireDefault(__webpack_require__(1));

var _payee = _interopRequireDefault(__webpack_require__(3));

var _category = _interopRequireDefault(__webpack_require__(10));

var _transaction = _interopRequireDefault(__webpack_require__(7));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = __webpack_require__(33);

const importQIFfile = function (filename, callback) {
  const fs = __webpack_require__(12);

  const path = __webpack_require__(2);

  const filepath = path.resolve(__dirname, filename);
  let categoryLookups;
  buildCategoryLookup(function (data) {
    categoryLookups = data;
  });
  fs.readFile(filepath, 'utf-8', (err, data) => {
    if (err) {
      alert("An error ocurred reading the file :" + err.message);
      return;
    }

    let all_transactions = data.substring(data.indexOf("D") - 1, data.length);
    const arr_str_transactions = all_transactions.split("^");
    let parseTransactionPromises = [];

    for (let i = 0; i < arr_str_transactions.length; i++) {
      let transaction_elements = arr_str_transactions[i].split(/\r?\n/);
      let parsedTransaction = {};

      for (let i = 0; i < transaction_elements.length; i++) {
        let transaction_element = transaction_elements[i];

        switch (transaction_element.substring(0, 1)) {
          case "D":
            parsedTransaction.transaction_date = parseDate(transaction_element);
            break;

          case "U":
            parsedTransaction.amount = transaction_element.replace("U", "");
            break;

          case "P":
            parsedTransaction.payee_name = transaction_element.replace("P", "");
            break;

          case "L":
            parsedTransaction.category_name = transaction_element.replace("L", "");
            break;

          case "M":
            parsedTransaction.memo = transaction_element.replace("M", "");
            break;

          default:
            break;
        }
      }

      if (parsedTransaction.payee_name) {
        parsedTransaction.id = _utilities.default.createGuid();
        const hashString = parsedTransaction.payee_name + parsedTransaction.transaction_date + parsedTransaction.amount;
        parsedTransaction.reference_code = crypto.createHash('md5').update(hashString).digest("hex");
        parseTransactionPromises.push(populateTransactionPromise(parsedTransaction, categoryLookups));
      }
    }

    Promise.all(parseTransactionPromises).then(function (qif_transactions) {
      let qifTransactionPromises = [];

      for (let i = 0; i < qif_transactions.length; i++) {
        const qifTransaction = qif_transactions[i];
        qifTransactionPromises.push(_transaction.default.saveQIFTransactionPromise(qifTransaction));
      }

      Promise.all(qifTransactionPromises).then(callback());
    });
  });
};

module.exports = {
  importQIFfile: importQIFfile
};

function parseDate(strDate) {
  return strDate.replace("D", "").replace("'", "/").replace(" ", "");
}

function populateTransactionPromise(parsedTransaction, categoryLookups) {
  return new Promise(function (resolve, reject) {
    const payeeCallback = function (payee) {
      parsedTransaction.payee_id = payee.id;
      resolve(parsedTransaction);
    };

    const categoryCallback = function (category) {
      parsedTransaction.category_id = category.id;

      _payee.default.findOrCreatePayee(parsedTransaction.payee_name, category.id, payeeCallback);
    };

    _category.default.findOrCreateCategory(parsedTransaction.category_name, categoryCallback, categoryLookups);
  });
}

function buildCategoryLookup(callback) {
  _category.default.getAllCategories(function (categories) {
    let categoryLookups = {};

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      categoryLookups[category.name] = category;
    }

    callback(categoryLookups);
  });
}

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map