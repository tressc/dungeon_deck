import Deck from './deck.js';
import DungeonRow from './dungeon_row.js';

class Board {

  constructor() {
    this.Deck = new Deck;
    this.DungeonRow = new DungeonRow;
    this.populateDungeon(4);
  }

  populateDungeon(n) {
    const newCards = this.Deck.draw(n);
    this.DungeonRow.fillEmpties(newCards);
  }

  popIfDungeonEmpty() {
    if (this.DungeonRow.count === 1) {
      this.populateDungeon(3);
    }
  }

}

export default Board;
