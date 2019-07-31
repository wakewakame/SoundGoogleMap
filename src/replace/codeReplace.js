import { RenderChange } from "./RenderChange.js";

window.renderChange = new RenderChange(60.0);

export const codeReplace = (responseText) => {
	// shaderSource関数をフックし、シェーダを書き換えられるように変更
	responseText = responseText.replace(/\.shaderSource\((\w+),\s*(\w+)\)/g, ".shaderSource($1,window.renderChange.shaderConverter($2))");
	responseText = responseText.replace(/\.shaderSource\((\w+),\s*("[^"]+")\)/g, ".shaderSource($1,window.renderChange.shaderConverter($2))");

	// 建物を3D表示するシェーダのうち、"uniform mat4 u;"が宣言させるケースはカメラの真下方向からの角度が45度以上の場合のみである。
	// 建物を3D表示するシェーダのすべてに"uniform mat4 u;"を宣言させるには、カメラの真下方向からの角度が45度未満の場合でもisVisible関数がtrueを返すように変更する必要がある。
	// 以下の変更は、isVisible関数がカメラの上下の角度に依存せずにtrueを返すようにするためのものである。
	responseText = responseText.replace(/if\s*\((\w+)\s*=\s*0\s*<\s*this\.\w+\.\w+\)\s*{/g, "if($1=true){");

	// 建物の3Dのレンダリングを行うタイミングで、最初と最後にレンダリングした時刻と経過フレーム数を記憶
	responseText = responseText.replace(
		/(for\s*\(var\s+\w+\s*=\s*\w+\.length,\s*\w+\s*=\s*0;\s*\w+\s*<\s*\w+;\s*\w+\+\+\)\s*{)/g,
		"window.renderChange.lastRenderTime=(new Date()).getTime();" +
		"if(window.renderChange.firstRenderTime===0)window.renderChange.firstRenderTime=window.renderChange.lastRenderTime;$1"
	);

	// GoogleMapはアニメーションや頂点の更新がない限りはレンダリングを行わない。
	// 任意のタイミングでレンダリングを行えるようにレンダリング関数のインスタンスをコピーする。
	// まずはレンダリングを行う関数の関数名を取得する。
	let renderFuncNameList = responseText.match(/render:\s*function\(\)\s*{\s*\w+\.\w+\s*\(\)\s*}/g);
	if (!renderFuncNameList || renderFuncNameList.length !== 1) return responseText;
	let renderFuncName = renderFuncNameList[0].replace(/render:\s*function\(\)\s*{\s*\w+\.(\w+)\s*\(\)\s*}/g, "$1");
	// 次に、無条件でフレームレートがwindow.originalStruct.fpsでレンダリングされるように変更する。
	responseText = responseText.replace(
		/(this\.\w+)\s*=\s*(new\s+_\.\w+\(\w+,void\s+0,\w+\.\w+\(\)\));/g,
		"$1=$2;" +
		"setInterval(" +
		"()=>{" +
			"if((new Date()).getTime()-window.renderChange.lastRenderTime>1000.0/window.renderChange.fps)$1." + renderFuncName + "();" +
		"},1000.0/window.renderChange.fps);"
	);

	// glコンテキストのラッパーを取得する関数名を取得する
	let getGlWrapperFuncNameList = responseText.match(
		/_\.\w+\s*=\s*function\(\w+\)\s*{\s*\w+.\w+\s*\|\|\s*_.\w+\(\w+\);\s*return\s*\w+.\w+\s*}/g
	);
	if (!getGlWrapperFuncNameList || getGlWrapperFuncNameList.length !== 1) return responseText;
	let getGlWrapperFuncName = getGlWrapperFuncNameList[0].replace(
		/(_\.\w+)\s*=\s*function\(\w+\)\s*{\s*\w+.\w+\s*\|\|\s*_.\w+\(\w+\);\s*return\s*\w+.\w+\s*}/g,
		"$1"
	);
	// glコンテキストのラッパー1を持っている変数名を取得する
	let glWrapperNameList = responseText.match(/\w+\.\w+\.\w+\.set\(\w+\+\+\);/g);
	if (!glWrapperNameList || glWrapperNameList.length !== 1) return responseText;
	let glWrapperName = glWrapperNameList[0].replace(/(\w+)\.\w+\.\w+\.set\(\w+\+\+\);/g, "$1");
	// glコンテキストを持っている変数名を取得する
	let glNameList = responseText.match(/\w+\.\w+\[\w+\]\s*=\s*\w+\.\w+\.getUniformLocation\(\w+\.\w+,\s*\w+\);/g);
	if (!glNameList || glNameList.length !== 1) return responseText;
	let glName = glNameList[0].replace(/\w+\.\w+\[\w+\]\s*=\s*\w+\.(\w+)\.getUniformLocation\(\w+\.\w+,\s*\w+\);/g, "$1");
	// 建物の3Dレンダリングに使用しているシェーダのプログラムの取得
	let shaderProgramName = glNameList[0].replace(/\w+\.\w+\[\w+\]\s*=\s*\w+\.\w+\.getUniformLocation\(\w+\.(\w+),\s*\w+\);/g, "$1");
	// GoogleMapのソースコード書き換え
	responseText = responseText.replace(
		///(\w+\s*&&\s*\w+\.enableVertexAttribArray\(\w+\);)/g,
		///(var\s+\w+\s*=\s*\w+\.\w+\(\)\s*,\s*\w+\s*=\s*\w+\.\w+\.\w+\.\w+\(\)\s*,\s*\w+\s*=\s*\w+\.\w+\.\w+\.\w+\(\)\s*,\s*\w+\s*=\s*\w+\.\w+\.\w+\.\w+\(\)\s*,\s*\w+\s*=\s*\w+\.\w+\.\w+\.\w+\(\);)/g,
		/([\w$]+\.[\w$]+\.isVisible\(\)\s*&&\s*\([\w$]+\s*=\s*[\w$]+\([\w$]+\.[\w$]+,\s*[\w$]+,\s*[\w$]+\),)/g,
		"window.renderChange.setUniform(" + 
		getGlWrapperFuncName + "(" + glWrapperName + ")." + glName + "," + 
		getGlWrapperFuncName + "(" + glWrapperName + ")." + shaderProgramName + 
		");$1"
	);

	// モデル行列を渡している部分を発見し、モデル行列の逆行列も渡すようにする
	responseText = responseText.replace(
		/(\w+)\.uniformMatrix4fv\((\w+),\s*!1,\s*(\w+)\)\s*\),/g,
		"$1.uniformMatrix4fv($2,!1,$3)," +
		"window.renderChange.setInvertUniform($3)),"
	);

	// GoogleMapが登録できる最大のテクスチャ枚数を1枚減らす(このプログラムがテクスチャを1枚登録できるように)
	responseText = responseText.replace(
		/Math\.min\(32,\s*(\w+)\.getParameter\(35661\)\);/g,
		"Math.min(32,$1.getParameter(35661)-1);"
	);
	
	return responseText;
};