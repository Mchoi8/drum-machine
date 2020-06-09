

// ------------------------.wav file sounds.-------------------------------------
let sound_files = ['Sounds/DrumSounds/hihat.wav', 'Sounds/DrumSounds/snare.wav', 'Sounds/DrumSounds/solidbass.wav', 'Sounds/bass-trim.mp3' ];

 
let sound_type = ''; //This sound type changes based on the buttons clicked.
window.AudioContext = window.AudioContext || window.webkitAudioContext; 
var audioContext = new AudioContext();
 



//--------------------------Tonejs Sounds--------------------------------------------
// Using the Tonejs library, created the sounds for the drums and the bass
// following the documentation that they provided specifically for instruments


  // Highpass
  const highpass = new Tone.Filter({
    type: 'highpass',
    frequency: 7000
  }).toMaster()


const lowPass = new Tone.Filter({
    frequency: 11000
  }).toMaster()

  
  const tonesnare = new Tone.NoiseSynth({  // creates a synth that sounds like a drum snare
    volume: -10,
    noise: {
      type: 'white',
      playbackRate: 1
    },
    envelope: {
      attackCurve: 'exponential',
      attack: 0.001,
      decay: 0.3,
      sustain: 0,
      release: 0.1
    }
  }).connect(lowPass)
  

  const tonebass = new Tone.Synth({ // creates a synth that sounds like a bass string
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.01,
      attackCurve: 'exponential',
      decay: 2.00,
      decayCurve: 'exponential',
      sustain: 0.50,
      release: 4.0,
      releaseCurve: 'exponential'
    }
  }).toMaster()


  const tonekick = new Tone.MembraneSynth( // creates a synth that sounds like a drum kick
    {
      pitchDecay: 0.2,
      octaves: 2.0,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.001,
        decay: 0.5,
        sustain: 0.01,
        release: 0.1,
        attackCurve: 'linear'
      }
    }).toMaster()


const tonehihat = new Tone.NoiseSynth({ // creates a synth that sounds like a drum hi-hat
    volume: -10,
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.001,
      attackCurve: 'exponential',
      decay: 0.1,
      decayCurve: 'exponential',
      sustain: 0.0,
      release: 0.1,
      releaseCurve: 'exponential'
    }
}).connect(highpass)




//--------------------------Web Audio API Sounds--------------------------------------------
// Using Web Audio API to create various drum and bass sounds that sound more electronic in tone and sound.


var hihat2 = () => { // creates the hi-hat sound using the badnpass and highpass and emits a short tick sound.

    var context = new AudioContext();
    var fundamental = 40;
    var ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];

    // Always useful
    var when = context.currentTime;

    var gain = context.createGain();

    // Bandpass
    var bandpass = context.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 10000;

    // Highpass
    var highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 7000;

    // Connect the graph
    bandpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(context.destination);

    // Create the oscillators
    ratios.forEach(function(ratio) {
    var osc = context.createOscillator();
    osc.type = "square";
    osc.frequency.value = fundamental * ratio;
    osc.connect(bandpass);
    osc.start(when);
    osc.stop(when + 0.3);
    });

    // Define the volume envelope
    gain.gain.setValueAtTime(0.00001, when);
    gain.gain.exponentialRampToValueAtTime(1, when + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.3, when + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.00001, when + 0.2);
 
};


 var kick = () =>{  // Creates the kick sounds using 2 oscillators

  var kickosc = audioContext.createOscillator();
  var kickosc2 = audioContext.createOscillator();
  var gainOsc = audioContext.createGain();
  var gainOsc2 = audioContext.createGain();

  kickosc.type = "triangle";
  kickosc2.type = "sine";

  gainOsc.gain.setValueAtTime(1, audioContext.currentTime);
  gainOsc.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

  gainOsc2.gain.setValueAtTime(1, audioContext.currentTime); 
  gainOsc2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
 
  kickosc.frequency.setValueAtTime(200, audioContext.currentTime); 
  kickosc.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

  kickosc2.frequency.setValueAtTime(100, audioContext.currentTime);
  kickosc2.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

  kickosc.connect(gainOsc);
  kickosc2.connect(gainOsc2);
  gainOsc.connect(audioContext.destination);
  gainOsc2.connect(audioContext.destination);

  kickosc.start(audioContext.currentTime);
  kickosc2.start(audioContext.currentTime);

  kickosc.stop(audioContext.currentTime + 0.5);
  kickosc2.stop(audioContext.currentTime + 0.5);

};


var snare2 = () => { // Creates the kick sounds using 2 oscillators

    var noiseBuffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate);
    data = noiseBuffer.getChannelData(0);
    var noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    var noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    noise.connect(noiseFilter);
    var noiseEnvelope = audioContext.createGain();
    noiseFilter.connect(noiseEnvelope);
    noiseEnvelope.connect(audioContext.destination);
    var osc = audioContext.createOscillator();
    osc.type = 'triangle';
    var oscEnvelope = audioContext.createGain();
    osc.connect(oscEnvelope);
    oscEnvelope.connect(audioContext.destination);
    noiseEnvelope.gain.setValueAtTime(1, audioContext.currentTime);
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    for (var i = 0; i < 4096; i++) {
      data[i] = Math.random();
    }

    noise.start(audioContext.currentTime);
    osc.frequency.setValueAtTime(100, audioContext.currentTime);
    oscEnvelope.gain.setValueAtTime(0.5, audioContext.currentTime);
    oscEnvelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.4);
    noise.stop(audioContext.currentTime + 0.4);

}



var bass = () => {   // creates a bass guitar sound using web audio api
  
  var noiseBuffer = audioContext.createBuffer(10, 4096, audioContext.sampleRate);
  data = noiseBuffer.getChannelData(0);
  var noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;

  var noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = 'lowshelf';
  noiseFilter.frequency.value = 100;
  noise.connect(noiseFilter);

  var noiseEnvelope = audioContext.createGain();
  noiseFilter.connect(noiseEnvelope);
  noiseEnvelope.connect(audioContext.destination);
  var osc = audioContext.createOscillator();
  osc.type = 'triangle';
  var oscEnvelope = audioContext.createGain();
  osc.connect(oscEnvelope);
  oscEnvelope.connect(audioContext.destination);
  
  noiseEnvelope.gain.setValueAtTime(1, audioContext.currentTime);
  noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  noise.start(audioContext.currentTime);


  osc.frequency.setValueAtTime(120, audioContext.currentTime);
  oscEnvelope.gain.setValueAtTime(0.9, audioContext.currentTime);
  oscEnvelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);


  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.5);
  noise.stop(audioContext.currentTime + 0.5);

}




// Button Onclick Calls---------------------------------------------------------------------


var defaultSounds = () => { 
  // Once the 'Default Sounds' button is clicked, this function runs creating the audio objects from the stored sound files
  // and actively waiting for the correct keys to play the appropriate drum and bass sounds. When pressed the background color changes adding user interactivity.
  let audio_list = [];

  for( var index in sound_files) {
    let audio = new Audio();
    audio.src = sound_files[index];
    audio_list.push(audio);
  }
  sound_type = 'default';
  document.addEventListener('keydown', event => { //
    const keyName = event.key;
    if(sound_type == 'default') {

      if (keyName == 'q') {
        audio_list[0].play();
        document.getElementById('img1').style.backgroundColor = '#FFF8DC';
      } else if (keyName == 'w') {
        audio_list[1].play();
        document.getElementById('img2').style.backgroundColor = '#FFF8DC';
      } else if (keyName == 'e') {
        audio_list[2].play();
        document.getElementById('img3').style.backgroundColor = '#FFF8DC';
      } else if (keyName == 'i') {
        audio_list[3].play();
        document.getElementById('img4').style.backgroundColor = '#FFF8DC';
      }
    }
    });


    document.addEventListener('keyup', event => { //
      
      const keyName = event.key;
      if(sound_type == 'default') {
        if (keyName == 'q') {
          document.getElementById('img1').style.backgroundColor = 'transparent';
        } else if (keyName == 'w') {
          document.getElementById('img2').style.backgroundColor = 'transparent';
        } else if (keyName == 'e') {
          document.getElementById('img3').style.backgroundColor = 'transparent';
        } else if (keyName == 'i') {
          document.getElementById('img4').style.backgroundColor = 'transparent';
        }
        }
      });

  }  



var sound1 = () => {
  // When the 'Web Audio Sounds' button is clicked, the function runs and it waits for the correct keys pressed to
  // play the sounds created in the web audio section. When pressed the background color changes adding user interactivity.
  sound_type = 'sound1';
  document.addEventListener('keydown', event => { //
      
    const keyName = event.key;
    if(sound_type == 'sound1') {
      if (keyName == 'q') {
        hihat2();
        document.getElementById('img1').style.backgroundColor = '#1E90FF'; 
      } else if (keyName == 'w') {
        snare2();
        document.getElementById('img2').style.backgroundColor = '#1E90FF';
      } else if (keyName == 'e') {
         kick();
         document.getElementById('img3').style.backgroundColor = '#1E90FF';
      } else if (keyName == 'o') {
         bass();
         document.getElementById('img5').style.backgroundColor = '#1E90FF';
      }
      }
    });

    document.addEventListener('keyup', event => { //
      
      const keyName = event.key;
      if(sound_type == 'sound1') {
        if (keyName == 'q') {
          document.getElementById('img1').style.backgroundColor = 'transparent';
        } else if (keyName == 'w') {
          document.getElementById('img2').style.backgroundColor = 'transparent';
        } else if (keyName == 'e') {
          document.getElementById('img3').style.backgroundColor = 'transparent';
        } else if (keyName == 'o') {
          document.getElementById('img5').style.backgroundColor = 'transparent';          
        }
        }
      });


  }



  var sound2 = () => {
    // Function runs when the 'Tonejs Sounds' button is clicked and plays the methods that initiate the Tone js sounds. 
    // When pressed the background color changes adding user interactivity.
    sound_type = 'sound2';

    document.addEventListener('keydown', event => { //
        const keyName = event.key;
        if(sound_type == 'sound2') {
          if (keyName == 'q') {
            tonehihat.triggerAttack();
            document.getElementById('img1').style.backgroundColor = '#00FA9A';
          } else if (keyName == 'w') {
            tonesnare.triggerAttack();
            document.getElementById('img2').style.backgroundColor = '#00FA9A';
          } else if (keyName == 'e') {
            tonekick.triggerAttackRelease('C1', '8n');
            document.getElementById('img3').style.backgroundColor = '#00FA9A';
          } else if (keyName == 'p') {
            tonebass.triggerAttackRelease('C2', '8n');    
            document.getElementById('img6').style.backgroundColor = '#00FA9A';
                }
        }
      });


    document.addEventListener('keyup', event => { //
      
      const keyName = event.key;
      if(sound_type == 'sound2') {
        if (keyName == 'q') {
          document.getElementById('img1').style.backgroundColor = 'transparent';
        } else if (keyName == 'w') {
          document.getElementById('img2').style.backgroundColor = 'transparent';
        } else if (keyName == 'e') {
          document.getElementById('img3').style.backgroundColor = 'transparent';
        } else if (keyName == 'p') {
          document.getElementById('img6').style.backgroundColor = 'transparent';
        }
        }
      });



    }
  


// Credits

// https://findsounds.com/    Resource in using the drum and bass sound files
// https://chrislo.github.io/drum_synthesis/    Resources from this individual's own drum synthesis using the Web Audio API. 
// https://tonejs.github.io/docs/13.8.25/MembraneSynth.html    Resources from the Tonejs documentation on instrumental soounds
