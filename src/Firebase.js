

var firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBw4yueSosPMIWNkEAWI1zi_9RdTr2jGt4",
  authDomain: "provamelody.firebaseapp.com",
  projectId: "provamelody",
  storageBucket: "provamelody.appspot.com",
  messagingSenderId: "173143885954",
  appId: "1:173143885954:web:40e739ff4d5f0160c30c9b"
});

var db = firebaseApp.firestore();

const collectionRef = db.collection('String');

const docRef = collectionRef.doc("PBgr6QErlLqMIhF2XFoS");

//var custom = null;
var noteArray = [];
var dArray = [];
var container = [];

docRef.get().then((doc) => {
if(!doc.exists)
return;
var c = doc.data();
var t = JSON.stringify(c)
const obj = JSON.parse(t);
noteArray = obj.melody.split(',');
dArray = obj.duration.split(',').map(Number);
//custom = new CustomFunctions(dArray, noteArray);
console.log("Document data:" ,doc.data());
console.log(dArray);
});

export class DB{
  constructor(){
}

getDataInCustom(callback){

docRef.get().then((doc) => {
  if(!doc.exists)
  return;
  callback(dArray, noteArray);
  });

}



getNotes() {
  return noteArray;
}

getDuration() {
  return dArray;
}

}