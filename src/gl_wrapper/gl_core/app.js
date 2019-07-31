import { Utils } from "../utils/utils.js";

export const App = class {
    constructor(glContext) {
        this.gl = glContext;
        // enable float texture
        this.oes_texture_float = this.gl.getExtension('OES_texture_float');

        this.env = {};
        this.saveEnv();
    }
    saveEnv() {
        this.env = {
            use_program: this.gl.getParameter(this.gl.CURRENT_PROGRAM),
            bind_framebuffer: this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING),
            bind_arraybuffer: this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING),
            bind_texture2d: this.gl.getParameter(this.gl.TEXTURE_BINDING_2D),
            active_texture: this.gl.getParameter(this.gl.ACTIVE_TEXTURE),
            viewport: this.gl.getParameter(this.gl.VIEWPORT),
        };
    }
    loadEnv() {
    	this.gl.useProgram(this.env.use_program);
    	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.env.bind_framebuffer);
    	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.env.bind_arraybuffer);
    	this.gl.bindTexture(this.gl.TEXTURE_2D, this.env.bind_texture2d);
    	this.gl.activeTexture(this.env.active_texture);
    	this.gl.viewport(
            this.env.viewport[0],
            this.env.viewport[1],
            this.env.viewport[2],
            this.env.viewport[3]
        );
    }
};