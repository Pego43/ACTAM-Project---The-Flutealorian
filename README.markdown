## FLUTEALORIAN

### Authors
- Gabriele Perego
- Enrico Roncuzzi
- Samuele Del Moro
- Ricard Plandolit

## How to run this code:
1. Open on Visual Studio Code
2. Install Live Server extention
3. Run the ACTAM.Project2122-TraningGame/src/index.html file with "Go Live"

# Documentation:
1. [What is Flutealorian](#what)
2. [Game Modalities](#modes)
3. [Libraries](#libraries)
4. [Input](#input)
5. [Repo structure](#repo)
6. [Further developments](#future)

# What is Flutealorian <a name = "what"></a>
 **Advanced Coding Tools and Metodologies Project**
Videogame (inspired by the Star Wars® universe) in which the player must make his/her character move by playng a musical instrument.
The Goal: to learn to play an instrument having fun.
![image](https://user-images.githubusercontent.com/56070706/150500057-a2b3c235-1320-44a0-940f-5bbd9f1a049d.png)


# Game Modalities <a name = "modes"></a>  
Piano Mode: get the highest score playing the notes correctly through a MIDI piano.
Wind Mode: avoid as many obstacles as possible by playing a wind instrument (Flute/Trumpet/any…).

# Libraries <a name = "libraries"></a>  
- Phaser.js, to develop part of the game and make it run smoothly and in an optimized way
- Tone.js, to play sound when hitting the midi keyboard keys
- Tone.js/midi to use midi files (containing the game's melodies) to store them easily on the firebase database
- Firebase package, to store melodies in a remote fashion in order to have them always available

# Input <a name = "input"></a>  
- Midi input: using midi messages we mapped the keyboard, 2 pads and a knob to control respectively the character on piano mode, pause and restart button and BPM's of the song
- Microphone input: allow microphone usage to control the character in wind mode

# Repo Structure <a name = "repo"></a>
- Flutealorian/src folder: contains all wind mode code
- src/scenes folder: contains main menu and piano mode code
- src/ folder: contains modules used in src/scenes (CustomSound.js was used before instead of the Tone.js library, not used anymore)
- src/assets folder: contains all assets used in menu and piano mode
- Midi Files folder: contains midi files uploaded on the firebase (not useful to make the code run)

# Future developments <a name = "future"></a>  
- No octave restrictions on wind mode
- Chords on piano mode
- Midi file from user
- More pitch recognition precision
- Synth sound modification
- Playing accompaniment music
- Remote storage of high-score
![image](https://user-images.githubusercontent.com/56070706/150503759-c2a55480-113e-4279-898c-6f6700a5f973.png)

