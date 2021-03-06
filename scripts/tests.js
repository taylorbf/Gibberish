Gibberish.Binops.export();
Gibberish.Time.export();

window.routingTest = function() {
  Gibberish.clear();
  
  bus1 = new Gibberish.Bus2().connect();
  
  fm  = new Gibberish.FMSynth();
  fm.connect( bus1 );
  fm.connect( Gibberish.out );
  
  filter = new Gibberish.Filter24( bus1 ).connect();
  
  ssd = new Gibberish.SingleSampleDelay( filter );
  ssd.connect(bus1);
  
  ssd2 = new Gibberish.SingleSampleDelay( Gibberish.out );
  ssd2.connect( bus1 );
  
  bus2 = new Gibberish.Bus2({ amp:.5 });
  filter.connect( bus2 );
  
  distortion = new Gibberish.Distortion( bus2 ).connect();
  
  b = new Gibberish.Sequencer({
    target:fm, key:'note',
    values:[ function() { return 100 + Math.random() * 200; } ],
    durations:[22050],
  }).start();
  
	var inputString = "/* testing a complex routing with two feedback loops and multiple busses\n"+
  "          v-------------------------------------<\n"+
  "          v--------------------<                |\n"+
  "          |                    |                |\n"+
  "synth -> bus1 -> filter -> ssd-^                |\n"+
  "  |       |         |                           |\n"+
  "  ------------------------------> *OUT* -> ssd -^\n"+
  "                    |          ^  \n"+
  "                    |          |\n"+
  "                    > bus2 -> distortion\n*/\n"+
  "bus1 = new Gibberish.Bus2().connect();\n"+
  "\n"+
  "fm  = new Gibberish.FMSynth();\n"+
  "fm.connect( bus1 );\n"+
  "fm.connect( Gibberish.out );\n"+
  "\n"+
  "filter = new Gibberish.Filter24( bus1 ).connect();\n"+
  "\n"+
  "ssd = new Gibberish.SingleSampleDelay( filter );\n"+
  "ssd.connect(bus1);\n"+
  "\n"+
  "ssd2 = new Gibberish.SingleSampleDelay( Gibberish.out );\n"+
  "ssd2.connect( bus1 );\n"+
  "\n"+
  "bus2 = new Gibberish.Bus2({ amp:.5 });\n"+
  "filter.connect( bus2 );\n"+
  "\n"+
  "distortion = new Gibberish.Distortion( bus2 ).connect();\n"+
  "\n"+
  "b = new Gibberish.Sequencer({\n"+
  "  target:fm, key:'note',\n"+
  "  values:[ function() { return 100 + Math.random() * 200; } ],\n"+
  "  durations:[22050],\n"+
  "}).start();";
  
	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.vibratoTest = function() {
  Gibberish.clear();
  
  mod1 = new Gibberish.Sine(4, 0);
  mod2 = new Gibberish.Sine(.1, 50);  
  mod1.amp = mod2;
  
  sin = new Gibberish.Sine( Add(mod1, 440), .25 ).connect();
    
	var inputString = "// vibrato that changes depth over time \n\n"+
  "mod1 = new Gibberish.Sine(4, 0)\n"+
  "mod2 = new Gibberish.Sine(.1, 50); \n"+
  "mod1.amp = mod2\n"+
  "\n"+
  "sin = new Gibberish.Sine( Add(mod1, 440), .25 ).connect()\n";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.lineTest = function() {
  Gibberish.clear();
  
  line = new Gibberish.Line(0, 1, 88200, true);
  a = new Gibberish.Sine(991, line).connect();
    
	var inputString = "// ramping amplitude and looping the ramp\n\n"+
  "line = new Gibberish.Line(0, 1, 88200, true);\n"+
  "a = new Gibberish.Sine(991, line).connect();\n";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.input = function() {
  Gibberish.clear();
  
  a = new Gibberish.Input();
  b = new Gibberish.Delay( a ).connect();
    
	var inputString = "// read mic input and run through delay\n\n"+
  'a = new Gibberish.Input();\n'+
  'b = new Gibberish.Delay( a ).connect();';
  

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
}

window.twoOscsOneMod = function() {
  Gibberish.clear();
  
  mod = new Gibberish.Sine(4, 20);
  a = new Gibberish.Sine( Add(440, mod), .5).connect();
  b = new Gibberish.Sine( Add(880, mod), .25).connect();
    
	var inputString = "// a simple test to ensure that one modulation source affecting two\n"+
  "// ugens is memoized and only run once per sample.\n\n"+
  "mod = new Gibberish.Sine(4, 20);\n"+
  "a = new Gibberish.Sine( Add(440, mod), .5).connect();\n"+
  "b = new Gibberish.Sine( Add(880, mod), .25).connect();\n";
 
	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.ADSRTest = function() {
  Gibberish.clear();
  
  adsr = new Gibberish.ADSR(22050, 22050, 88200, 22050, 1, .75);
  
  a = new Gibberish.Sine( 440, Mul(.5, adsr) ).connect();
    
  b = new Gibberish.Sequencer({
    target:adsr, key:'run',
    durations:[ seconds(4) ],
  }).start();
  
	var inputString = "// test of ADSR envelope.\n\n"+
  "adsr = new Gibberish.ADSR(22050, 22050, 88200, 22050, 1, .75);\n"+
  "\n"+
  "a = new Gibberish.Sine( 440, Mul(.5, adsr) ).connect();\n"+
  "\n"+
  "b = new Gibberish.Sequencer({\n"+
  "  target:adsr, key:'run',\n"+
  "  durations:[ seconds(4) ],\n"+
  "}).start();\n";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.distortion = function() {
  Gibberish.clear();
  
  a = new Gibberish.Sine(440, .5);
  b = new Gibberish.Distortion(a, 100).connect();
  
  sequencer = new Gibberish.Sequencer({
    target:a, key:'frequency',
    values:[ Gibberish.Rndf(200, 1000) ],
    durations: [ 11025 ],
  }).start();
  
	var inputString = "// waveshaping test\n"+
  "a = new Gibberish.Sine(440, .5);\n"+
  "b = new Gibberish.Distortion(a, 100).connect();\n"+
  "\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:a, key:'frequency',\n"+
  "  values:[ Gibberish.Rndf(200, 1000) ],\n"+
  "  durations:[ 11025 ],\n"+
  "}).start();";


	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.delay = function() {
  if(typeof sequencer !== 'undefined') sequencer.disconnect();
  Gibberish.clear();
			
	a = new Gibberish.FMSynth();
	b = new Gibberish.Delay(a).connect( Gibberish.out );
  
  sequencer = new Gibberish.Sequencer({
    target:a, key:'note',
    values:[ Gibberish.Rndf(200, 1000) ],
    durations:[ 44100 ],
  }).start();
			
	var inputString = "a = new Gibberish.FMSynth();\n"+
	"b = new Gibberish.Delay(a).connect( Gibberish.out );\n"+
  "\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:a, key:'note',\n"+
  "  values:[ Gibberish.Rndf(200, 1000) ],\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.reverb = function() {
  Gibberish.clear();
			
	a = new Gibberish.KarplusStrong();
	b = new Gibberish.Reverb(a).connect();
  
  sequencer = new Gibberish.Sequencer({
    target:a, key:'note',
    values:[ Gibberish.Rndf(200, 1000) ],
    durations:[ 44100 ],
  }).start();

	var inputString = "a = new Gibberish.KarplusStrong();\n"+
	"b = new Gibberish.Reverb(a).connect();\n"+
  "\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:a, key:'note',\n"+
  "  values:[ Gibberish.Rndf(200, 1000) ],\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();";


	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.flanger = function() {
  Gibberish.clear();
			
	a = new Gibberish.FMSynth();
	b = new Gibberish.Flanger({input:a, feedback:.5}).connect();
  
  sequencer = new Gibberish.Sequencer({
    target:a, key:'note',
    values:[ Gibberish.Rndf(200, 1000) ],
    durations:[ 44100 ],
  }).start();
	
	var inputString = "a = new Gibberish.FMSynth();\n"+
	"b = new Gibberish.Flanger({input:a, feedback:.5}).connect();\n"+
  "\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:a, key:'note',\n"+
  "  values:[ Gibberish.Rndf(200, 1000) ],\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.vibrato = function() {
  Gibberish.clear();
			
	s = new Gibberish.KarplusStrong();
  a = new Gibberish.Vibrato( s ).connect();
			
  sequencer = new Gibberish.Sequencer({
    target:s, key:'note',
    values:[ Gibberish.Rndf(150, 650)],
    durations:[ 44100 ],
  }).start();

	var inputString = "s = new Gibberish.KarplusStrong();\n"+
  "a = new Gibberish.Vibrato( s ).connect();\n\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:s, key:'note',\n"+
  "  values:[ Gibberish.Rndf(150, 650)],\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.decimator = function() {
  Gibberish.clear();
			
	a = new Gibberish.FMSynth();
	b = new Gibberish.Decimator(a, 2, .2).connect( Gibberish.out );
  
  sequencer = new Gibberish.Sequencer({
    target:a, key:'note',
    values:[ Gibberish.Rndf(200, 1000) ],
    durations:[ 44100 ],
  }).start();
			
	var inputString = "a = new Gibberish.FMSynth();\n"+
	"b = new Gibberish.Decimator(a, 2, .2).connect( Gibberish.out );\n"+
  "\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:a, key:'note',\n"+
  "  values:[ Gibberish.Rndf(200, 1000) ],\n"+
  "  durations:[44100],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.ringModulation = function() {
  Gibberish.clear();
  
  a = new Gibberish.Saw3()
  b = new Gibberish.RingModulation({
    input:a, 
    frequency: Add( 1016, new Gibberish.Sine(.05, 500) ),
    amp:1,
    mix:1
  }).connect()

	var inputString = "// ring modulation test\n\n"+
  "a = new Gibberish.Saw3()\n\n"+
  "b = new Gibberish.RingModulation({\n"+
  "  input:a, \n"+
  "  frequency: Add( 1016, new Gibberish.Sine(.05, 500) ),\n"+
  "  amp:1,\n"+
  "  mix:1\n"+
  "}).connect()\n";
  
	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.ladderFilter = function() {
  Gibberish.clear();
  
  a = new Gibberish.FMSynth();
  b = new Gibberish.Filter24({ input:a, cutoff:.2, resonance:4 }).connect();
  
  sequencer = new Gibberish.Sequencer({
    values:[ 
      function() { 
        a.note(440);
        b.cutoff = Math.random() * .5;
      }
    ],
    durations:[44100],
  }).start();
  
	var inputString = "// testing a 24db filter on a fmsynth\n"+
  "a = new Gibberish.FMSynth();\n"+
  "b = new Gibberish.Filter24({ input:a, cutoff:.2, resonance:4 }).connect();\n"+
  "\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  values:[ \n"+
  "    function() { \n"+
  "      a.note(440);\n"+
  "      b.cutoff = Math.random() * .5;\n"+
  "    }\n"+
  "  ],\n"+
  "  durations:[44100],\n"+
  "}).start();\n";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.stateVariableFilter = function() {
  if(typeof sequencer !== 'undefined') sequencer.disconnect();
  Gibberish.clear();
  
  a = new Gibberish.FMSynth();
  b = new Gibberish.SVF({input:a, cutoff:440, Q:4}).connect();
  
  sequencer = new Gibberish.Sequencer({
    values:[ 
      function() { 
        a.note(440);
        b.cutoff = Gibberish.rndf(150, 1000);
      }
    ],
    durations:[44100],
  }).start();
  
	var inputString = "// testing a SVF filter on a fmsynth\n"+
  "a = new Gibberish.FMSynth();\n"+
  "b = new Gibberish.SVF({input:a, cutoff:440, Q:4}).connect();\n"+
  "\n"+
  "b.connect( Gibberish.out );\n"+
  "\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  values:[ \n"+
  "    function() { \n"+
  "      a.note(440);\n"+
  "      b.cutoff = Gibberish.rndf(150, 1000);\n"+
  "    }\n"+
  "  ],\n"+
  "  durations:[44100],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.FMTest = function() {
  Gibberish.clear();
			
	s = new Gibberish.FMSynth().connect();
	
  sequencer = new Gibberish.Sequencer({
    target:s, key:'note',
    values:[ Gibberish.Rndf(200, 1000) ],
    durations:[44100],
  }).start();
			
	var inputString = "s = new Gibberish.FMSynth().connect();\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:s, key:'note',\n"+
  "  values:[ Gibberish.Rndf(200, 1000) ],\n"+
  "  durations:[44100],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.polyFM = function() {
  Gibberish.clear();
  			
	s = new Gibberish.PolyFM({ attack:20 }).connect();
	
  sequencer = new Gibberish.Sequencer({
    values:[ function() {
  		s.note( Gibberish.rndf(200, 1000) );
  		s.note( Gibberish.rndf(200, 1000) );
  		s.note( Gibberish.rndf(200, 1000) );
  		s.note( Gibberish.rndf(200, 1000) );
  		s.note( Gibberish.rndf(200, 1000) ); 
    } ],
    durations:[44100],
  }).start();
			
	var inputString = "s = new Gibberish.PolyFM({ attack:20 }).connect();\n\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  values:[ function() {\n"+
  "		s.note( Gibberish.rndf(200, 1000) );\n"+
  "		s.note( Gibberish.rndf(200, 1000) );\n"+
  "		s.note( Gibberish.rndf(200, 1000) );\n"+
  "		s.note( Gibberish.rndf(200, 1000) );\n"+
  "		s.note( Gibberish.rndf(200, 1000) ); \n"+
  "  } ],\n"+
  "  durations:[44100],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.synth = function() {
  Gibberish.clear();

  waves = ["Saw3", "PWM", "Sine"];		
	s = new Gibberish.Synth().connect();
	
  sequencer = new Gibberish.Sequencer({
    target:s,
    keysAndValues: {
      note: [ Gibberish.Rndf(200, 1000) ],
      waveform : [ function() { return waves[ Gibberish.rndi( 0, 2 ) ]; } ],
    },
    durations:[ 44100 ],
  }).start();
			
	var inputString = "waves = ['Saw3', 'PWM', 'Sine'];\n"+		
	"s = new Gibberish.Synth().connect();\n"+
	"		\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:s,\n"+
  "  keysAndValues: {\n"+
  "    note: [ Gibberish.Rndf(200, 1000) ],\n"+
  "    waveform : [ function() { return waves[ Gibberish.rndi( 0, 2 ) ]; } ],\n"+
  "  },\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();\n";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.synth2 = function() {
  Gibberish.clear();
	
	s = new Gibberish.Synth2().connect();
	
  sequencer = new Gibberish.Sequencer({
    target:s,
    keysAndValues:{
      note:   [ Gibberish.Rndf(200, 800) ],
      cutoff: [ Gibberish.Rndf(.3, .6) ],
    },
    durations:[ 44100 ],
  }).start();

	var inputString = "// oscillator with envelope and a filter\n"+		
	"s = new Gibberish.Synth2().connect();\n"+
	"		\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:s,\n"+
  "  keysAndValues:{\n"+
  "    note:   [ Gibberish.Rndf(200, 800) ],\n"+
  "    cutoff: [ Gibberish.Rndf(.3, .6) ],\n"+
  "  }\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.monoSynth = function() {
  if(typeof sequencer !== 'undefined') sequencer.disconnect();
  Gibberish.clear();

	s = new Gibberish.MonoSynth({
	  attack: 20,
    resonance: 4,
    cutoff:.2
	}).connect();
	
  sequencer = new Gibberish.Sequencer({
    target:s, key:'note',
    values: [ Gibberish.Rndf(150, 300) ],
    durations:[ 22050 ],
  }).start();
			
	var inputString = "// monosynth... three oscillators + filter + envelope\n"+		
	"s = new Gibberish.MonoSynth({\n"+
	"  attack: 20,\n"+
  "  resonance: 4,\n"+
  "  cutoff:.2\n"+
	"}).connect();\n"+
	"\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:s, key:'note',\n"+
  "  values: [ Gibberish.Rndf(150, 300) ],\n"+
  "  durations:[ 22050 ],\n"+
  "}).start();\n";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.polySynth = function() {
  Gibberish.clear();
  	
	s = new Gibberish.PolySynth({ 
    attack: 20,
    decay: 88200,
    pulsewidth: Add( .5, new Gibberish.Sine(.1, .45) ),
  }).connect();
	  
  sequencer = new Gibberish.Sequencer({
    values: [ 
      function() {
    		s.note( Gibberish.rndf(200, 1000) );
    		s.note( Gibberish.rndf(200, 1000) );
    		s.note( Gibberish.rndf(200, 1000) );
    		s.note( Gibberish.rndf(200, 1000) );
    		s.note( Gibberish.rndf(200, 1000) ); 
      }
    ],
    durations:[ 44100 ],
  }).start();
			
	var inputString = "// a test of the polysynth with pulsewidth modulation applied\n"+
	"s = new Gibberish.PolySynth({ \n"+
  "  attack: 20,\n"+
  "  decay: 88200,\n"+
  "  pulsewidth: Add( .5, new Gibberish.Sine(.1, .45) ),\n"+
  "}).connect();\n"+
  "\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  values: [ \n"+
  "    function() {\n"+
  "  		s.note( Gibberish.rndf(200, 1000) );\n"+
  "  		s.note( Gibberish.rndf(200, 1000) );\n"+
  "  		s.note( Gibberish.rndf(200, 1000) );\n"+
  "  		s.note( Gibberish.rndf(200, 1000) );\n"+
  "  		s.note( Gibberish.rndf(200, 1000) ); \n"+
  "    }\n"+
  "  ],\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.karplusStrong = function() {
  Gibberish.clear();

	s = new Gibberish.KarplusStrong().connect();
	
  sequencer = new Gibberish.Sequencer({
    target:s, key:'note', 
    values:[ Gibberish.Rndf(200, 1000) ],
    durations:[ 44100 ],
  }).start();
			
	var inputString = "s = new Gibberish.KarplusStrong.connect();\n\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:s, key:'note', \n"+
  "  values:[ Gibberish.Rndf(200, 1000) ],\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.polyKarplusStrong = function() {
  if(typeof sequencer !== 'undefined') sequencer.disconnect();
  Gibberish.clear();
  	
	s = new Gibberish.PolyKarplusStrong().connect();
	  		
  sequencer = new Gibberish.Sequencer({
    values: [ 
      function() {
    		s.note( Gibberish.rndf(200, 1000) );
    		s.note( Gibberish.rndf(200, 1000) );
    		s.note( Gibberish.rndf(200, 1000) );
    		s.note( Gibberish.rndf(200, 1000) );
    		s.note( Gibberish.rndf(200, 1000) ); 
      }
    ],
    durations:[ 44100 ],
  }).start();
			
	var inputString = "// a test of the polyphonic karplus strong\n"+
  "s = new Gibberish.PolyKarplusStrong().connect();\n"+
  "		\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  values: [ \n"+
  "    function() {\n"+
  "  		s.note( Gibberish.rndf(200, 1000) );\n"+
  "  		s.note( Gibberish.rndf(200, 1000) );\n"+
  "  		s.note( Gibberish.rndf(200, 1000) );\n"+
  "  		s.note( Gibberish.rndf(200, 1000) );\n"+
  "  		s.note( Gibberish.rndf(200, 1000) ); \n"+
  "    }\n"+
  "  ],\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.bufferShuffler = function() {
  Gibberish.clear();
  	
	s = new Gibberish.PolyKarplusStrong();
  a = new Gibberish.BufferShuffler(s).connect();
	  		
  sequencer = new Gibberish.Sequencer({
    values: [ 
      function() {
    		s.note( Math.round(200 + Math.random() * 800) );
    		s.note( Math.round(200 + Math.random() * 800) );
    		s.note( Math.round(200 + Math.random() * 800) );
    		s.note( Math.round(200 + Math.random() * 800) );
    		s.note( Math.round(200 + Math.random() * 800) ); 
      }
    ],
    durations:[ 44100 ],
  }).start();
			
	var inputString = "// buffer shuffling applied to plucked string chords\n"+
  "s = new Gibberish.PolyKarplusStrong()\n"+
  "\n"+
  "a = new Gibberish.BufferShuffler(s).connect();\n\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  values: [ \n"+
  "    function() {\n"+
  "  		s.note( Math.round(200 + Math.random() * 800) );\n"+
  "  		s.note( Math.round(200 + Math.random() * 800) );\n"+
  "  		s.note( Math.round(200 + Math.random() * 800) );\n"+
  "  		s.note( Math.round(200 + Math.random() * 800) );\n"+
  "  		s.note( Math.round(200 + Math.random() * 800) ); \n"+
  "    }\n"+
  "  ],\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.sampler = function() {
  Gibberish.clear();

	a = new Gibberish.Sampler('resources/snare.wav').connect();
	
  sequencer = new Gibberish.Sequencer({
    target:a, key:'note',
    values:[ Gibberish.Rndf(-3, 3) ],
    durations:[ 11025 ],
  }).start();
			
	var inputString = "// the note method for the sampler object\n"+
  "// defines speed of playback; negative values play in reverse\n"+
  "a = new Gibberish.Sampler('resources/snare.wav').connect();\n"+
	"\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  target:a, key:'note',\n"+
  "  values:[ Gibberish.Rndf(-3, 3) ],\n"+
  "  durations:[ 11025 ]\n"+
  "}).start();";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.feedbackTest = function() {
  Gibberish.clear();
  
  a = new Gibberish.Sine(440, 1);
  b = new Gibberish.SingleSampleDelay( a, 10 );
  
  c = new Gibberish.Sine(440, 1);
  
  a.mod('frequency', c, "+");
  c.mod('frequency', b, "+");
  //a.mod('frequency', 380, "*");  
  
  a.connect( Gibberish.out );
  
	var inputString = "// a short feedback loop to test codegen engine\n"+
  "a = new Gibberish.Sine(440, 1);\n"+
  "b = new Gibberish.Sine(880, 1);\n"+
  "c = new Gibberish.SingleSampleDelay( b );\n"+
  "d = new Gibberish.SingleSampleDelay( a );\n"+
  "\n"+
  "a.mod('frequency', c,  '+');\n"+
  "a.mod('frequency', 500, '*');  \n"+
  "b.mod('frequency', d,  '+');\n"+
  "b.mod('frequency', 50, '*');  \n"+
  "\n"+
  "a.connect( Gibberish.out );\n"+
  "b.connect( Gibberish.out );";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.bandLimitedPWM = function() {
  Gibberish.clear();
  
  a = new Gibberish.PWM({ pulsewidth: Add( .5, new Gibberish.Sine(.1, .49) ) }).connect();
    
	var inputString = "// a bandlimited PWM oscillator built using FM feedback\n\n"+
  "a = new Gibberish.PWM({ \n"+
  "  pulsewidth: Add( .5, new Gibberish.Sine(.1, .49) ) \n"+
  "}).connect();\n";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.granulator = function() {
  Gibberish.clear();
			
	a = new Gibberish.Sampler('resources/trumpet.wav');
  
  // wait until sample is loaded to create granulator
  a.onload = function() {
    b = new Gibberish.Granulator({ 
      buffer:a.getBuffer(),
      grainSize:1000,
      speedMin: -2,
      speedMax: 2,
    });
    
    b.mod('position', new Gibberish.Sine(.1, .45), '+');
    
    b.connect();
  };
  
	var inputString = "// granulating a trumpet sample\n"+
	"a = new Gibberish.Sampler('resources/trumpet.wav');\n"+
  "\n"+
  "// wait until sample is loaded to create granulator\n"+
  "a.onload = function() {\n"+
  "  b = new Gibberish.Granulator({ \n"+
  "    buffer:a.getBuffer(),\n"+
  "    grainSize:1000,\n"+
  "    speedMin: -2,\n"+
  "    speedMax: 2,\n"+
  "  });\n"+
  "\n"+
  "  b.mod('position', new Gibberish.Sine(.1, .45), '+');\n"+
  "  b.connect();\n"+
  "};";
  
	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.clear = function() {
  if(typeof timeout !== 'undefined') clearTimeout(timeout);
  
	var input = document.getElementById("input");
	input.innerHTML = "";
  
  Gibberish.clear();
  
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
};

window.biquadFilter = function() {
  Gibberish.clear();
  
  a = new Gibberish.FMSynth();
  b = new Gibberish.Biquad(a, 'LP', 240, .5).connect();
  
  sequencer = new Gibberish.Sequencer({
    values:[
      function() {
        a.note(440);
        b.cutoff = 110 + Math.random() * 1500;
        b.calculateCoefficients();
      }
    ],
    durations:[ 44100 ],
  }).start();
  
	var inputString = "// testing a biquad filter on a fmsynth. biquad coefficients must be reset manually.\n"+
  "a = new Gibberish.FMSynth();\n"+
  "b = new Gibberish.Biquad(a, 'LP', 240, .5).connect();\n"+
  "\n"+
  "sequencer = new Gibberish.Sequencer({\n"+
  "  values:[\n"+
  "    function() {\n"+
  "      a.note(440);\n"+
  "      b.cutoff = 110 + Math.random() * 1500;\n"+
  "      b.calculateCoefficients();\n"+
  "    }\n"+
  "  ],\n"+
  "  durations:[ 44100 ],\n"+
  "}).start();\n";
  
	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);

}

window.sequencerTest = function() {
  if(typeof sequencer !== 'undefined') sequencer.disconnect();
  Gibberish.clear();
  
  a = new Gibberish.FMSynth().connect();
  
  b = new Gibberish.Sequencer({
    target:a, key:'note',
    values:[880,660,440,220],
    durations:[22050, 11025, 44100],
  }).start();
  
	var inputString = "// sequencers provide sample accurate timing.\n"+
  "// here we sequence calls to the note method of our target synth option.\n"+
  "// durations determines how quickly the sequencer advances, in samples.\n"+
  "a = new Gibberish.FMSynth().connect();\n"+
  "\n"+
  "b = new Gibberish.Sequencer({\n"+
  "  target:a, key:'note',\n"+
  "  values:[880,660,440,220],\n"+
  "  durations:[22050, 11025, 44100],\n"+
  "}).start();\n";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);

}

window.tr808_emulation = function() {
  Gibberish.clear();
  
  a = new Gibberish.Kick({ decay:20 }).connect()
  b = new Gibberish.Sequencer({
    target:a, key:'note',
    values:[80],
    durations:[22050]
  }).start()
  
  Gibberish.future( function() {
    c = new Gibberish.Snare({ snappy: 1.5 }).connect()
    d = new Gibberish.Sequencer({
      target:c, key:'note',
      values:[Gibberish.Rndf(-.05,.05)],
      durations:[44100]
    }).start()
  }, 22050);
  
  e = new Gibberish.Hat({ amp:.2 }).connect()
  f = new Gibberish.Sequencer({
    target:e, key:'note',
    values:[ function() { return Math.random() > .8 ? 15000 : 5000 } ],
    durations:[5512, 5513]
  }).start()
  
	var inputString = "// simple test for kick / snare / hat roland tr-808 emulation\n"+
  "// tuning for kick is in hz, for snare is in multiple of base frequency\n"+
  "a = new Gibberish.Kick({ decay: 20 }).connect()\n"+
  "b = new Gibberish.Sequencer({\n"+
  "  target:a, key:'note',\n"+
  "  values:[80],\n"+
  "  durations:[22050]\n"+
  "}).start()\n"+
  "\n"+
  "Gibberish.future( function() {\n"+
  "  c = new Gibberish.Snare({ snappy: 1.5 }).connect()\n"+
  "  d = new Gibberish.Sequencer({\n"+
  "    target:c, key:'note',\n"+
  "    values:[Gibberish.Rndf(-.05,.05)],\n"+
  "    durations:[44100]\n"+
  "  }).start()\n"+
  "}, 22050);\n"+
  "\n"+  
  "e = new Gibberish.Hat({ amp:.2 }).connect()\n"+
  "f = new Gibberish.Sequencer({\n"+
  "  target:e, key:'note',\n"+
  "  values:[ function() { return Math.random() > .8 ? 15000 : 5000 } ],\n"+
  "  durations:[5512, 5513]\n"+
  "}).start()";

	var input = document.getElementById("input");
	input.innerHTML = inputString;
			
	codeTimeout = setTimeout(function() { 
		var codegen = document.getElementById("output");
		codegen.innerHTML = Gibberish.callbackString;
	}, 250);
}