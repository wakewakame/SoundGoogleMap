import { GlWrapper } from "../gl_wrapper/gl_core/gl_core.js";

const Filter = class {
	constructor(app, fragment) {
		this.app = app;
		this.shape = new GlWrapper.Shape(this.app);
		this.shader = new GlWrapper.Shader(this.app);
		this.shader.loadShader(
			this.shader.default_shader.vertex,
			fragment
		);
	}

	filter(inputTexture, outputFrame) {
		if (inputTexture) this.shader.set("texture", inputTexture);
		this.shader.set("resolution", outputFrame.width, outputFrame.height);
		outputFrame.beginDraw();
		this.shape.beginShape(this.shape.gl.TRIANGLE_FAN);
		this.shape.vertex(-1, -1, 0, 0, 0);
		this.shape.vertex( 1, -1, 0, 0, 0);
		this.shape.vertex( 1,  1, 0, 0, 0);
		this.shape.vertex(-1,  1, 0, 0, 0);
		this.shape.endShape();
		this.shape.drawShape(this.shader);
		outputFrame.endDraw();
	}
};

export const FftTextureGenerator = class {
	constructor(glContext) {
		this.app = new GlWrapper.App(glContext);
		this.frame = new GlWrapper.Frame(this.app, 256, 256);
		this.filter = new Filter(this.app, `
			precision highp float;
			varying vec2 vUv;
			varying vec4 vColor;

			uniform vec2 resolution;
			uniform float time;

			void main(void){
				gl_FragColor = vec4(0.0, sin(time) * 0.5 + 0.5, cos(time) * 0.5 + 0.5, 1.0);
			}
		`);
		setInterval(
			() => { this.draw(); },
			1000.0 / 60.0
		);
	}
	draw() {
		this.filter.shader.set("time", (window.renderChange.lastRenderTime - window.renderChange.firstRenderTime) / 1000.0);
		this.filter.filter(null, this.frame);
	}
};