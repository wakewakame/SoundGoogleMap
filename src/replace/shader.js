export const shaderList = {
"vertex": `
varying vec2 m;
#ifdef _a
varying vec3 q;
#endif
#ifdef _b
varying float o;
uniform float x,A,B,C,D,E;
#endif
uniform mat4 s;
uniform float t[8];
#if defined(_a)||defined(_c)||0
uniform mat4 u;
#endif
uniform vec4 w;
attribute vec4 F;
attribute vec2 G;
#ifdef _c
attribute vec3 H;
#endif

uniform float time;
uniform sampler2D orgTexture;
uniform mat4 uInvert;
uniform vec4 lot_lat_len_h;
uniform float scale;

#ifdef _a
float getLen(vec3 pos, vec4 lllh){
	float pi = acos(0.0) * 2.0;
	float lot = atan(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y)) * 180.0 / pi - lllh.x;
	float lat = atan(pos.y, pos.x) * 180.0 / pi - lllh.y;
	lot /= 180.0;
	lot = 0.5 + (lot - floor(lot) - 0.5) * (1.0 + 2.0 * floor(0.5 * lot) - 2.0 * floor(0.5 + 0.5 * lot));
	lot *= 180.0;
	lat /= 180.0;
	lat = 0.5 + (lat - floor(lat) - 0.5) * (1.0 + 2.0 * floor(0.5 * lat) - 2.0 * floor(0.5 + 0.5 * lat));
	lat *= 180.0;
	float len = sqrt(lat * lat + lot * lot) / lllh.z;
	return len;
}
#endif

void main() {
	float sa = t[int(floor(F.w * 255.0 + 0.5))];

	if(sa > 0.0) {
		vec4 ta = vec4(floor(F.xyz * 255.0 + 0.5), 1);

		#ifdef _a
		vec4 ua = u * ta;
		q=ua.xyz / 6371010.0;
		#endif

		// --------------------------------------------------------------------
		float len = getLen(q, lot_lat_len_h);
		float times = exp(-1.0 * len * len);
		float vol = 0.0;
		if (length(q) > lot_lat_len_h.w) vol = times * texture2D(orgTexture, vec2(len, 0.0)).r * scale;

		vec4 upvec = uInvert * vec4(q.xyz, ua.w);
		ta.xyz -= upvec.xyz * vol;
		// --------------------------------------------------------------------
		
		gl_Position = s * ta;
		m = (floor(G * 65535.0 + 0.5) + w.xy) * w.zw;

		#ifdef _b
		o=clamp(
			max(
				(10.0 * x * A * C) / (gl_Position.w * B),
				E * abs(sa - D) / gl_Position.w
			),
			0.0,
			1.0
		);
		#endif
	}
	else gl_Position=vec4(0, 0, 0, 1);
	gl_PointSize = 2.0;
}
`,
"fragment": `
precision highp float;

varying vec2 m;
#ifdef _b
varying float o;
#endif
#ifdef _a
varying vec3 q;
#endif
uniform sampler2D W;

uniform float time;

uniform vec4 lot_lat_len_h;
uniform int marking;
uniform sampler2D orgTexture;

#ifdef _a
float getLen(){
	float pi = acos(0.0) * 2.0;
	float lot = atan(q.z, sqrt(q.x * q.x + q.y * q.y)) * 180.0 / pi - lot_lat_len_h.x;
	float lat = atan(q.y, q.x) * 180.0 / pi - lot_lat_len_h.y;
	lot /= 180.0;
	lot = 0.5 + (lot - floor(lot) - 0.5) * (1.0 + 2.0 * floor(0.5 * lot) - 2.0 * floor(0.5 + 0.5 * lot));
	lot *= 180.0;
	lat /= 180.0;
	lat = 0.5 + (lat - floor(lat) - 0.5) * (1.0 + 2.0 * floor(0.5 * lat) - 2.0 * floor(0.5 + 0.5 * lat));
	lat *= 180.0;
	float len = sqrt(lat * lat + lot * lot) / lot_lat_len_h.z;
	return len;
}
#endif

void main(){
	vec3 La = texture2D(W, m).rgb;
	#ifdef _b
	gl_FragColor=vec4(La, o);
	#else
	gl_FragColor=vec4(La, 1);
	#endif

	#ifdef _a
	if ((marking == 1) && (getLen() < 1.0) && length(q) > lot_lat_len_h.w) {
		gl_FragColor.rgb += vec3(1.0, 0.0, 0.0) * 0.5;
		gl_FragColor.rgb *= 0.5;
	}
	#endif

	float vol = texture2D(orgTexture, vec2(gl_FragCoord.x / 1920.0, 0.0)).r * 10.0;
}
`
};