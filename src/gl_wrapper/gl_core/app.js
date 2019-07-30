import { Utils } from "../utils/utils.js";

export const App = class {
    constructor(glContext) {
        this.gl = glContext;
        // enable float texture
        this.oes_texture_float = this.gl.getExtension('OES_texture_float');
    }
};