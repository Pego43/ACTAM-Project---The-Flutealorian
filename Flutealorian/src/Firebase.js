var firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBw4yueSosPMIWNkEAWI1zi_9RdTr2jGt4",
  authDomain: "provamelody.firebaseapp.com",
  projectId: "provamelody",
  storageBucket: "provamelody.appspot.com",
  messagingSenderId: "173143885954",
  appId: "1:173143885954:web:40e739ff4d5f0160c30c9b"
});

var db = firebaseApp.firestore();

const collectionRef = db.collection('MicrophoneSongs');

var docRef = collectionRef.doc("Prince of Egypt");
var noteArray = [];
var durationArray = [];
var timeArray = [];
var melodyArray = [];
var melodyToUpload = [];
var songTempo;
var songName = ''

class DB {
  constructor() {
  }

  async initializeLocalVariables() {
    docRef = collectionRef.doc("SongSelection");
    return docRef.get().then((doc) => {
      if (!doc.exists)
        return;
      songName = doc.get("songName");
      docRef = collectionRef.doc(songName);
      
      return docRef.get().then((doc) => {
        if (!doc.exists)
          return;

        melodyArray = doc.get("melody");
        songTempo = doc.get("tempo");
        console.log(songTempo);
        console.log(melodyArray);
  
        var fourthDuration = 60/songTempo;
        melodyArray.forEach(element => {
          noteArray.push(element.Note);
  
          var normDuration =(element.Duration/fourthDuration).toFixed(2);
          durationArray.push(normDuration);
  
          timeArray.push(element.Time);
        });
      });
    });
  }

  setSceneMelody(song) {
    docRef = collectionRef.doc(song);
  }

  getNoteArray() {
    return noteArray;
  }

  getDurationArray() {
    return durationArray;
  }

  getSongTempo(){
    return songTempo;
  }

  async asyncMidiFunction() {
    console.log("async");
    // load a midi file in the browser
    const midi = await Midi.fromUrl("../prova3.mid");
    //the file name decoded from the first track
    const name = midi.name
    //get the tracks
    midi.tracks.forEach(track => {
      //tracks have notes and controlChanges
      //notes are an array
      const notes = track.notes
      notes.forEach(note => {
        var noteToUpload = new Object();
        //note.midi, note.time, note.duration, note.name
        //this.noteArray.push(note.midi);
        console.log(note.name)
        noteToUpload.Note = note.name;
        noteToUpload.Duration = note.duration;
        noteToUpload.Time = note.time;
        melodyToUpload.push(noteToUpload);
      })
      console.log(melodyToUpload);
      docRef.set({ melodyToUpload });
    })
    return;
  }


}
