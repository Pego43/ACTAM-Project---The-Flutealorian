export class Note {
    constructor(duration, name, pause){
      this.duration = duration*50;
      this.name = name;
      this.pause = false;
    }
  }

export class CustomFunctions{

    constructor(durArray, noteArray){
        this.melody = []
        this.durArray = durArray;
        this.noteArray = noteArray;
        this.melody = this.createMelody();
        this.melodySpace = []
        this.keyBar = []
        this.noteNames = ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'P'];
        this.blackKeys = [0,1,0,1,0,0,1,0,1,0,1,0,0,0];
    }
    
    createDivKey(pos, index, step){
        const key = document.createElement("div")
        key.classList.add("key")
        var position = pos-step/2;
        key.style.left = position + "px";
        key.style.width = step + "px";
        if(this.blackKeys[index]){
          key.style.backgroundColor = "black";
        }
        keyBar.appendChild(key)
    }
    createMelody(){
      var melody = [];
      for(let i = 0; i < this.durArray.length; i++){

        melody[i] = new Note(this.durArray[i], this.noteArray[i]);
        
 
      }
      return melody;
  }
      
    melodyToSpace(){
        this.melodySpace[0] = 0;
        var totalDuration = this.melody[0].duration;
        for(let i = 1; i < this.melody.length; i++){
          this.melodySpace[i] = totalDuration;
          totalDuration = totalDuration + this.melody[i].duration;
        }
    }
      
    notesToCoins(arrayStep, coins){
        for(let i = 0; i < this.melody.length; i++){
          if(this.noteArray[i] =='P'){
            //coins.pause
            var x = -100;
          }
          else{
            var x = arrayStep[this.noteNames.indexOf(this.melody[i].name)];
          }
          var y = -this.melodySpace[i];

          switch (this.melody[i].duration/50) {
            case 1:
              coins.create(x, y, 'coin 1').setOrigin(0.5, 1);
              break;
            case 2:
              coins.create(x, y, 'coin 2').setOrigin(0.5, 1);
              break;
            case 3:
              coins.create(x, y, 'coin 3').setOrigin(0.5, 1);
              break;
            case 4:
              coins.create(x, y, 'coin 4').setOrigin(0.5, 1);
              break;
            
            default:
              break;
          }
          
        }
    }
}