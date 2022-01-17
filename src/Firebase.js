var firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBw4yueSosPMIWNkEAWI1zi_9RdTr2jGt4",
  authDomain: "provamelody.firebaseapp.com",
  projectId: "provamelody",
  storageBucket: "provamelody.appspot.com",
  messagingSenderId: "173143885954",
  appId: "1:173143885954:web:40e739ff4d5f0160c30c9b"
});

var db = firebaseApp.firestore();

var collectionRef = db.collection('Melody');

var docRef = collectionRef.doc("Prova quarti");
var noteArray = [];
var durationArray = [];
var timeArray = [];
var melodyArray = [];
var melodyToUpload = [];
var songTempo;
var collectionName = '';

export class DB {
  constructor() {
  }

  initializeLocalVariables() {
    console.log("initLocal");
    docRef.get().then((doc) => {
      if (!doc.exists)
        return;
      var c = doc.data();
      melodyArray = doc.get("melody");
      songTempo = doc.get("tempo");

      melodyArray.forEach(element => {
        noteArray.push(element.Note);
        durationArray.push(element.Duration);
        timeArray.push(element.Time);
      });
      console.log(noteArray);
    });
  }

  setSceneMelody(song){
    docRef = collectionRef.doc(song);
  }

  setSceneMicrophoneGame(song){
    db.collection('MicrophoneSongs').doc('SongSelection').set({songName: song});
    return;
  }

  getSongTempo(){
    return songTempo;
  }

  getDocNames(button) {
    if(button == 1){
      collectionName = "Melody";
    } else if (button == 2){
      collectionName = "MicrophoneSongs";
    }
    // Print each document 
    var songs = new Array();
    songs = [];
    db.collection(collectionName).onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        songs.push(doc.id); // For doc name
      })
    })
    console.log(songs);
    return songs;
  }

  getDataInCustom(callback) {

    docRef.get().then((doc) => {
      if (!doc.exists)
        return;
      callback(durationArray, noteArray, timeArray);
    });

  }


  async asyncMidiFunction() {
    /* collectionRef = db.collection('MicrophoneSongs');
    docRef = collectionRef.doc("Prince of Egypt"); */

    // load a midi file in the browser
    const midi = await Midi.fromUrl("../provaMidiFile2.mid");
    //docRef = collectionRef.doc(name of user uploaded midi);
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
        console.log(note.duration)
        noteToUpload.Note = note.name;
        noteToUpload.Duration = note.duration;
        noteToUpload.Time = note.time;
        melodyToUpload.push(noteToUpload);
      })
      console.log(melodyToUpload);
      docRef.set({ tempo: midi.header.tempos[0].bpm, melody: melodyToUpload });
    })
    return;
  }

}