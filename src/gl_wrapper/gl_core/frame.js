import { App } from "./app.js";
import { Texture } from "./texture.js";

export const Frame = class {
    constructor(app, width, height, format = null, type = null) {
        if (typeof (app) !== "object") { console.error("argument type is wrong."); return; }
        if (!(app instanceof App)) { console.error("argument type is wrong."); return; }
        this.app = app;
        this.gl = this.app.gl;
        this.frame_buffer = null;
        this.texture = null;
        this.current_frame = null;
        this.resize(width, height, format, type);
        this.viewport_backup = this.gl.getParameter(this.gl.VIEWPORT);
    }
    resize(width, height, format = null, type = null) {
        if ((typeof (width) !== "number") || (typeof (height) !== "number")) { console.error("argument type is wrong."); return; }
        if ((this.width === width) && (this.height === height)) return;
        this.width = width;
        this.height = height;
        if (this.frame_buffer !== null) this.delete();
        this.frame_buffer = this.gl.createFramebuffer();
        this.texture = new Texture(this.app, this.width, this.height, format, type);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frame_buffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture.texture_buffer, 0);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
    beginDraw() {
        if (this.frame_buffer == null) return;
        this.current_frame = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING);
        this.viewport_backup = this.gl.getParameter(this.gl.VIEWPORT);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frame_buffer);
        this.gl.viewport(0, 0, this.width, this.height);
    }
    endDraw() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.current_frame);
        this.gl.viewport(
            this.viewport_backup[0],
            this.viewport_backup[1],
            this.viewport_backup[2],
            this.viewport_backup[3]
        );
    }
    read(pixels, left = 0, top = 0, width = this.width, height = this.height) {
        if (this.frame_buffer == null) return;
        this.beginDraw();
        this.gl.readPixels(left, top, width, height, this.texture.format, this.texture.type, pixels);
        this.endDraw();
    }
    delete() {
        this.gl.deleteFramebuffer(this.frame_buffer);
        this.frame_buffer = null;
        this.texture.delete();
    }
};