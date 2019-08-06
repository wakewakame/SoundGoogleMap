import { codeReplace } from "./replace/codeReplace.js";

for(let i in window._)
{
	if (
		(typeof(window._[i]) === "function") &&
		(window._[i].toString().search(/responseText/g) !== -1) &&
		(window._[i].toString().search(/return/g) !== -1)
	)
	{
		let funcName = window._[i].toString().match(/\.[\w$]+\s*\?/g, "$1")[0].replace(/\.([\w$])+\?/g, "$1");
		window._[i] = function(XHRWrapper) {
			// jsのテキスト取得
			let responseText = XHRWrapper[funcName] ? XHRWrapper[funcName].responseText : "";

			// jsテキストを改変したものを返す
			return codeReplace(responseText);
		};
	}
}