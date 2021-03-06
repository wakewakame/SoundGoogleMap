import { shaderList } from "./shader.js";
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
			orgTexture: null,
			uInvert: null,

			lot_lat_len_h: null,
			scale: null,
			marking: null,
		};

		this.lot_lat_len_m_s_h = [35.74795, 139.806010, 0.001, 0, 0.00002, 1.000004];

		this.fftTextureGenerator = null;
		this.MAX_COMBINED_TEXTURE_IMAGE_UNITS = null;
	}

	// GoogleMapの全てのシェーダのソースコードが渡される。
	// 建物の3D描画に使用しているシェーダのソースコードのみを書き換える。
	shaderConverter(source) {
		if (source.indexOf("float sa=t[int(floor(F.w*255.+.5))];") !== -1) {
			source = source.match(/#define\s+[\w_$]+\s+[\w]+/g).join("\n");
			source += shaderList["vertex"];
		}
		if (source.indexOf("uniform sampler2D W;") !== -1) {
			source = source.match(/#define\s+[\w_$]+\s+[\w]+/g).join("\n");
			source += shaderList["fragment"];
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
			this.MAX_COMBINED_TEXTURE_IMAGE_UNITS = this.glContext.getParameter(this.glContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
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
			this.uniformLocation.time = this.glContext.getUniformLocation(this.shaderProgram, "time");
			this.uniformLocation.orgTexture = this.glContext.getUniformLocation(this.shaderProgram, "orgTexture");
			this.uniformLocation.uInvert = this.glContext.getUniformLocation(this.shaderProgram, "uInvert");

			this.uniformLocation.lot_lat_len_h = this.glContext.getUniformLocation(this.shaderProgram, "lot_lat_len_h");
			this.uniformLocation.scale = this.glContext.getUniformLocation(this.shaderProgram, "scale");
			this.uniformLocation.marking = this.glContext.getUniformLocation(this.shaderProgram, "marking");
		}

		// シェーダに経過時間(秒)を送信
		this.glContext.uniform1f(
			this.uniformLocation.time,
			(this.lastRenderTime - this.firstRenderTime) / 1000.0
		);

		this.glContext.uniform4f(this.uniformLocation.lot_lat_len_h, this.lot_lat_len_m_s_h[0], this.lot_lat_len_m_s_h[1], this.lot_lat_len_m_s_h[2], this.lot_lat_len_m_s_h[5]);
		this.glContext.uniform1f(this.uniformLocation.scale, this.lot_lat_len_m_s_h[4]);
		this.glContext.uniform1i(this.uniformLocation.marking, this.lot_lat_len_m_s_h[3]);

		// ------------------------------------------
		// FFTの実行
		this.update();

		// シェーダにテクスチャを送信
		const textureUnit = Math.min(32 - 1,this.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1);  // textureのunit番号
		this.glContext.activeTexture(this.glContext["TEXTURE" + String(textureUnit)]);
		this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.fftTextureGenerator.fftResultFrame.texture.texture_buffer);
		this.glContext.uniform1i(this.uniformLocation.orgTexture, textureUnit);
		// ------------------------------------------
	};

	// モデル行列の逆行列を計算し、シェーダに送る
	setInvertUniform(matrix) {
		this.glContext.uniformMatrix4fv(
			this.uniformLocation.uInvert, false, this.getInvert(matrix)
		);
	};

	// 逆行列を計算する関数
	getInvert(m) {
		let inv = new Float32Array(16);
		inv[0] = m[5]  * m[10] * m[15] - 
				 m[5]  * m[11] * m[14] - 
				 m[9]  * m[6]  * m[15] + 
				 m[9]  * m[7]  * m[14] +
				 m[13] * m[6]  * m[11] - 
				 m[13] * m[7]  * m[10];
		inv[4] = -m[4]  * m[10] * m[15] + 
				  m[4]  * m[11] * m[14] + 
				  m[8]  * m[6]  * m[15] - 
				  m[8]  * m[7]  * m[14] - 
				  m[12] * m[6]  * m[11] + 
				  m[12] * m[7]  * m[10];
		inv[8] = m[4]  * m[9] * m[15] - 
				 m[4]  * m[11] * m[13] - 
				 m[8]  * m[5] * m[15] + 
				 m[8]  * m[7] * m[13] + 
				 m[12] * m[5] * m[11] - 
				 m[12] * m[7] * m[9];
		inv[12] = -m[4]  * m[9] * m[14] + 
				   m[4]  * m[10] * m[13] +
				   m[8]  * m[5] * m[14] - 
				   m[8]  * m[6] * m[13] - 
				   m[12] * m[5] * m[10] + 
				   m[12] * m[6] * m[9];
		inv[1] = -m[1]  * m[10] * m[15] + 
				  m[1]  * m[11] * m[14] + 
				  m[9]  * m[2] * m[15] - 
				  m[9]  * m[3] * m[14] - 
				  m[13] * m[2] * m[11] + 
				  m[13] * m[3] * m[10];
		inv[5] = m[0]  * m[10] * m[15] - 
				 m[0]  * m[11] * m[14] - 
				 m[8]  * m[2] * m[15] + 
				 m[8]  * m[3] * m[14] + 
				 m[12] * m[2] * m[11] - 
				 m[12] * m[3] * m[10];
		inv[9] = -m[0]  * m[9] * m[15] + 
				  m[0]  * m[11] * m[13] + 
				  m[8]  * m[1] * m[15] - 
				  m[8]  * m[3] * m[13] - 
				  m[12] * m[1] * m[11] + 
				  m[12] * m[3] * m[9];
		inv[13] = m[0]  * m[9] * m[14] - 
				  m[0]  * m[10] * m[13] - 
				  m[8]  * m[1] * m[14] + 
				  m[8]  * m[2] * m[13] + 
				  m[12] * m[1] * m[10] - 
				  m[12] * m[2] * m[9];
		inv[2] = m[1]  * m[6] * m[15] - 
				 m[1]  * m[7] * m[14] - 
				 m[5]  * m[2] * m[15] + 
				 m[5]  * m[3] * m[14] + 
				 m[13] * m[2] * m[7] - 
				 m[13] * m[3] * m[6];
		inv[6] = -m[0]  * m[6] * m[15] + 
				  m[0]  * m[7] * m[14] + 
				  m[4]  * m[2] * m[15] - 
				  m[4]  * m[3] * m[14] - 
				  m[12] * m[2] * m[7] + 
				  m[12] * m[3] * m[6];
		inv[10] = m[0]  * m[5] * m[15] - 
				  m[0]  * m[7] * m[13] - 
				  m[4]  * m[1] * m[15] + 
				  m[4]  * m[3] * m[13] + 
				  m[12] * m[1] * m[7] - 
				  m[12] * m[3] * m[5];
		inv[14] = -m[0]  * m[5] * m[14] + 
				   m[0]  * m[6] * m[13] + 
				   m[4]  * m[1] * m[14] - 
				   m[4]  * m[2] * m[13] - 
				   m[12] * m[1] * m[6] + 
				   m[12] * m[2] * m[5];
		inv[3] = -m[1] * m[6] * m[11] + 
				  m[1] * m[7] * m[10] + 
				  m[5] * m[2] * m[11] - 
				  m[5] * m[3] * m[10] - 
				  m[9] * m[2] * m[7] + 
				  m[9] * m[3] * m[6];
		inv[7] = m[0] * m[6] * m[11] - 
				 m[0] * m[7] * m[10] - 
				 m[4] * m[2] * m[11] + 
				 m[4] * m[3] * m[10] + 
				 m[8] * m[2] * m[7] - 
				 m[8] * m[3] * m[6];
		inv[11] = -m[0] * m[5] * m[11] + 
				   m[0] * m[7] * m[9] + 
				   m[4] * m[1] * m[11] - 
				   m[4] * m[3] * m[9] - 
				   m[8] * m[1] * m[7] + 
				   m[8] * m[3] * m[5];
		inv[15] = m[0] * m[5] * m[10] - 
				  m[0] * m[6] * m[9] - 
				  m[4] * m[1] * m[10] + 
				  m[4] * m[2] * m[9] + 
				  m[8] * m[1] * m[6] - 
				  m[8] * m[2] * m[5];
		let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
		if (det === 0.0) return new Float32Array(16);
		det = 1.0 / det;
		for (let i = 0; i < 16; i++) inv[i] = inv[i] * det;
		return inv;
	}
};