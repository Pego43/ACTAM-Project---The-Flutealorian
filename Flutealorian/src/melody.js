class Melody{
    constructor(stringNote,stringDuration){
        this.stringNote = stringNote;
        this.stringDuration = stringDuration;
    }
}

function detectionFrequencyFlute(p,err){
    if( (523.3 - err <= p && p <= 2093 + err)) return true;
    else return false;
}

var myNotesChar = [];
var myNotesDur = [];
myNotesChar = ['C','D','E','F','G','A','B',];
myNotesDur =  [1,1,1,1,1,1,2];

/*  Imperial March  */
//myNotesChar = ['A','A','A','F','C','A','F','C','A','-','E','E','E','F','C','G#','F','C','A'];
myNotesChar = ['E','A','D','G','E','A','D','G'];

for(let i=0; i<myNotesChar.length; i++){
    myNotesDur[i] = 1;
}

/*  Fra Martino */
//myNotesChar = ['C','D','E','C','C','D','E','C','E','F','G','E','F','G','G','A','G','F','E','C','G','A','G','F','E','C','D','G','C'];
//myNotesDur = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,1,0.5,0.5,1,0.125,0.125,0.125,0.125,0.5,0.5,0.125,0.125,0.125,0.125,0.5,0.5,0.5,0.5,1];

/*
myNotesChar =   ['E','Ab','B','D','C','D','B','E','B','A','-',
                'E','Ab','B','D','C','D','B','-',
                'E','D','C','D','B','C','B','A','B','-',
                'G','C','G','F#','C','F#','E','-',
                
                ];
myNotesDur =    [1,1,1,1,3,0.5,1,1,1,3,1,
                1,1,1,1,3,0.5,5.5,1,
                1,1,1,1,2,1,1,1,3,1,
                1,1,1,1,2,3,5,5,
                
                ];
*/

//https://freshsheetmusic.com/whitney-houston-and-mariah-carey-when-you-believe-176295/


myNotesChar = ['E','B','B','E','A','F#','D','A','A','F#','E','D','B','-',
                'E','F#','G','A','B','E','B','A','G','E','E','G','F#'
                ];
myNotesDur =  [0.25,0.25,0.25,0.25,2,0.25,0.25,1,1,0.25,0.25,0.25,1,1,
                0.25,0.25,0.25,0.25,0.25,0.25,2,0.125,0.25,0.25,0.25,0.25,3];

