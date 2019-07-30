import { beforeShaderList, afterShaderList } from "./shader.js";
import { FftTextureGenerator } from "../fft/fft.js";

export const RenderChange = class {
	constructor(fps) {
		this.fps = fps;  // フレームレート

		this.firstRenderTime = 0;  // 最初にレンダリングした時刻を記憶
		this.lastRenderTime = 0;  // 最後にレンダリングした時刻を記憶

		this.glContext = null;  // GoogleMapのwebglコンテキスト
		this.shaderProgram = null; // 建物の3Dレンダリングに使用するシェーダプログラム

		// shaderConverterdeで追加したuniform変数のLocation
		this.uniformLocation = {
			time: null,
			orgTexture: null
		};

		this.fftTextureGenerator = null;
	}

	// GoogleMapの全てのシェーダが渡される。
	// 必要に応じてこの関数で書き換え、シェーダを返す。
	shaderConverter(source) {
		// 引数に渡されたシェーダのソースコードを読み、beforeShaderListに存在するソースコードと一致するか確認する。
		// 一致した場合はbeforeShaderListに対応したafterShaderListのソースコードの文字列を返す
		for(let i in beforeShaderList) {
			if (source.indexOf(beforeShaderList[i]) !== -1) {
				if (i in afterShaderList) {
					source = source.replace(beforeShaderList[i], "");
					source += afterShaderList[i];
				}
				return source;
			}
		}
		return source;
	}

	// GoogleMapに描画の再要求がされるタイミングで呼び出される
	update() {
		if (this.fftTextureGenerator)
			this.fftTextureGenerator.update();
	}

	// GoogleMapの3Dの建物の描画中で、drawElementが始まる前に呼び出される。
	setUniform(glContext, shaderProgram) {
		// コンテキストが変更された場合
		if (this.glContext !== glContext) {
			// コンテキストを更新
			this.glContext = glContext;
			// ------------------------------------------
			this.fftTextureGenerator =
				new FftTextureGenerator(glContext);
			// ------------------------------------------
		}
		// シェーダが変更された場合
		if (this.shaderProgram !== shaderProgram) {
			// シェーダを更新
			this.shaderProgram = shaderProgram;
			// Locationを更新
			this.uniformLocation.time = this.glContext.getUniformLocation(shaderProgram, "time");
			this.uniformLocation.orgTexture = this.glContext.getUniformLocation(shaderProgram, "orgTexture");
		}
		// シェーダに経過時間(秒)を送信
		this.glContext.uniform1f(
			this.uniformLocation.time,
			(this.lastRenderTime - this.firstRenderTime) / 1000.0
		);

		// ------------------------------------------
		// シェーダにテクスチャを送信
		const textureUnit = 12;  // textureのunit番号
		this.glContext.activeTexture(this.glContext["TEXTURE" + String(textureUnit)]);
		this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.fftTextureGenerator.fftResultFrame.texture.texture_buffer);
		this.glContext.uniform1i(this.uniformLocation.orgTexture, textureUnit);
		// ------------------------------------------
	};
};