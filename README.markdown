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
**Advanced Coding Tools and Metodologies Project**:
Videogame (inspired by the Star Wars® universe) in which the player must make his/her character move by playng a musical instrument.
The Goal: to learn to play an instrument having fun.

# Game Modalities <a name = "modes"></a>  
Piano Mode: get the highest score playing the notes correctly through a MIDI piano.

![image](https://user-images.githubusercontent.com/56070706/150505483-602517b3-a395-43b1-ac48-8f284c9904fc.png)

Wind Mode: avoid as many obstacles as possible by playing a wind instrument (Flute/Trumpet/any…).

![image](https://user-images.githubusercontent.com/56070706/150505543-d64e3557-8691-48ee-b545-9def5fbfe40c.png)

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
