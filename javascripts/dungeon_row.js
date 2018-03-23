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

  empty() {
    for (let i = 0; i < 4; i++) {
      if (this.spaces[i].length === 1) {
        return false;
      }
    }
    return true;
  }

}

export default DungeonRow;
