let start = false;

export const getAudio = (loopCallback, wavlen = 1024) => {
	document.addEventListener("click", (event) => {
		if (start) return;
		start = true;
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		let audio_context = new AudioContext();

		let scriptProcessor = audio_context.createScriptProcessor(wavlen, 1, 1);
		scriptProcessor.onaudioprocess = loopCallback;
		scriptProcessor.connect(audio_context.destination);

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.getUserMedia(
			{ audio: true }, (stream) => {
				let mediastreamsource = audio_context.createMediaStreamSource(stream);
				mediastreamsource.connect(scriptProcessor);
			}, (e) => { console.log(e); }
		);
	});
};