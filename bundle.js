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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
    this.destroyed = false;
    this.specialValue = 0;
    this.tempDestroyed = false;
  }

  updateValue(change) {
    this.value += change;
  }

  updateSpecial(change) {
    this.specialValue += change;
  }

  destroy() {
    this.destroyed = true;
  }

}

Card.suits = [
  "shields",
  "swords",
  "coins",
  "potions",
  "monsters",
  "magic"
];

Card.values = [
  2, 3, 4, 5, 6, 7, 8, 9, 10
];

/* harmony default export */ __webpack_exports__["a"] = (Card);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dd_view_js__ = __webpack_require__(7);



document.addEventListener("DOMContentLoaded", () => {
  const root = $('.dd');
  window.a = new __WEBPACK_IMPORTED_MODULE_0__board_js__["a" /* default */];
  new __WEBPACK_IMPORTED_MODULE_1__dd_view_js__["a" /* default */](window.a, root);
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__deck_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dungeon_row_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__player_row_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__fire_js__ = __webpack_require__(6);





class Board {

  constructor() {
    this.Deck = new __WEBPACK_IMPORTED_MODULE_0__deck_js__["a" /* default */];
    this.DungeonRow = new __WEBPACK_IMPORTED_MODULE_1__dungeon_row_js__["a" /* default */];
    this.populateDungeon(4);
    this.PlayerRow = new __WEBPACK_IMPORTED_MODULE_2__player_row_js__["a" /* default */];
    this.Fire = new __WEBPACK_IMPORTED_MODULE_3__fire_js__["a" /* default */];
    this.moveBuffer = null;
  }

  populateDungeon(n) {
    const newCards = this.Deck.draw(n);
    this.DungeonRow.fillEmpties(newCards);
  }

  popIfDungeonEmpty() {
    if (this.DungeonRow.count === 1) {
      this.populateDungeon(3);
      this.PlayerRow.destroyTemps();
      this.clearAllDestroyed();
    }
  }

  burnCard(card = this.moveBuffer) {
    const meltValue = this.Fire.melt(card);
    this.PlayerRow.player().updateSpecial(meltValue);
    this.clearAllDestroyed();
  }

  clearAllDestroyed() {
    this.DungeonRow.clearDestroyed();
    this.PlayerRow.clearDestroyed();
  }

  // this should really be select location (which may contain a card)
  selectCard(card) {
    if (!this.moveBuffer) {
      this.moveBuffer = card;
    } else if (this.legalMove(this.moveBuffer, card)){
      this.resolveAction(this.moveBuffer, card);
    }
  }

  resolveAction(card, target) {
    if (target.suit === "player") {
      if (card.suit === "monsters") {
        target.updateValue(card.value * -1);
      } else if (card.suit === "potions") {
        target.updateValue(card.value);
      }
    } else if (target.suit === "monsters") {
      target.updateValue(card.value * -1);
    }
  }

  // this is going to require the card's location!
  legalMove(target) {
    const bCard = this.moveBuffer.card;
    const bLoc = this.moveBuffer.location;
    const tCard = target.card;
    const tLoc = target.location;

    if (bLoc.row === "dungeon") {
      if (bCard.suit !== "monsters") {
        if (tLoc.row === "fire") {
          return true;
        } else if (tLoc.row === "player") {
          if (this.PlayerRow[tLoc.idx].length === 0) {
            return true;
          }
        }
      } else if (bCard.suit === "monsters") {
        if (tCard.suit === "player") {
          return true;
        } if (tLoc.row === "player") {
          if (tCard.suit === "shields") {
            return true;
          }
        }
      }
    } else if (bLoc.row === "player") {
      if (bCard.suit === "swords") {
        if (tCard.suit === "monsters") {
          return true;
        }
      } else if (bCard.suit === "potions" || bCard.suit === "coins") {
        if (tCard.suit === "player") {
          return true;
        }
      }
    }
    return false;
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Board);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__card_js__ = __webpack_require__(0);


class Deck {

  constructor() {
    this.deck = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 6; j++) {
        this.deck.push(new __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */].suits[i], __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */].values[j]));
      }
    }
    for (let i = 2; i < 4; i++) {
      for (let j = 0; j < 9; j++) {
        this.deck.push(new __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */].suits[i], __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */].values[j]));
      }
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 2; j++) {
        this.deck.push(new __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */].suits[4], __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */].values[i]));
      }
    }
    this.deck.push(new __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */].suits[4], __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */].values[8]));
    for (let i = 0; i < 5; i++) {
      this.deck.push(new __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */].suits[5], __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */].values[8]));
    }
    this.shuffle();
    this.count = this.deck.length;
  }

  shuffle() {
    let currentIndex = this.deck.length;
    let tempVal;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      tempVal = this.deck[currentIndex];
      this.deck[currentIndex] = this.deck[randomIndex];
      this.deck[randomIndex] = tempVal;
    }
  }

  draw(n) {
    const drawnCards = [];
    while (this.count > 0 && n > 0) {
      drawnCards.push(this.deck.pop());
      n -= 1;
      this.updateCount();
    }
    return drawnCards;
  }

  updateCount() {
    this.count = this.deck.length;
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Deck);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class DungeonRow {
  constructor() {
    this.spaces = [
      [],
      [],
      [],
      []
    ];

    this.count = 0;
  }

  updateCount() {
    let count = 0;
    for (let i = 0; i < 4; i++) {
      count += this.spaces[i].length;
    }
    this.count = count;
  }

  clearDestroyed() {
    for (let i = 0; i < 4; i++) {
      if (this.spaces[i].length) {
        if (this.spaces[i][0].destroyed) {
          this.spaces[i].pop();
        }
      }
    }
    this.updateCount();
  }

  fillEmpties(arr) {
    for (let i = 0; i < 4; i++) {
      if (this.spaces[i].length === 0 && arr.length > 0) {
        this.spaces[i].push(arr.pop());
      }
    }
    this.updateCount();
  }

  destroyCard(n) {
    this.spaces[n][0].destroy();
    this.clearDestroyed();
  }


}

/* harmony default export */ __webpack_exports__["a"] = (DungeonRow);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__card_js__ = __webpack_require__(0);


class PlayerRow {
  constructor() {
    const newPlayer = new __WEBPACK_IMPORTED_MODULE_0__card_js__["a" /* default */]("player", 13);
    this.spaces = [
      [newPlayer],
      [],
      [],
      []
    ];
  }

  player() {
    return this.spaces[0][0];
  }

  clearDestroyed() {
    for (let i = 0; i < 4; i++) {
      if (this.spaces[i].length) {
        if (this.spaces[i][0].destroyed) {
          this.spaces[i].pop();
        }
      }
    }
  }

  destroyTemps() {
    for (let i = 0; i < 4; i++) {
      if (this.spaces[i].length) {
        if (this.spaces[i][0].tempDestroyed) {
          this.spaces[i][0].destroyed = true;
        }
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (PlayerRow);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Fire {

  constructor() {
  }

  melt(card) {
    card.destroy();
    if (["potions", "shields", "swords"].includes(card.suit)) {
      return card.value;
    } else {
      return 0;
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Fire);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class View {
  constructor(board, $root) {
    this.board = board;
    this.$root = $root;

    this.setupBoard();
    this.bindEvents();
  }

  setupBoard() {
    const $deck = $("<div>");
    $deck.addClass("deck");
    $deck.text(this.board.Deck.count);

    const $row1 = $("<ul>");
    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      let $space = $("<li>");
      $space.data("pos", rowIdx);
      $space.data("loc", "dungeon");
      if (this.board.DungeonRow.spaces[rowIdx].length > 0) {
        $space.text(this.board.DungeonRow.spaces[rowIdx][0].suit);
      } else {
        $space.text("");
      }
      $row1.append($space);
    }

    const $row2 = $("<ul>");
    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      let $space = $("<li>");
      $space.data("pos", rowIdx);
      $space.data("loc", "player");
      if (this.board.PlayerRow.spaces[rowIdx].length > 0) {
        $space.text(this.board.PlayerRow.spaces[rowIdx][0].specialValue);
      } else {
        $space.text("");
      }
      $row2.append($space);
    }


    const $drow = $("<div>");
    $drow.addClass("drow");
    $drow.append($row1);

    const $prow = $("<div>");
    $prow.addClass("prow");
    $prow.append($row2);


    this.$root.append($deck);
    this.$root.append($drow);
    this.$root.append($prow);
  }

  bindEvents() {
    this.$root.on("click", ".deck", (event => {
      console.log(this.board.Deck.draw(3));
      $(event.currentTarget).text(this.board.Deck.count);
    }));

    this.$root.on("click", ".drow li", (event => {
      const pos = $(event.currentTarget).data("pos");
      console.log($(event.currentTarget).data("loc"));
      const card = this.board.DungeonRow.spaces[pos][0];
      this.board.burnCard(card);
      this.board.popIfDungeonEmpty();
      const $lis = $('.drow ul')[0].childNodes;
      for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
        let text = "";
        if (this.board.DungeonRow.spaces[rowIdx].length > 0) {
          text = this.board.DungeonRow.spaces[rowIdx][0].suit;
        }
        $($lis[rowIdx]).text(text);
      }
      $('.deck').text(this.board.Deck.count);
      let value = this.board.PlayerRow.spaces[0][0].specialValue;
      $($('.prow')[0].childNodes[0].childNodes[0]).text(value);
    }));
  }
}

/* harmony default export */ __webpack_exports__["a"] = (View);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map