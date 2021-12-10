export class CustomSound{
    //var sound = new Sound(this, 'metronome', 1, true);
    constructor(){
        //Audio variables
        this.c = new AudioContext()
        this.g;
        this.attack = 0.02;
        this.decay = 0.06;
        //C3
        this.referenceFrequency = 261.63;
    }

    createGain() {
        this.g = this.c.createGain()
        this.g.connect(this.c.destination)
    }
    
    play(noteIndex){
        var o = this.c.createOscillator()
        o.connect(this.g)
        o.frequency.value = this.noteToFrequency(noteIndex)
        o.type = "sine"
        o.start() 
        this.g.gain.setValueAtTime(0,this.c.currentTime)
        this.g.gain.linearRampToValueAtTime(1, this.c.currentTime+this.attack)
        this.g.gain.linearRampToValueAtTime(0, this.c.currentTime+this.attack+this.decay)
        o.stop(this.c.currentTime+this.attack+this.decay)
    }

    noteToFrequency(noteIndex){
        return this.referenceFrequency*Math.pow(2,noteIndex/12);
    }
}