/**#Gibberish.Bus - Miscellaneous
Create a mono routing bus. A bus callback routes all it's inputs and scales them by the amplitude of the bus.  
  
For a stereo routing bus, see [Bus2](javascript:displayDocs('Gibberish.Bus2'\))

##Example Usage##    
`a = new Gibberish.Bus();  
b = new Gibberish.Sine(440).connect(a);  
c = new Gibberish.Sine(880).connect(a);  
a.amp = .1;  
a.connect();`
  
## Constructor     
**param** *properties*: Object. A dictionary of property values (see below) to set for the bus on initialization.
**/
/**###Gibberish.Bus.amp : property  
Array. Read-only. Relative volume for the sum of all ugens connected to the bus.
**/
Gibberish.bus = function(){
  this.type = 'bus';
  
  this.inputCodegen = function() {
    var val = this.value.codegen();
    var str = this.amp === 1 ? val : val + ' * ' + this.amp;
    this.codeblock = str;
    return str;
  };

  this.addConnection = function() {
    var arg = { 
      value:	      arguments[0], 
      amp:		      arguments[1], 
      codegen:      this.inputCodegen,
    };
    arg.getCodeblock = arg.value.getCodeblock.bind( arg.value );
    
    this.inputs.push( arg );

    Gibberish.dirty( this );
  };
  
  this.removeConnection = function(ugen) {
    for(var i = 0; i < this.inputs.length; i++) {
      if(this.inputs[i].value === ugen) {
        this.inputs.splice(i,1);
        Gibberish.dirty(this);
        break;
      }
    }
  };
  
  this.adjustSendAmount = function(ugen, amp) {
    for(var i = 0; i < this.inputs.length; i++) {
      if(this.inputs[i].value === ugen) {
        this.inputs[i].amp = amp;
        Gibberish.dirty(this);
        break;
      }
    }
  };
  
  this.callback = function() {
    var amp = arguments[arguments.length - 2]; // use arguments to accommodate arbitray number of inputs without using array
    var pan = arguments[arguments.length - 1];
    
    output[0] = output[1] = 0;
    
    for(var i = 0; i < arguments.length - 2; i++) {
      var isObject = typeof arguments[i] === 'object';
      output[0] += isObject ? arguments[i][0] : arguments[i];
      output[1] += isObject ? arguments[i][1] : arguments[i];
    }
    
    output[0] *= amp;
    output[1] *= amp;
    return panner(output, pan, output);
  };
};
Gibberish.bus.prototype = new Gibberish.ugen();
Gibberish._bus = new Gibberish.bus();

Gibberish.Bus = function() {  
  Gibberish.extend(this, {
    name : 'bus',
        
    properties : {
      inputs :  [],
      amp :     arguments[1] || 1,
    },

    callback : function() {
      var out = 0;
      var length = arguments.length - 1;
      var amp = arguments[length]; // use arguments to accommodate arbitray number of inputs without using array
      
      for(var i = 0; i < length; i++) {
        out += arguments[i];
      }
      out *= amp;
      
      return out;
    },
  });

  this.init();
  
  return this;
};
Gibberish.Bus.prototype = Gibberish._bus;

/**#Gibberish.Bus2 - Miscellaneous
Create a stereo outing bus. A bus callback routes all it's inputs and scales them by the amplitude of the bus.

##Example Usage##    
`a = new Gibberish.Bus2();  
b = new Gibberish.Sine(440).connect(a);  
c = new Gibberish.Sine(880).connect(a);  
  
d = new Gibberish.Sequencer({ target:a, key:'pan', values:[-.75,.75], durations:[ 22050 ] }).start();
a.connect();`
  
## Constructor     
**param** *properties*: Object. A dictionary of property values (see below) to set for the bus on initialization.
**/
/**###Gibberish.Bus.amp : property  
Array. Read-only. Relative volume for the sum of all ugens connected to the bus.
**/
Gibberish.Bus2 = function() {
  this.name = "bus2";
  this.type = 'bus';
  
  this.properties = {
    inputs :  [],
    amp :     arguments[1] || 1,
    pan :     0,
  };
  
  var output = [0,0],
      panner = Gibberish.makePanner();
  
  this.callback = function() {    
    var amp = arguments[arguments.length - 2]; // use arguments to accommodate arbitray number of inputs without using array
    var pan = arguments[arguments .length - 1];
    
    output[0] = output[1] = 0;
    
    for(var i = 0; i < arguments.length - 2; i++) {
      var isObject = typeof arguments[i] === 'object';
      output[0] += isObject ? arguments[i][0] : arguments[i];
      output[1] += isObject ? arguments[i][1] : arguments[i];
    }
    
    output[0] *= amp;
    output[1] *= amp;
    return panner(output, pan, output);
  };
  
  this.initialized = false;
  this.init();
};
Gibberish.Bus2.prototype = Gibberish._bus;