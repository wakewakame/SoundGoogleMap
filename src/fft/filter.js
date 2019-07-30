import { GlWrapper } from "../gl_wrapper/gl_core/gl_core.js";

export const Filter = class {
	constructor(app, fragment) {
		this.app = app;
		this.shape = new GlWrapper.Shape(this.app);
		this.shader = new GlWrapper.Shader(this.app);
		this.shader.loadShader(
			this.shader.default_shader.vertex,
			fragment
		);
		this.set = this.shader.set.bind(this.shader);
	}

	filter(inputTexture, outputFrame) {
		if (inputTexture) this.set("texture", inputTexture);
		this.set("resolution", parseFloat(outputFrame.width), parseFloat(outputFrame.height));
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