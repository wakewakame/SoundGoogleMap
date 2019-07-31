import { codeReplace } from "./replace/codeReplace.js";

_.yva = function(XHRWrapper) {
	// jsのテキスト取得
	let responseText = XHRWrapper.H ? XHRWrapper.H.responseText : "";

	// jsテキストを改変したものを返す
	return codeReplace(responseText);
};

import { FftTextureGenerator } from "./fft/fft.js";
window.FftTextureGenerator = FftTextureGenerator;