class Microphone{
    constructor(fftSize){
        this.initialized = false;
        navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
            this.audioContext = new AudioContext();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = fftSize;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            this.microphone.connect(this.analyser);
            this.initialized = true;
        }.bind(this)).catch(function(err){
            alert(err);
        });
    }
    getSamples(){
        /* In time domain */
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map(e => e/128 - 1); //It is optional : 0 <= normSamples <= 1

        /* In frequency domain */
        //this.analyser.getByteFrequencyData(this.dataArray);
        //let normSamples = [...this.dataArray].map(e => e/128);
        
        return normSamples;
    }
    getFrequency(){
        //const Pitchfinder = require("pitchfinder");
        const detectPitch = Pitchfinder.AMDF();

        //const myAudioBuffer = getAudioBuffer(); // assume this returns a WebAudio AudioBuffer object
        const float32Array = getSamples(); // get a single channel of sound
        const pitch = detectPitch(float32Array); 
        return pitch;
    }
    getVolume(){
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map(e => e/128 - 1);
        let sum = 0;
        for (let i=0; i<normSamples.length; i++){
            sum += normSamples[i] * normSamples[i];
        }
        let volume = Math.sqrt(sum / normSamples.length);
        return volume;
    }
}

/*  Promise:
                IMPORTANT TO UNDERSTAND: our git samples method will take audio data
                which was originally saved as an array of values between 0 and 255
                and it converts it to an array of values between -1 and 1.
                Then, it returns this normalized array in a format that is ready for
                animation or other.
            */