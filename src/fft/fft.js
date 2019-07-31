import { GlWrapper } from "../gl_wrapper/gl_core/gl_core.js";
import { Filter } from "./filter.js";
import { getAudio } from "./get_audio.js";

export const FftTextureGenerator = class {
	constructor(glContext) {
		// WebGLのラッパークラスのインスタンス生成
		this.app = new GlWrapper.App(glContext);

		// fftの解析する周波数の範囲を指定
		this.hz1 = 0.0;
		this.hz2 = 3000.0;

		// 入力波形のコピーを入れるテクスチャ
		this.inputWaveLength = 1024;
		this.inputWaveTexture = new GlWrapper.Texture(this.app, this.inputWaveLength / 4, 1, this.app.gl.RGBA, this.app.gl.FLOAT);
		
		// sin, cosで音声を畳み込んだフレームバッファと、フーリエ変換の結果を格納するフレームバッファの生成
		this.FftLength = 1024;
		this.cosConvFrame1 = new GlWrapper.Frame(this.app, this.inputWaveTexture.width, this.FftLength, this.app.gl.RGBA, this.app.gl.FLOAT);
		this.cosConvFrame2 = new GlWrapper.Frame(this.app, this.inputWaveTexture.width, this.FftLength, this.app.gl.RGBA, this.app.gl.FLOAT);
		this.sinConvFrame1 = new GlWrapper.Frame(this.app, this.inputWaveTexture.width, this.FftLength, this.app.gl.RGBA, this.app.gl.FLOAT);
		this.sinConvFrame2 = new GlWrapper.Frame(this.app, this.inputWaveTexture.width, this.FftLength, this.app.gl.RGBA, this.app.gl.FLOAT);
		this.fftResultFrame = new GlWrapper.Frame(this.app, this.FftLength, 1, this.app.gl.RGBA, this.app.gl.FLOAT);

		this.convShader = null;  // cosもしくはsinで畳み込みを行うシェーダ
		this.averageShader = null;  // 畳み込みの平均を計算するシェーダ
		this.previewShader = null;  // fft結果をプレビューするシェーダ
		this.generateFilter();  // 各シェーダのインスタンス生成

		// 取得した入力波形を格納する変数
		this.input = null;
		this.input_sample_rate = null;

		this.needUpdate = false;

		// 波形が入力されたときのコールバック関数
		getAudio((e) => {
			// 入力波形の取得(Float32Array)
			let input = e.inputBuffer.getChannelData(0);
			this.input = new Float32Array(input.length);
			this.input.set(input);

			// 入力波形のサンプリング周波数取得
			this.input_sample_rate = e.inputBuffer.sampleRate;

			this.needUpdate = true;

		}, this.inputWaveLength);
	}
	update() {
		this.app.saveEnv();

		if (!this.input) return;
		if (!this.needUpdate) return;
		
		// 波形テクスチャの更新
		this.inputWaveTexture.update(this.input);

		// cosで畳み込み
		this.convShader.set("sample_rate", this.input_sample_rate);
		this.convShader.set("samples", this.FftLength);
		this.convShader.set("isCos", 1);
		this.convShader.set("hz1", this.hz1);
		this.convShader.set("hz2", this.hz2);
		this.convShader.filter(this.inputWaveTexture, this.cosConvFrame1);

		// sinで畳み込み
		this.convShader.set("sample_rate", this.input_sample_rate);
		this.convShader.set("samples", this.FftLength);
		this.convShader.set("isCos", 0);
		this.convShader.set("hz1", this.hz1);
		this.convShader.set("hz2", this.hz2);
		this.convShader.filter(this.inputWaveTexture, this.sinConvFrame1);

		// 畳み込みの平均を計算
		for (let times = 1; times <= Math.log2(this.cosConvFrame1.width); times++) {
			let tmpFrame = null;

			// cos
			this.averageShader.set("times", times);
			this.averageShader.filter(this.cosConvFrame1.texture, this.cosConvFrame2);
			tmpFrame = this.cosConvFrame1; this.cosConvFrame1 = this.cosConvFrame2; this.cosConvFrame2 = tmpFrame;

			// sin
			this.averageShader.set("times", times);
			this.averageShader.filter(this.sinConvFrame1.texture, this.sinConvFrame2);
			tmpFrame = this.sinConvFrame1; this.sinConvFrame1 = this.sinConvFrame2; this.sinConvFrame2 = tmpFrame;
		}

		// プレビューの表示
		this.previewShader.set("sample_rate", this.input_sample_rate);
		this.previewShader.set("samples", this.FftLength);
		this.previewShader.set("audio1", this.cosConvFrame1.texture);
		this.previewShader.set("audio2", this.sinConvFrame1.texture);
		this.previewShader.filter(null, this.fftResultFrame);

		this.app.loadEnv();

		this.needUpdate = false;
	}
	generateFilter() {
		this.convShader = new Filter(this.app, `
			precision highp float;
			uniform sampler2D texture;
			uniform vec2 resolution;
			varying vec2 vUv;
			varying vec4 vColor;

			uniform float sample_rate;
			uniform int samples;
			uniform int isCos;
			uniform float hz1;
			uniform float hz2;

			const float PI = 3.14159265358979;

			float getWave(int index, float wave){
				float pos = float(index) / float(samples);
				float hz = hz1 * (1.0 - gl_FragCoord.y / resolution.y) + hz2 * (gl_FragCoord.y / resolution.y);
				float w = wave * (0.5 - 0.5 * cos(pos * 2.0 * PI));
				float theta = hz * (float(index) / float(sample_rate)) * (2.0 * PI);
				if (isCos == 0) w *= sin(theta);
				if (isCos == 1) w *= cos(theta);
				return w;
			}
			
			void main(void){
				vec2 pos = vec2(
					gl_FragCoord.x / resolution.x,
					gl_FragCoord.y / resolution.y
				);
				vec4 val = texture2D(texture, vec2(pos.x, 0.0));
				vec4 ret = vec4(0.0);
				for(int ch = 0; ch < 4; ch++){
					int index = int(pos.x * float(samples - 1)) + ch;
					if (ch == 0) ret.r = getWave(index, val.r);
					if (ch == 1) ret.g = getWave(index, val.g);
					if (ch == 2) ret.b = getWave(index, val.b);
					if (ch == 3) ret.a = getWave(index, val.a);
				}
				gl_FragColor = ret;
			}
		`);
		this.averageShader = new Filter(this.app, `
			precision highp float;
			uniform sampler2D texture;
			uniform vec2 resolution;
			varying vec2 vUv;
			varying vec4 vColor;

			uniform int times;

			void main(void){
				vec2 pos = gl_FragCoord.xy / resolution;
				int gap = int(pow(2.0, float(times)));

				vec4 ret = vec4(0.0);
				if (int(mod(gl_FragCoord.x, float(gap))) == 0){
					ret += texture2D(texture, pos);
					ret += texture2D(texture, pos + vec2(float(gap / 2) / resolution.x, 0.0));
					ret.r = ret.r + ret.g + ret.b + ret.a;
					ret.g = ret.b = ret.a = 0.0;
				}

				gl_FragColor = ret;
			}
		`);
		this.previewShader = new Filter(this.app, `
			precision highp float;
			uniform sampler2D audio1;
			uniform sampler2D audio2;
			uniform vec2 resolution;
			varying vec2 vUv;
			varying vec4 vColor;

			uniform float sample_rate;
			uniform int samples;

			float getWave(float index){
				vec4 waves1 = texture2D(audio1, vec2(0.0, index / float(samples)));
				vec4 waves2 = texture2D(audio2, vec2(0.0, index / float(samples)));
				return sqrt(pow(abs(waves1.r), 2.0) + pow(abs(waves2.r), 2.0));
			}

			void main(void){
				vec2 pos = gl_FragCoord.xy / resolution;
				vec2 px = vec2(1.0) / resolution;

				float index = (pos.x + px.x * 0.0) * float(samples - 1);
				float per = fract(index);
				float val = abs(getWave(floor(index)) * (1.0 - per) + getWave(ceil(index)) * per);

				gl_FragColor = vec4(vec3(val), 1.0);
			}
		`);
	}
};