Gibberish.effect = function() {
    this.type = 'effect';
};
Gibberish.effect.prototype = new Gibberish.ugen();
Gibberish._effect = new Gibberish.effect();

/**#Gibberish.Distortion - FX
A simple waveshaping distortion that adaptively scales its gain based on the amount of distortion applied.
  
## Example Usage##
`a = new Gibberish.Synth({ attack:44, decay:44100 });  
b = new Gibberish.Distortion({ input:a, amount:30 }).connect();  
a.note(440);  
`  
## Constructor   
**param** *properties*: Object. A dictionary of property values (see below) to set for the synth on initialization.
- - - -
**/
/**###Gibberish.Distortion.amount : property  
Number. The amount of distortion to apply. This number cannot be set lower than 2.
**/
Gibberish.Distortion = function() {
  var abs = Math.abs, 
      log = Math.log, 
      ln2 = Math.LN2;
  
  Gibberish.extend(this, {
    name : 'distortion',
    
    properties : {
      input  : 0,
      amount : 50,
    },
    
    callback : function(input, amount) {
      var x;
      amount = amount > 2 ? amount : 2;
      if(typeof input === 'number') {
    		x = input * amount;
    		input = (x / (1 + abs(x))) / (log(amount) / ln2); //TODO: get rid of log / divide
      }else{
        x = input[0] * amount;
        input[0] = (x / (1 + abs(x))) / (log(amount) / ln2); //TODO: get rid of log / divide
        x = input[1] * amount;
        input[1] = (x / (1 + abs(x))) / (log(amount) / ln2); //TODO: get rid of log / divide      
      }
  		return input;
    },
  })
  .init()
  .processProperties(arguments);
};
Gibberish.Distortion.prototype = Gibberish._effect;

/**#Gibberish.Delay - FX
A simple echo effect.
  
## Example Usage##
`a = new Gibberish.Synth({ attack:44, decay:44100 });  
b = new Gibberish.Delay({ input:a, time:22050, feedback:.35 }).connect();  
a.note(440);  
`  
## Constructor   
**param** *properties*: Object. A dictionary of property values (see below) to set for the synth on initialization.
- - - -
**/
/**###Gibberish.Delay.time : property  
Number. The delay time as measured in samples
**/
/**###Gibberish.Delay.feedback : property  
Number. The amount of feedback that the delay puts into its buffers.
**/
Gibberish.Delay = function() {
  var buffers = [],
      phase = 0;
  
  buffers.push( new Float32Array(88200) );
  buffers.push( new Float32Array(88200) );
  
  Gibberish.extend(this, {
  	name:"delay",
  	properties:{ input:0, time: 22050, feedback: .5 },
				
  	callback : function(sample, time, feedback) {
      var channels = typeof sample === 'number' ? 1 : 2;
      
  		var _phase = phase++ % 88200;
      
  		var delayPos = (_phase + time) % 88200;
      if(channels === 1) {
  			buffers[0][delayPos] =  (sample + buffers[0][_phase]) * feedback;
        sample += buffers[0][_phase];
      }else{
  			buffers[0][delayPos] =  (sample[0] + buffers[0][_phase]) * feedback;
        sample[0] += buffers[0][_phase];
  			buffers[1][delayPos] =  (sample[1] + buffers[1][_phase]) * feedback;
        sample[1] += buffers[1][_phase];   
      }
      
  		return sample;
  	},
  })
  .init()
  .processProperties(arguments);
};
Gibberish.Delay.prototype = Gibberish._effect;

/**#Gibberish.Decimator - FX
A bit-crusher / sample rate reducer. Adapted from code / comments at http://musicdsp.org/showArchiveComment.php?ArchiveID=124

## Example Usage##
`a = new Gibberish.Synth({ attack:44, decay:44100 });  
b = new Gibberish.Decimator({ input:a, bitDepth:4.2, sampleRate:.33 }).connect();  
a.note(440);  
`  
## Constructor   
**param** *properties*: Object. A dictionary of property values (see below) to set for the synth on initialization.
- - - -
**/
/**###Gibberish.Decimator.bitDepth : property  
Float. 0..16. The number of bits the signal is truncated to. May be a floating point number.
**/
/**###Gibberish.Decimator.sampleRate : property  
Number. 0..1. The sample rate to use where 0 is 0 Hz and 1 is nyquist.
**/
Gibberish.Decimator = function() {
  var counter = 0,
      hold = [],
      pow = Math.pow,
      floor = Math.floor;
      
  Gibberish.extend(this, {
  	name:"decimator",
  	properties:{ input:0, bitDepth: 16, sampleRate: 1 },
				
  	callback : function(sample, depth, rate) {
  		counter += rate;
      var channels = typeof sample === 'number' ? 1 : 2;
      
      if(channels === 1) {
  			if(counter >= 1) {
  				var bitMult = pow( depth, 2.0 );
  				hold[0]  = floor( sample * bitMult ) / bitMult;
  				counter -= 1;
  			}
  			sample = hold[0];
      }else{
  			if(counter >= 1) {
  				var bitMult = pow( depth, 2.0 );
  				hold[0]  = floor( sample[0] * bitMult ) / bitMult;
  				hold[1]  = floor( sample[1] * bitMult ) / bitMult;          
  				counter -= 1;
  			}
  			sample = hold;
      }
					
  		return sample;
  	},
  })
  .init()
  .processProperties(arguments);
};
Gibberish.Decimator.prototype = Gibberish._effect;

/**#Gibberish.RingModulation - FX
The name says it all. This ugen also has a mix property to control the ratio of wet to dry output.

## Example Usage##
`a = new Gibberish.Synth({ attack:44, decay:44100 });  
b = new Gibberish.RingModulation({ input:a, frequency:1000, amp:.4, mix:1 }).connect();  
a.note(440);  
`  
## Constructor   
**param** *properties*: Object. A dictionary of property values (see below) to set for the synth on initialization.
- - - -
**/
/**###Gibberish.RingModulation.frequency : property  
Float. The frequency of the ring modulation modulator wave.
**/
/**###Gibberish.RingModulation.amp : property  
Float. The amplitude of the ring modulation modulator wave.
**/
/**###Gibberish.RingModulation.mix : property  
Float. 0..1. The wet/dry output ratio. A value of 1 means a completely wet signal, a value of 0 means completely dry.
**/
Gibberish.RingModulation = function() {
  var sin = new Gibberish.Sine().callback,
      output = [0,0];
      
  Gibberish.extend( this, { 
  	name : "ringmod",
  
	  properties : { input:0, frequency:440, amp:.5, mix:.5 },

    callback : function(sample, frequency, amp, mix) {
      var channels = typeof sample === 'number' ? 1 : 2;
      var output1 = channels === 1 ? sample : sample[0];
      
      var mod = sin(frequency, amp);
      
      output1 = output1 * (1-mix) + (output1 * mod) * mix;
      
      if(channels === 2) {
        var output2 = sample[1];
        output2 = output2 * (1-mix) + (output2 * mod) * mix;

        output[0] = output1;
        output[1] = output2;
        return output;
      }
      
		  return output1; // return mono
  	},
  })
  .init()
  .processProperties(arguments); 
};
Gibberish.RingModulation.prototype = Gibberish._effect;

/**#Gibberish.OnePole - FX
A one-pole filter for smoothing property values. This is particularly useful when the properties are being controlled interactively. You use the smooth method to apply the filter.

## Example Usage##
`a = new Gibberish.Synth({ attack:44, decay:44100 }).connect();  
b = new Gibberish.OnePole({input:a.properties.frequency, a0:.0001, b1:.9999});  
b.smooth('frequency', a);  
a.note(880);  
a.note(440);  
`  
## Constructor   
**param** *properties*: Object. A dictionary of property values (see below) to set for the synth on initialization.
- - - -
**/
/**###Gibberish.OnePole.input : property  
Float. The property to smooth. You should always refer to this property through the properties dictionary of the ugen. In general it is much easier to use the smooth method of the OnePole than to set this property manually.
**/
/**###Gibberish.OnePole.a0 : property  
Float. The value the input is multiplied by.
**/
/**###Gibberish.OnePole.b1 : property  
Float. The value this pole of the filter is multiplied by.
**/
Gibberish.OnePole = function() {
  var history = 0,
      phase = 0;
      
	Gibberish.extend(this, {
  	name: 'onepole',
    type: 'effect',
    
    properties : {
      input : null,
      a0 : .15,           
      b1 : .85, 
    },
    
    callback : function(input, a0, b1) {
      var out = input * a0 + history * b1;
      history = out;
    
      return out;
    },

/**###Gibberish.OnePole.smooth : method  
Use this to apply the filter to a property of an object.

param **propertyName** String. The name of the property to smooth.  
param **object** Object. The object containing the property to be smoothed
**/    
    smooth : function(propName, obj) {
      this.input = obj.properties[propName];
      obj.mod(propName, this, '=');
    },
  })
  .init()
  .processProperties(arguments);
};
Gibberish.OnePole.prototype = Gibberish._effect;

/**#Gibberish.Filter24 - FX
A four pole ladder filter. Adapted from Arif Ove Karlsne's 24dB ladder approximation: http://musicdsp.org/showArchiveComment.php?ArchiveID=141.

## Example Usage##
`a = new Gibberish.Synth({ attack:44, decay:44100 });  
b = new Gibberish.Filter24({input:a, cutoff:.2, resonance:4}).connect();  
a.note(1760);   
a.note(440);  
a.isLowPass = false;  
a.note(220);  
a.note(1760);  
`  
## Constructor   
**param** *properties*: Object. A dictionary of property values (see below) to set for the synth on initialization.
- - - -
**/
/**###Gibberish.Filter24.input : property  
Object. The ugen that should feed the filter.
**/
/**###Gibberish.Filter24.cutoff : property  
Number. 0..1. The cutoff frequency for the synth's filter.
**/
/**###Gibberish.Filter24.resonance : property  
Number. 0..50. Values above 4.5 are likely to produce shrieking feedback. You are warned.
**/
/**###Gibberish.Filter24.isLowPass : property  
Boolean. Default true. Whether to use a low-pass or high-pass filter.
**/
Gibberish.Filter24 = function() {
  var poles  = [0,0,0,0],
      poles2 = [0,0,0,0],
      output = [0,0],
      phase  = 0,
      _cutoff = isNaN(arguments[0]) ? .1 : arguments[0],
      _resonance = isNaN(arguments[1]) ? 3 : arguments[1]
      _isLowPass = typeof arguments[2] !== 'undefined' ? arguments[2] : true;
      
  Gibberish.extend( this, { 
  	name : "filter24",
  
	  properties : { input:0, cutoff:_cutoff, resonance:_resonance, isLowPass:_isLowPass },

    callback : function(sample, cutoff, resonance, isLowPass) {
      var channels = typeof sample === 'number' ? 1 : 2;
      var output1 = channels === 1 ? sample : sample[0];
      
			var rezz = poles[3] * resonance; 
			rezz = rezz > 1 ? 1 : rezz;
						
			cutoff = cutoff < 0 ? 0 : cutoff;
			cutoff = cutoff > 1 ? 1 : cutoff;
						
			output1 -= rezz;

			poles[0] = poles[0] + ((-poles[0] + output1) * cutoff);
			poles[1] = poles[1] + ((-poles[1] + poles[0])  * cutoff);
			poles[2] = poles[2] + ((-poles[2] + poles[1])  * cutoff);
			poles[3] = poles[3] + ((-poles[3] + poles[2])  * cutoff);

			output1 = isLowPass ? poles[3] : output1 - poles[3];
      
      if(channels === 2) {
        var output2 = sample[1];

  			rezz = poles2[3] * resonance; 
  			rezz = rezz > 1 ? 1 : rezz;

  			output2 -= rezz;

  			poles2[0] = poles2[0] + ((-poles2[0] + output2) * cutoff);
  			poles2[1] = poles2[1] + ((-poles2[1] + poles2[0])  * cutoff);
  			poles2[2] = poles2[2] + ((-poles2[2] + poles2[1])  * cutoff);
  			poles2[3] = poles2[3] + ((-poles2[3] + poles2[2])  * cutoff);

  			output2 = isLowPass ? poles2[3] : output2 - poles2[3];
        output[0] = output1;
        output[1] = output1;
        
        return output;
      }
      
		  return output1; // return mono
  	},
  })
  .init()
  .processProperties(arguments);
};
Gibberish.Filter24.prototype = Gibberish._effect;

/**#Gibberish.SVF - FX
A two-pole state variable filter. This filter calculates coefficients on a per-sample basis, so that you can easily modulate cutoff and Q. Can switch between low-pass, high-pass, band and notch modes.

## Example Usage##
`a = new Gibberish.Synth({ attack:44, decay:44100 });  
b = new Gibberish.SVF({input:a, cutoff:200, Q:4, mode:0});  
a.note(1760);   
a.note(440);  
a.mode = 2;
a.note(220);  
a.note(1760);  
`  
## Constructor   
**param** *properties*: Object. A dictionary of property values (see below) to set for the synth on initialization.
- - - -
**/
/**###Gibberish.SVF.input : property  
Object. The ugen that should feed the filter.
**/
/**###Gibberish.SVF.cutoff : property  
Number. 0..22050. The cutoff frequency for the synth's filter. Note that unlike the Filter24, this is measured in Hz.
**/
/**###Gibberish.SVF.resonance : property  
Number. 0..50. Values above 4.5 are likely to produce shrieking feedback. You are warned.
**/
/**###Gibberish.SVF.mode : property  
Number. 0..3. 0 = lowpass, 1 = highpass, 2 = bandpass, 3 = notch.
**/
Gibberish.SVF = function() {
	var d1 = [0,0], d2 = [0,0], pi= Math.PI, out = [0,0];
  
  Gibberish.extend( this, {
  	name:"SVF",
  	properties : { input:0, cutoff:440, Q:2, mode:0 },
				
  	callback: function(sample, frequency, Q, mode) {
      var channels = typeof sample === 'number' ? 1 : 2;
      var output1 = channels === 1 ? sample : sample[0];
      
  		var f1 = 2 * pi * frequency / 44100;
  		Q = 1 / Q;
					
			var l = d2[0] + f1 * d1[0];
			var h = output1 - l - Q * d1[0];
			var b = f1 * h + d1[0];
			var n = h + l;
						
			d1[0] = b;
			d2[0] = l;
      
			if(mode === 0) 
				output1 = l;
			else if(mode === 1)
				output1 = h;
			else if(mode === 2)
				output1 = b;
			else
				output1 = n;
        
      if(channels === 2) {
        var output2 = sample[1];
  			var l = d2[1] + f1 * d1[1];
  			var h = output2 - l - Q * d1[1];
  			var b = f1 * h + d1[1];
  			var n = h + l;
						
  			d1[1] = b;
  			d2[1] = l;
      
  			if(mode === 0) 
  				output2 = l;
  			else if(mode === 1)
  				output2 = h;
  			else if(mode === 2)
  				output2 = b;
  			else
  				output2 = n;
          
        out[0] = output1; out[1] = output2;
      }else{
        out = output1;
      }

  		return out;
  	},
  })
  .init()
  .processProperties(arguments);
};
Gibberish.SVF.prototype = Gibberish._effect;

/**#Gibberish.Biquad - FX
A two-pole biquad filter. Currently, you must manually call calculateCoefficients every time mode, cutoff or Q changes; thus this filter isn't good for samplerate modulation.

## Example Usage##
`a = new Gibberish.Synth({ attack:44, decay:44100 });  
b = new Gibberish.Biquad({input:a, cutoff:200, Q:4, mode:"LP"}).connect();  
a.note(1760);   
a.note(440);  
a.mode = "HP";
a.note(220);  
a.note(1760);  
`  
## Constructor   
**param** *properties*: Object. A dictionary of property values (see below) to set for the synth on initialization.
- - - -
**/
/**###Gibberish.Biquad.input : property  
Object. The ugen that should feed the filter.
**/
/**###Gibberish.Biquad.cutoff : property  
Number. 0..22050. The cutoff frequency for the synth's filter. Note that unlike the Filter24, this is measured in Hz.
**/
/**###Gibberish.Biquad.Q : property  
Number. 0..50. Values above 4.5 are likely to produce shrieking feedback. You are warned.
**/
/**###Gibberish.Biquad.mode : property  
Number. 0..3. "LP" = lowpass, "HP" = highpass, "BP" = bandpass
**/
Gibberish.Biquad = function() {
  var x1 = [0,0],
      x2 = [0,0],
      y1 = [0,0],
      y2 = [0,0],
      out = [0,0];
      
	Gibberish.extend(this, {
		name: "biquad",
    mode : "LP",
  	cutoff : 2000,
    Q : .5,
    
	  properties: {
      input: null,
							
	    b0: 0.001639,
	    b1: 0.003278,
	    b2: 0.001639,
	    a1: -1.955777,
	    a2: 0.960601,
	  },

	  calculateCoefficients: function() {
      switch (this.mode) {
	      case "LP":
           var w0 = 2 * Math.PI * this.cutoff / 44100,
               sinw0 = Math.sin(w0),
               cosw0 = Math.cos(w0),
               alpha = sinw0 / (2 * this.Q),
               b0 = (1 - cosw0) / 2,
               b1 = 1 - cosw0,
               b2 = b0,
               a0 = 1 + alpha,
               a1 = -2 * cosw0,
               a2 = 1 - alpha;
           break;
	       case "HP":
           var w0 = 2 * Math.PI * this.cutoff / 44100,
               sinw0 = Math.sin(w0),
               cosw0 = Math.cos(w0),
               alpha = sinw0 / (2 * this.Q),
               b0 = (1 + cosw0) / 2,
               b1 = -(1 + cosw0),
               b2 = b0,
               a0 = 1 + alpha,
               a1 = -2 * cosw0,
               a2 = 1 - alpha;
           break;
	       case "BP":
           var w0 = 2 * Math.PI * this.cutoff / 44100,
               sinw0 = Math.sin(w0),
               cosw0 = Math.cos(w0),
               toSinh = Math.log(2) / 2 * this.Q * w0 / sinw0,
               alpha = sinw0 * (Math.exp(toSinh) - Math.exp(-toSinh)) / 2,
               b0 = alpha,
               b1 = 0,
               b2 = -alpha,
               a0 = 1 + alpha,
               a1 = -2 * cosw0,
               a2 = 1 - alpha;
           break;
	       default:
           return;
       }

       this.b0 = b0 / a0;
       this.b1 = b1 / a0;
       this.b2 = b2 / a0;
       this.a1 = a1 / a0;
       this.a2 = a2 / a0;
    },
    call : function(x) {
      return this.function(x, this.b0, this.b1, this.b2, this.a1, this.a2);
    },
    callback: function(x, b0, b1, b2, a1, a2) {
      var channels = typeof x === 'number' ? 1 : 2,
          outL = 0,
          outR = 0,
          inL = channels === 1 ? x : x[0];
      
      outL = b0 * inL + b1 * x1[0] + b2 * x2[0] - a1 * y1[0] - a2 * y2[0];
      x2[0] = x1[0];
      x1[0] = x[0];
      y2[0] = y1[0];
      y1[0] = outL;
      
      if(channels === 2) {
        inR = x[1];
        outR = b0 * inR + b1 * x1[1] + b2 * x2[1] - a1 * y1[1] - a2 * y2[1];
        x2[1] = x1[1];
        x1[1] = x[1];
        y2[1] = y1[1];
        y1[1] = outR;
        
        out[0] = outL;
        out[1] = outR;
      }
      return channels === 1 ? outL : out;
    },
	})
  .init()
  .processProperties(arguments);
  
  this.calculateCoefficients();
};
Gibberish.Biquad.prototype = Gibberish._effect;

/**#Gibberish.Flanger - FX
Classic flanging effect with feedback.

## Example Usage##
`a = new Gibberish.Synth({ attack:44, decay:44100 });  
b = new Gibberish.Flanger({input:a, rate:.5, amount:125, feedback:.5}).connect();  
a.note(440);  
a.feedback = 0;  
a.note(440);  
a.rate = 4;
a.note(440);
`  
## Constructor   
**param** *properties*: Object. A dictionary of property values (see below) to set for the synth on initialization.
- - - -
**/
/**###Gibberish.Flanger.input : property  
Object. The ugen that should feed the flagner.
**/
/**###Gibberish.Flanger.rate : property  
Number. The speed at which the delay line tap position is modulated.
**/
/**###Gibberish.Flanger.amount : property  
Number. The amount of time, in samples, that the delay line tap position varies by.
**/
/**###Gibberish.Flanger.feedback : property  
Number. The amount of output that should be fed back into the delay line
**/
/**###Gibberish.Flanger.offset : property  
Number. The base offset of the delay line tap from the current time. Large values (> 500) lead to chorusing effects.
**/

Gibberish.Flanger = function() {
	var buffers =	        [ new Float32Array(88200), new Float32Array(88200) ],
	    bufferLength =    88200,
	    delayModulation =	new Gibberish.Sine().callback,
	    interpolate =		  Gibberish.interpolate,
	    readIndex =			  -100,
	    writeIndex = 		  0,
	    phase =				    0;
      
	Gibberish.extend(this, {
    name:"flanger",
  	properties:{ input:0, rate:.25, amount:125, feedback:0, offset:125 },
    
  	callback : function(sample, delayModulationRate, delayModulationAmount, feedback, offset, channels) {
      var channels = typeof sample === 'number' ? 1 : 2;
      
  		var delayIndex = readIndex + delayModulation( delayModulationRate, delayModulationAmount * .95 );

  		if(delayIndex > bufferLength) {
  			delayIndex -= bufferLength;
  		}else if(delayIndex < 0) {
  			delayIndex += bufferLength;
  		}
					
			var delayedSample = interpolate(buffers[0], delayIndex);
			buffers[0][writeIndex] = channels === 1 ? sample + (delayedSample * feedback): sample[0] + (delayedSample * feedback);
				
      if(channels === 2) {
        sample[0] += delayedSample;
        
  			delayedSample = interpolate(buffers[1], delayIndex);
  			buffers[1][writeIndex] = sample[1] + (delayedSample * feedback);
        
        sample[1] += delayedSample;
      }else{
        sample += delayedSample;
      }
			
  		if(++writeIndex >= bufferLength) writeIndex = 0;
  		if(++readIndex  >= bufferLength) readIndex  = 0;

  		return sample;
  	},	
  })
  .init()
  .processProperties(arguments);

	readIndex = this.offset * -1;
};
Gibberish.Flanger.prototype = Gibberish._effect;

/**#Gibberish.Vibrato - FX
Delay line vibrato effect.

## Example Usage##
`a = new Gibberish.Synth({ attack:44, decay:44100 });  
b = new Gibberish.Vibrato({input:a, rate:4, amount:125 }).connect();  
a.note(440);  
a.rate = .5;
a.note(440);
`  
## Constructor   
**param** *properties*: Object. A dictionary of property values (see below) to set for the synth on initialization.
- - - -
**/
/**###Gibberish.Vibrato.input : property  
Object. The ugen that should feed the vibrato.
**/
/**###Gibberish.Vibrato.rate : property  
Number. The speed at which the delay line tap position is modulated.
**/
/**###Gibberish.Vibrato.amount : property  
Number. The size of the delay line modulation; effectively the amount of vibrato to produce, 
**/
/**###Gibberish.Vibrato.offset : property  
Number. The base offset of the delay line tap from the current time.
**/
Gibberish.Vibrato = function() {
	var buffers =	        [ new Float32Array(88200), new Float32Array(88200) ],
	    bufferLength =    88200,
	    delayModulation =	new Gibberish.Sine().callback,
	    interpolate =		  Gibberish.interpolate,
	    readIndex =			  -100,
	    writeIndex = 		  0,
	    phase =				    0;
      
	Gibberish.extend(this, {
    name:"vibrato",
  	properties:{ input:0, rate:5, amount:.5, offset:125 },
    
  	callback : function(sample, delayModulationRate, delayModulationAmount, offset) {
      var channels = typeof sample === 'number' ? 1 : 2;
      
  		var delayIndex = readIndex + delayModulation( delayModulationRate, delayModulationAmount * offset - 1 );

  		if(delayIndex > bufferLength) {
  			delayIndex -= bufferLength;
  		}else if(delayIndex < 0) {
  			delayIndex += bufferLength;
  		}
					
			var delayedSample = interpolate(buffers[0], delayIndex);
			buffers[0][writeIndex] = channels === 1 ? sample : sample[0];
				
      if(channels === 2) {
        sample[0] = delayedSample;
        
  			delayedSample = interpolate(buffers[1], delayIndex);
  			buffers[1][writeIndex] = sample[1];
        
        sample[1] = delayedSample;
      }else{
        sample = delayedSample;
      }
			
  		if(++writeIndex >= bufferLength) writeIndex = 0;
  		if(++readIndex  >= bufferLength) readIndex  = 0;

  		return sample;
  	},	
  })
  .init()
  .processProperties(arguments);

	readIndex = this.offset * -1;
};
Gibberish.Vibrato.prototype = Gibberish._effect;

/**#Gibberish.BufferShuffler - FX
A buffer shuffling / stuttering effect with reversing and pitch-shifting

## Example Usage##
`a = new Gibberish.Synth({ attack:88200, decay:88200 });  
b = new Gibberish.BufferShuffler({input:a, chance:.25, amount:125, rate:44100, pitchMin:-4, pitchMax:4 }).connect();  
a.note(440);
`  
##Constructor##
**param** *properties* : Object. A dictionary of property keys and values to assign to the Gibberish.BufferShuffler object
- - - - 
**/
/**###Gibberish.BufferShuffler.chance : property
Float. Range 0..1. Default .25. The likelihood that incoming audio will be shuffled.
**/
/**###Gibberish.BufferShuffler.rate : property
Integer, in samples. Default 11025. How often Gibberish.BufferShuffler will randomly decide whether or not to shuffle.
**/
/**###Gibberish.BufferShuffler.length : property
Integer, in samples. Default 22050. The length of time to play stuttered audio when stuttering occurs.
**/
/**###Gibberish.BufferShuffler.reverseChance : property
Float. Range 0..1. Default .5. The likelihood that stuttered audio will be reversed
**/
/**###Gibberish.BufferShuffler.pitchChance : property
Float. Range 0..1. Default .5. The likelihood that stuttered audio will be repitched.
**/
/**###Gibberish.BufferShuffler.pitchMin : property
Float. Range 0..1. Default .25. The lowest playback speed used to repitch the audio
**/
/**###Gibberish.BufferShuffler.pitchMax : property
Float. Range 0..1. Default 2. The highest playback speed used to repitch the audio.
**/
/**###Gibberish.BufferShuffler.wet : property
Float. Range 0..1. Default 1. When shuffling, the amplitude of the wet signal
**/
/**###Gibberish.BufferShuffler.dry : property
Float. Range 0..1. Default 0. When shuffling, the amplitude of the dry signal
**/

Gibberish.BufferShuffler = function() {
	var buffers = [ new Float32Array(88200), new Float32Array(88200) ],
    	bufferLength = 88200,  
  		readIndex = 0,
  		writeIndex = 0,
  		randomizeCheckIndex = 0,
  		shuffleTimeKeeper = 0,
  		isShuffling = 0,
  		random = Math.random,
  		fadeIndex = 0,
  		fadeAmount = 1,
  		isFadingWetIn = false,
  		isFadingDryIn = false,
  		reversed = false,
  		interpolate = Gibberish.interpolate,
  		pitchShifting = false,
  		speed = 1,
  		isBufferFull = false,
      rndf = Gibberish.rndf,
      _output = [0,0];
	
	Gibberish.extend(this, {
    name:"buffer_shuffler",
	
  	properties: { input:0, chance:.25, rate:11025, length:22050, reverseChange:.5, pitchChance:.5, pitchMin:.25, pitchMax:2, wet:1, dry:0 },

  	callback : function(sample, chance, rate, length, reverseChance, pitchChance, pitchMin, pitchMax, wet, dry) {
      var channels = typeof sample === 'number' ? 1 : 2;
      
  		if(!isShuffling) {
        buffers[0][writeIndex] = channels === 1 ? sample : sample[0];
        buffers[1][writeIndex] = channels === 1 ? sample : sample[1]; // won't be used but with one handle but probably cheaper than an if statement?
                
  			writeIndex++
  			writeIndex %= bufferLength;

  			isBufferFull = writeIndex === 0 ? 1 : isBufferFull; // don't output buffered audio until a buffer is full... otherwise you just get a gap
						
  			randomizeCheckIndex++;

  			if(randomizeCheckIndex % rate == 0 && random() < chance) {
  				reversed = random() < reverseChance;
  				isShuffling = true;
  				if(!reversed) {
  					readIndex = writeIndex - length;
  					if(readIndex < 0) readIndex = bufferLength + readIndex;
  				}
  				pitchShifting = random() < pitchChance;
  				if(pitchShifting) {
  					speed = rndf(pitchMin, pitchMax);
  				}
  				fadeAmount = 1;
  				isFadingWetIn = true;
  				isFadingDryIn = false;
  			}
  		}else if(++shuffleTimeKeeper % (length - 400) === 0) {
  			isFadingWetIn = false;
  			isFadingDryIn = true;
  			fadeAmount = 1;
  			shuffleTimeKeeper = 0;
  		}
					
  		readIndex += reversed ? speed * -1 : speed;
  		if(readIndex < 0) {
  			readIndex += bufferLength;
  		}else if( readIndex >= bufferLength ) {
  			readIndex -= bufferLength;
  		}	
  		var outSampleL = interpolate(buffers[0], readIndex);
			
      var outL, outR, shuffle, outSampleR;			
			if(isFadingWetIn) {						
				fadeAmount -= .0025;
        
        shuffle = (outSampleL * (1 - fadeAmount));
				outL = channels === 1 ? shuffle + (sample * fadeAmount) : shuffle + (sample[0] * fadeAmount);
        
        if(channels === 2) {
          outSampleR = interpolate(buffers[1], readIndex);
          shuffle = (outSampleR * (1 - fadeAmount));
          outR = channels === 1 ? outL : shuffle + (sample[1] * fadeAmount);
        }

				if(fadeAmount <= .0025) isFadingWetIn = false;
			}else if(isFadingDryIn) {						
				fadeAmount -= .0025;
        
        shuffle = outSampleL * fadeAmount;
				outL = channels === 1 ? shuffle + (sample * fadeAmount) : shuffle + (sample[0] * (1 - fadeAmount));
        
        if(channels === 2) {
          outSampleR = interpolate(buffers[1], readIndex);
          shuffle = outSampleR * fadeAmount;
          outR = shuffle + (sample[1] * (1 - fadeAmount));
        }
        
				if(fadeAmount <= .0025) { 
					isFadingDryIn = false;
					isShuffling = false;
					reversed = false;
					speed = 1;
					pitchShifting = 0;
				}
			}else{
        if(channels === 1) {
          outL = isShuffling && isBufferFull ? (outSampleL * wet) + sample * dry : sample;
        }else{
          outSampleR = interpolate(buffers[1], readIndex);
          outL = isShuffling && isBufferFull ? (outSampleL * wet) + sample[0] * dry : sample[0];
          outR = isShuffling && isBufferFull ? (outSampleR * wet) + sample[1] * dry : sample[1];          
        }
			}
      _output = [outL, outR];
  		return channels === 1 ? outL : _output;
  	},
  })
  .init()
  .processProperties(arguments);
};
Gibberish.BufferShuffler.prototype = Gibberish._effect;

Gibberish.AllPass = function(time, feedback) {
	var index  = -1,
    	buffer =	new Float32Array(time || 500),
      bufferLength = buffer.length;
  
  Gibberish.extend(this, {
		name:		"allpass",
    properties: {
      input   : 0,
    },
    callback : function(sample) {
  		index = ++index % bufferLength;
  		var bufferSample = buffer[index];
  		var out = -1 * sample + bufferSample;

  		buffer[index] = sample + (bufferSample * .5);
  		return out;
  	},
	});
  
};
/*
adapted from audioLib.js, in turn adapted from Freeverb source code
this is actually a lowpass-feedback-comb filter (https://ccrma.stanford.edu/~jos/pasp/Lowpass_Feedback_Comb_Filter.html)
*/
Gibberish.Comb = function(time) {
	var buffer = new Float32Array(time || 1200),
    	bufferLength = buffer.length,
    	index = 0,
    	store = 0;
      
	Gibberish.extend(this, {
		name:		"comb",
    properties : {
      input : 0,
  		time:		time || 1200,
    },
    
  	callback: function(sample) {
  		var currentPos = ++index % bufferLength;
			var out = buffer[currentPos];
						
			store = (out * .8) + (store * .2);
						
			buffer[currentPos] = sample + (store * .84);

  		return out;
  	},
	});
  
};

/**#Gibberish.Reverb - FX
based off audiolib.js reverb and freeverb
 
## Example Usage##
`a = new Gibberish.Synth({ attack:88200, decay:88200 });  
b = new Gibberish.Reverb({input:a, roomSize:.5, wet:1, dry;.25}).connect();
a.note(440);
`  
##Constructor
**param** *properties* : Object. A dictionary of property keys and values to assign to the Gibberish.BufferShuffler object
**/
/**###Gibberish.Reverb.roomSize : property
Float. 0..1. The size of the room being emulated.
**/	
/**###Gibberish.Reverb.damping : property
Float. Attenuation of high frequencies that occurs.
**/	
/**###Gibberish.Reverb.wet : property
Float. Default = .75. The amount of processed signal that is output.  
**/	
/**###Gibberish.Reverb.dry : property
Float. Default = .5. The amount of dry signal that is output
**/	

Gibberish.Reverb = function() {
  var tuning =	{
		    combCount: 		8,
		    combTuning: 	[1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617],

		    allPassCount: 	4,
		    allPassTuning: 	[556, 441, 341, 225],
		    allPassFeedback:0.5,

		    fixedGain: 		0.015,
		    scaleDamping: 	0.9,

		    scaleRoom: 		0.28,
		    offsetRoom: 	0.7,

		    stereoSpread: 	23
		},
    combs = [],
    apfs  = [],
    output   = [0,0],
    phase  = 0;
    
	Gibberish.extend(this, {
		name:		"Reverb",
    
		roomSize:	.5,
		damping:	.2223,
    
    properties: {
      input:    0,
  		wet:		  .5,
  		dry:		  .55,
    },
    
    callback : function(sample, wet, dry) {
      var channels = typeof sample === 'object' ? 2 : 1;
      
			var input = channels === 1 ? sample : sample[0] + sample[1]; // converted to fake stereo

			var _out = input * .015;
      var out = _out;
						
			for(var i = 0; i < 8; i++) {
				var filt = combs[i](_out);
				out += filt;				
			}
							
			for(var i = 0; i < 4; i++) {
				out = apfs[i](out);	
			}
      
      output[0] = output[1] = (input * dry) + (out * wet);

  		return output;
  	},
	})  
  .init()
  .processProperties(arguments);
    
	for(var i = 0; i < 8; i++){
		combs.push( new Gibberish.Comb(tuning.combTuning[i], this.roomSize * tuning.scaleRoom * tuning.offsetRoom, this.damping ).callback );
	}
  
	for(var i = 0; i < 4; i++){
		apfs.push( new Gibberish.AllPass(tuning.allPassTuning[i], tuning.allPassFeedback ).callback );
	}

};
Gibberish.Reverb.prototype = Gibberish._effect;

/**#Gibberish.Granulator - FX
A granulator that operates on a buffer of samples. You can get the samples from a [Sampler](javascript:displayDocs('Gibberish.Sampler'\))
object.

## Example Usage ##
`a = new Gibberish.Sampler('resources/trumpet.wav');  
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
};`
## Constructor
**param** *propertiesList*: Object. At a minimum you should define the input to granulate. See the example.
**/
/**###Gibberish.Granulator.speed : property
Float. The playback rate, in samples, of each grain
**/
/**###Gibberish.Granulator.speedMin : property
Float. When set, the playback rate will vary on a per grain basis from (grain.speed + grain.speedMin) -> (grain.speed + grain.speedMax). This value should almost always be negative.
**/
/**###Gibberish.Granulator.speedMax : property
Float. When set, the playback rate will vary on a per grain basis from (grain.speed + grain.speedMin) -> (grain.speed + grain.speedMax).
**/
/**###Gibberish.Granulator.grainSize : property
Integer. The length, in samples, of each grain
**/
/**###Gibberish.Granulator.position : property
Float. The center position of the grain cloud. 0 represents the start of the buffer, 1 represents the end.
**/
/**###Gibberish.Granulator.positionMin : property
Float. The left boundary on the time axis of the grain cloud.
**/
/**###Gibberish.Granulator.positionMax : property
Float. The right boundary on the time axis of the grain cloud.
**/
/**###Gibberish.Granulator.buffer : property
Object. The input buffer to granulate.
**/
/**###Gibberish.Granulator.numberOfGrains : property
Float. The number of grains in the cloud. Can currently only be set on initialization.
**/

Gibberish.Granulator = function(properties) {
	var grains      = [];
	    buffer      = null,
	    interpolate = Gibberish.interpolate,
      panner      = Gibberish.makePanner(),
      bufferLength= 0,
	    debug       = 0,
	    write       = 0,
      self        = this,
      out         = [0,0],
      _out        = [0,0],
      rndf        = Gibberish.rndf,
      numberOfGrains = properties.numberOfGrains || 20;
      
	Gibberish.extend(this, { 
		name:		        "granulator",
		bufferLength:   88200,
		reverse:	      true,
		spread:		      .5,
    
    properties : {
      speed: 		    1,
      speedMin:     -0,
      speedMax: 	  .0,
      grainSize: 	  1000,
      position:	    .5,
      positionMin:  0,
      positionMax:  0,
      amp:		      .2,
      fade:		      .1,
      pan:		      0,
      shouldWrite:  false,
    },
    
    callback : function(speed, speedMin, speedMax, grainSize, positionMin, positionMax, position, amp, fade, pan, shouldWrite) {
    		for(var i = 0; i < numberOfGrains; i++) {
    			var grain = grains[i];
					
    			if(grain._speed > 0) {
    				if(grain.pos > grain.end) {
    					grain.pos = (position + rndf(positionMin, positionMax)) * buffer.length;
    					grain.start = grain.pos;
    					grain.end = grain.start + grainSize;
    					grain._speed = speed + rndf(speedMin, speedMax);
    					grain._speed = grain._speed < .1 ? .1 : grain._speed;
    					grain._speed = grain._speed < .1 && grain._speed > 0 ? .1 : grain._speed;							
    					grain._speed = grain._speed > -.1 && grain._speed < 0 ? -.1 : grain._speed;							
    					grain.fadeAmount = grain._speed * (fade * grainSize);
    					grain.pan = rndf(self.spread * -1, self.spread);
    				}
						
    				var _pos = grain.pos;
    				while(_pos > buffer.length) _pos -= buffer.length;
    				while(_pos < 0) _pos += buffer.length;
						
    				var _val = interpolate(buffer, _pos);
					
    				_val *= grain.pos < grain.fadeAmount + grain.start ? (grain.pos - grain.start) / grain.fadeAmount : 1;
    				_val *= grain.pos > (grain.end - grain.fadeAmount) ? (grain.end - grain.pos)   / grain.fadeAmount : 1;
						
    			}else {
    				if(grain.pos < grain.end) {
    					grain.pos = (position + rndf(positionMin, positionMax)) * buffer.length;
    					grain.start = grain.pos;
    					grain.end = grain.start - grainSize;
    					grain._speed = speed + rndf(speedMin, speedMax);
    					grain._speed = grain._speed < .1 && grain._speed > 0 ? .1 : grain._speed;							
    					grain._speed = grain._speed > -.1 && grain._speed < 0 ? -.1 : grain._speed;	
    					grain.fadeAmount = grain._speed * (fade * grainSize);							
    				}
						
    				var _pos = grain.pos;
    				while(_pos > buffer.length) _pos -= buffer.length;
    				while(_pos < 0) _pos += buffer.length;
					
    				var _val = interpolate(buffer, _pos);
					
    				_val *= grain.pos > grain.start - grain.fadeAmount ? (grain.start - grain.pos) / grain.fadeAmount : 1;
    				_val *= grain.pos < (grain.end + grain.fadeAmount) ? (grain.end - grain.pos) / grain.fadeAmount : 1;
    			}
					
    			_out = panner(_val * amp, grain.pan, _out);
          out[0] += _out[0];
          out[1] += _out[1];
    			
          grain.pos += grain._speed;
    		}
				
    		return panner(out, pan, out);
    	},
	})
  .init()
  .processProperties(arguments);
  
	for(var i = 0; i < numberOfGrains; i++) {
		grains[i] = {
			pos : self.position + Gibberish.rndf(self.positionMin, self.positionMax),
			_speed : self.speed + Gibberish.rndf(self.speedMin, self.speedMax),
		}
		grains[i].start = grains[i].pos;
		grains[i].end = grains[i].pos + self.grainSize;
		grains[i].fadeAmount = grains[i]._speed * (self.fade * self.grainSize);
		grains[i].pan = Gibberish.rndf(self.spread * -1, self.spread);
	}
			
	if(typeof properties.input !== "undefined") { 
			that.shouldWrite = true;
      
			that.sampler = new Gibberish.Sampler();
			that.sampler.connect();
			that.sampler.record(properties.buffer, that.bufferLength);
      
			that.buffer = that.sampler.buffer;
	}else if(typeof properties.buffer !== 'undefined') {
	  buffer = properties.buffer;
    bufferLength = buffer.length;
	}
};
Gibberish.Granulator.prototype = Gibberish._effect;