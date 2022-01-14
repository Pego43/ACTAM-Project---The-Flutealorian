class Melody{
    constructor(stringNote,stringDuration){
        this.stringNote = stringNote;
        this.stringDuration = stringDuration;
    }
}

//Function for transform C3, C#3, Db3... into C,C#,Db....
function popLastChar(st){
    if(st != null) return st.substring(0, st.length - 1);
    else return -1;
}

function detectionFrequencyFlute(p,err){
    if( (523.3 - err <= p && p <= 2093 + err)) return true;
    else return false;
}

function countNotes(nt){
    var k=0;
    for (let i=0;i<nt.length;i++){
        if(nt[i] != '--') k++;
    }
    return k;
}

var myNotesChar = [];
var myNotesDur = [];


/*
for(let i=0; i<myNotesChar.length; i++){
    myNotesDur[i] = 1;
}
*/

/*  Imperial March  */
//myNotesChar = ['A','A','A','F','C','A','F','C','A','-','E','E','E','F','C','G#','F','C','A'];

/*  Fra Martino */
//myNotesChar = ['C','D','E','C','C','D','E','C','E','F','G','E','F','G','G','A','G','F','E','C','G','A','G','F','E','C','D','G','C'];
//myNotesDur = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,1,0.5,0.5,1,0.125,0.125,0.125,0.125,0.5,0.5,0.125,0.125,0.125,0.125,0.5,0.5,0.5,0.5,1];


myNotesChar =   ['E4','Ab4','B4','D5','C5','D5','B4','E4','B4','A4','--',
                'E4','Ab4','B4','D5','C5','D5','B4','--',
                'E5','D5','C5','D5','B4','C5','B4','A4','B4','--',
                'G4','C4','G4','F#4','C4','F#4','E4'
                ];
myNotesDur =    [1,1,1,1,1,0.5,0.5,1,1,1,1,
                1,1,1,1,1,1,1,1,
                1,1,1,1,2,1,1,1,3,1,
                1,1,1,1,2,3,5
                ];


//https://freshsheetmusic.com/whitney-houston-and-mariah-carey-when-you-believe-176295/


