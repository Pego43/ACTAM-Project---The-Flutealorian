export class Note {
  constructor(duration, name, pause) {
    this.duration = duration;
    this.name = name;
    this.pause = false;
  }
}

export class CustomFunctions {

  constructor(durArray, noteArray, timeArray) {
    this.melody = []
    this.durArray = durArray;
    this.noteArray = noteArray;
    this.timeArray = timeArray;
    this.melody = this.createMelody();
    this.keyBar = []
    this.noteNames = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6'];
    this.blackKeys = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0];
  }

  createDivKey(pos, index, step) {
    const key = document.createElement("div")
    key.classList.add("key")
    var position = pos - step / 2;
    key.style.left = position + "px";
    key.style.width = step + "px";
    if (this.blackKeys[index]) {
      key.style.backgroundColor = "black";
    }
    keyBar.appendChild(key)
  }
  createMelody() {
    var melody = [];
    for (let i = 0; i < this.durArray.length; i++) {

      melody[i] = new Note(this.durArray[i], this.noteArray[i]);

    }
    return melody;
  }

  notesToCoins(arrayStep, coins, tempo) {
    // -> 60/bpm = duration of a fourth note in seconds
    var fourthDuration = 60/tempo;
    for (let i = 0; i < this.melody.length; i++) {
      var x = arrayStep[this.noteNames.indexOf(this.melody[i].name)];

      var normNoteDuration = this.durArray[i]/fourthDuration;
      var normNoteTime = this.timeArray[i]/fourthDuration;

      normNoteDuration = normNoteDuration.toFixed(2);
      normNoteTime = normNoteTime.toFixed(2);
      var y = -(normNoteTime * 50);
      y -= 150;
      //Adding some space from a note to the other to give the player more reaction time
      y = y - (50 * i);
      
      var noteHeight = normNoteDuration * 50;
      coins.create(x, y, 'coin 4').setOrigin(0.5, 1).setDisplaySize(50, noteHeight);
    }
  }
}