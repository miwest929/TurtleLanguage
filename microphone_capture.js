function MicrophoneCapture() {
  // Constants
  this.RecordingEnum = {"RECORDING": 0, "NOT_RECORDING": 1};
  Object.freeze(this.RecordingEnum);

  this.recordingBuffer = null;
  this.currentRecordingBuffer = [];
  this.recordingState = this.RecordingEnum.NOT_RECORDING;

  this.audioContext = new window.AudioContext();

  // Create an analyser
  this.analyser = this.audioContext.createAnalyser();
  this.analyser.minDecibels = -80;
  this.analyser.maxDecibels = -10;
  this.analyser.smoothingTimeConstant = 0;
  this.analyser.fftSize = 1024;

  // Create the ScriptNode
  this.scriptNode = this.audioContext.createScriptProcessor(this.analyser.fftSize, 1, 1);

  var _this = this;
  this.scriptNode.onaudioprocess = function(audioProcessingEvent) {
    // If not recording then don't do anything
    if (_this.recordingState === _this.RecordingEnum.NOT_RECORDING) {
      return;
    }

    var dataArray = new Uint8Array(_this.analyser.fftSize);
    _this.analyser.getByteFrequencyData(dataArray);

    // Get the audio data. For simplicity just take one channel
    var inputBuffer = audioProcessingEvent.inputBuffer;
    var leftChannel = inputBuffer.getChannelData(0);

    Array.prototype.push.apply(_this.currentRecordingBuffer, leftChannel);
  }

}

MicrophoneCapture.prototype.getLastRecording = function() {
  return this.recordingBuffer;
}

MicrophoneCapture.prototype.openMic = function() {
  var _this = this;
  var constraints = {"audio": true};

  var successCallback = function(stream) {
    _this.stream = stream;
    _this.source = _this.audioContext.createMediaStreamSource(stream);

    _this.source.connect(_this.analyser);
    _this.analyser.connect(_this.scriptNode);

    // This is needed for chrome
    _this.scriptNode.connect(_this.audioContext.destination);
  };

  var errorCallback = function(error) {
    console.error('navigator.getUserMedia error: ', error);
  };

  navigator.getUserMedia(constraints, successCallback, errorCallback);
}

MicrophoneCapture.prototype.startRecording = function() {
  this.resetBuffers();
  this.recordingState = this.RecordingEnum.RECORDING;
}

MicrophoneCapture.prototype.stopRecording = function() {
  if (this.recordingState ===  this.RecordingEnum.RECORDING) {
    this.recordingBuffer = this.currentRecordingBuffer.slice(0);
  }

  this.recordingState = this.RecordingEnum.NOT_RECORDING;
}

MicrophoneCapture.prototype.playRecording = function() {
  this.playBufferRecording(this.recordingBuffer);
}

MicrophoneCapture.prototype.playBufferRecording = function(playBuffer) {
   var channels = 1;
    var frameCount = playBuffer.length;
    var myArrayBuffer = this.audioContext.createBuffer(channels, frameCount, this.audioContext.sampleRate);

    for (var channel = 0; channel < channels; channel++) {
        var nowBuffering = myArrayBuffer.getChannelData(channel);
        for (var i = 0; i < frameCount; i++) {
            nowBuffering[i] = playBuffer[i];
        }
    }

    var playSource = this.audioContext.createBufferSource();
    playSource.buffer = myArrayBuffer;
    playSource.connect(this.audioContext.destination);
    playSource.start();
}

MicrophoneCapture.prototype.resetBuffers = function() {
  this.currentRecordingBuffer = [];
}
