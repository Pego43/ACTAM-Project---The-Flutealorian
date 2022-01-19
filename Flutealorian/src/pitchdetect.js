window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var DEBUGCANVAS = null;
var mediaStreamSource = null;
var detectorElem, canvasElem,waveCanvas,pitchElem,noteElem,detuneElem,detuneAmount;
var instrumentTrumpet  = false;
var frequencySensibility = 450; // Variable for control the sensibility of the frequencies
//var maxFrequency = 2093;

window.onload = function() {
	audioContext = new AudioContext();
	audioContext.resume();
	MAX_SIZE = Math.max(4,Math.floor(audioContext.sampleRate / 5000));// corresponds to a 5kHz signal

	detectorElem = document.getElementById( "detector" );
	canvasElem = document.getElementById( "output" );
	DEBUGCANVAS = document.getElementById( "waveform" );
	if (DEBUGCANVAS) {
		waveCanvas = DEBUGCANVAS.getContext("2d");
		waveCanvas.strokeStyle = "black";
		waveCanvas.lineWidth = 1;
	}
	pitchElem = document.getElementById( "pitch" );
	noteElem = document.getElementById( "note" );
	numberElem = document.getElementById("number");
	this.toggleLiveInput();
}

function error() {
    alert('Stream generation failed.');
}

function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Connect it to the destination.
    analyser = audioContext.createAnalyser();
    //analyser.fftSize = 2048;
	analyser.fftSize = 1024;
    mediaStreamSource.connect( analyser );
	updatePitch();
}

function toggleLiveInput() {
    if (isPlaying) {
        //stop playing and return
        sourceNode.stop( 0 );
        sourceNode = null;
        analyser = null;
        isPlaying = false;
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
        window.cancelAnimationFrame( rafID );
    }
    getUserMedia(
    	{
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream);
}

var rafID = null;
var tracks = null;
var buflen = 2048;
var buf = new Float32Array( buflen );

function fromCharToNote(stringa){
if(stringa != 'undefined'){
	switch(popLastChar(stringa)){
		case 'A':
			return 9;
			break;
		case 'A#':
			return 10;
			break;
				case 'Bb':
					return 10;
					break;
		case 'B':
			return 11;
			break;
		case 'C':
			return 0;
			break;
		case 'C#':
			return 1;
			break;
				case 'Db':
					return 1;
					break;
		case 'D':
			return 2;
			break;
		case 'D#':
			return 3;
			break;
				case 'Eb':
					return 3;
					break;
		case 'E':
			return 4;
			break;
		case 'F':
			return 5;
			break;
		case 'F#':
			return 6;
			break;
				case 'Gb':
					return 6;
					break;
		case 'G':
			return 7;
			break;
		case 'G#':
			return 8;
			break;
				case 'Ab':
					return 8;
					break;
		case '-':
			//Pause point
			return -2;
			break;
		default:
			//Char doesn't identified
			return -1;
			break;
	}
}
}
function noteFromPitch( frequency ) {
	// 440 Hz = La4
	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}

function trumpetNoteFromPitch( frequency ) {
	// 392 Hz = Sol4
	var noteNum = 12 * (Math.log( frequency / 392 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}


function modePlayedInstrument(val){
	switch(val){
		case 0:
			instrumentTrumpet = false;
			frequencySensibility = 450;
			setThreeButtonColors('flute','trumpet','voice');
			break;
		case 1:
			instrumentTrumpet = true;
			frequencySensibility = 200;
			setThreeButtonColors('trumpet','flute','voice');
			break;
		case 2:
			instrumentTrumpet =false;
			frequencySensibility = 0;
			setThreeButtonColors('voice','trumpet','flute');
			break;
		default:
			instrumentTrumpet = false;
			frequencySensibility = 450;
			setThreeButtonColors('flute','trumpet','voice');
			break;
	}
}

function autoCorrelate( buf, sampleRate ) {
	
	var SIZE = buf.length;
	var rms = 0;

	for (var i=0;i<SIZE;i++) {
		var val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01)
		return -1;

	var r1=0, r2=SIZE-1, thres=0.2;
	for (var i=0; i<SIZE/2; i++)
		if (Math.abs(buf[i])<thres) { r1=i; break; }
	for (var i=1; i<SIZE/2; i++)
		if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }

	buf = buf.slice(r1,r2);
	SIZE = buf.length;

	var c = new Array(SIZE).fill(0);
	for (var i=0; i<SIZE; i++)
		for (var j=0; j<SIZE-i; j++)
			c[i] = c[i] + buf[j]*buf[j+i];

	var d=0; while (c[d]>c[d+1]) d++;
	var maxval=-1, maxpos=-1;
	for (var i=d; i<SIZE; i++) {
		if (c[i] > maxval) {
			maxval = c[i];
			maxpos = i;
		}
	}
	var T0 = maxpos;

	var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
	a = (x1 + x3 - 2*x2)/2;
	b = (x3 - x1)/2;
	if (a) T0 = T0 - b/(2*a);

	return sampleRate/T0;
}

function updatePitch() {
	audioContext.resume();
	analyser.getFloatTimeDomainData( buf );
	var ac = autoCorrelate( buf, audioContext.sampleRate );
	var waveBars = 75;

	if (DEBUGCANVAS) {  // This draws the current waveform, useful for debugging
		waveCanvas.clearRect(0,0,waveBars*4,waveBars*2);
		waveCanvas.strokeStyle = "red";
		waveCanvas.beginPath();
		waveCanvas.moveTo(0,0);
		waveCanvas.lineTo(0,waveBars*2);
		waveCanvas.moveTo(waveBars,0);
		waveCanvas.lineTo(waveBars,waveBars*2);
		waveCanvas.moveTo(waveBars*2,0);
		waveCanvas.lineTo(waveBars*2,waveBars*2);
		waveCanvas.moveTo(waveBars*3,0);
		waveCanvas.lineTo(waveBars*3,waveBars*2);
		waveCanvas.moveTo(waveBars*4,0);
		waveCanvas.lineTo(waveBars*4,waveBars*2);
		waveCanvas.stroke();
		waveCanvas.strokeStyle = "yellow";
		waveCanvas.beginPath();
		waveCanvas.moveTo(0,buf[0]);
		for (var i=1;i<waveBars*4;i++) {
			waveCanvas.lineTo(i,waveBars+(buf[i]*waveBars));
		}
		waveCanvas.stroke();
	}

 	if (ac == -1) {
	 	pitchElem.innerText = "--";
		noteElem.innerText = "--";
		numberElem.innerText = "--";
 	} else{
	 	pitch = ac;
		 //Check the maxFrequency
		 if(Math.round(pitch) >= frequencySensibility /*&& Math.round(pitch) < maxFrequency*/ ){
			pitchElem.innerText = Math.round( pitch ) ;
			if(instrumentTrumpet) var note = trumpetNoteFromPitch(pitch);	
			else var note =  noteFromPitch( pitch );
		    noteElem.innerHTML = noteStrings[note%12];
		    numberElem.innerText = note%12;
		 }
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	rafID = window.requestAnimationFrame( updatePitch );
}