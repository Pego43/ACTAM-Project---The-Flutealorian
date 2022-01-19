class Melody{
    constructor(stringNote,stringDuration){
        this.stringNote = stringNote;
        this.stringDuration = stringDuration;
    }
}

// Function for transform C3, C#3, Db3... into C,C#,Db....
function popLastChar(st){
    if(st != null) return st.substring(0, st.length - 1);
    else return -1;
}

// Function for detect the range frequencies of the instrument
function detectionFrequencyFlute(p,err){
    if( (523.3 - err <= p && p <= 2093 + err)) return true;
    else return false;
}

// Function for count the valid notes
function countNotes(nt){
    var k=0;
    for (let i=0;i<nt.length;i++){
        if(nt[i] != '--') k++;
    }
    return k;
}

var myNotesChar = [];
var myNotesDur = [];
var tempo = 0;
/*
myNotesChar =   ['E4','Ab4','B4','D5','C5','D5','B4','E4','B4','A4','--','E4','Ab4','B4','D5','C5','D5','B4','--',
                    'E5','D5','C5','D5','B4','C5','B4','A4','B4','--','G4','C4','G4','F#4','C4','F#4','E4'];
myNotesDur =    [1,1,1,1,1,0.5,0.5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,3,1,1,1,1,1,2,3,5]; 

Fra Martino
myNotesChar = ['C','D','E','C','C','D','E','C','E','F','G','E','F','G','G','A','G','F','E','C','G','A','G','F','E','C','D','G','C'];
myNotesDur = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,1,0.5,0.5,1,0.125,0.125,0.125,0.125,0.5,0.5,0.125,0.125,0.125,0.125,0.5,0.5,0.5,0.5,1];

*/

var db = new DB();

// Function for get the values from the database
async function getValuesFromDB(){
    await db.initializeLocalVariables().then(()=>{
        myNotesChar = db.getNoteArray();
        myNotesDur = db.getDurationArray(); 
        tempo = db.getSongTempo();
    });
}



