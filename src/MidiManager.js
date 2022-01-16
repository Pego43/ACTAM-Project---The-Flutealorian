export class MidiManager{

    constructor(){
        this.melody = [];
        this.noteInMelody = {};
        this.durArray = [];
        this.noteArray = [];
        this.midi_notes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
        this.noteNames = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6'];
    }

    async asyncMidiFunction() {
        // load a midi file in the browser
        //const midi = await Midi.fromUrl("../provaMidiFile2.mid");
        //the file name decoded from the first track
        const name = midi.name
        //get the tracks
        midi.tracks.forEach(track => {
            //tracks have notes and controlChanges
            
            //notes are an array
            const notes = track.notes
            notes.forEach(note => {
                //note.midi, note.time, note.duration, note.name
                this.noteInMelody.Note = note.name;
                this.noteInMelody.Duration = note.duration;
                this.noteInMelody.Time = note.time;
                this.melody.push(this.noteInMelody);
                //db.docRef.set({Note: note.name, Duration: note.duration, Time: note.time})
            })
        })
        //await db.docRef.set(this.melody);
    }
}