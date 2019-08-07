export const beforeShaderList = {
0: "float sa=t[int(floor(F.w*255.+.5))];",
1: "uniform sampler2D W;",
};

export const afterShaderList = {
0: `
#if !defined(_i)&&!defined(_j)&&!defined(_k)
#endif
#ifdef _i
#endif
#ifdef _j
#endif
#ifdef _k
#endif
varying vec2 m;
#ifdef _c
varying vec3 n;
#endif
#ifdef _b
varying float o;
#endif
varying float p;
#ifdef _a
varying vec3 q;
#endif
#ifdef _d
varying vec4 r;
#endif
uniform mat4 s;
uniform float t[8];
#if defined(_a)||defined(_c)||0
uniform mat4 u;
#endif
#ifdef _d
uniform mat4 v;
#endif
uniform vec4 w;
#ifdef _b
uniform float x,A,B,C,D,E;
float Va(float sa) {
	return sa/(x*A);
}
float Wa(float sa) {
	float ta,ua,va,wa;
	ta=Va(sa);
	ua=C/ta;
	va=.5*ua/B;
	wa=.05;
	return va/wa;
}
float Xa(float sa) {
	return E*abs(sa-D)/sa;
}
float Ya(float sa) {
	float ta,ua;
	ta=Wa(sa);
	ua=Xa(sa);
	return clamp(max(ta,ua),0.,1.);
}
#endif
attribute vec4 F;
attribute vec2 G;
#ifdef _c
attribute vec3 H;
const vec3 ra=vec3(127);
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
	float sa=t[int(floor(F.w*255.+.5))];
	if(sa>0.) {
		vec4 ta=vec4(floor(F.xyz*255.+.5),1);
		#ifdef _a
		vec4 ua=u*ta;
		q=ua.xyz/6371010.;
		#endif

		// --------------------------------------------------------------------
		float len = getLen(q, lot_lat_len_h);
		float times = exp(-1.0 * len * len);
		float vol = 0.0;
		if (length(q) > lot_lat_len_h.w) vol = times * texture2D(orgTexture, vec2(len, 0.0)).r * scale;

		vec4 upvec = uInvert * vec4(q.xyz, ua.w);
		ta.xyz -= upvec.xyz * vol;

		/*
		vec4 ua2 = vec4(ua.xyz * (1.0 + vol * 0.000001), ua.w);
		ta = uInvert * ua2;
		*/
		// --------------------------------------------------------------------
		
		gl_Position=s*ta;
		m=(floor(G*65535.+.5)+w.xy)*w.zw;
		#ifdef _b
		o=Ya(gl_Position.w);
		#endif
		p=sa;
		
		#ifdef _c
		n=(u*vec4(floor(H*255.+.5)-ra,0)).xyz;
		#endif
		#ifdef _d
		r=v*ta;
		#endif
	}
	else gl_Position=vec4(0,0,0,1);
}
`,
1: `
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
	vec3 La=texture2D(W,m).rgb;
	#ifdef _b
	gl_FragColor=vec4(La,o);
	#else
	gl_FragColor=vec4(La,1);
	#endif

	#ifdef _a
	if ((marking == 1) && (getLen() < 1.0) && length(q) > lot_lat_len_h.w) {
		gl_FragColor.rgb += vec3(1.0, 0.0, 0.0) * 0.5;
		gl_FragColor.rgb *= 0.5;
	}
	#endif

	float vol = texture2D(orgTexture, vec2(gl_FragCoord.x / 1920.0, 0.0)).r * 10.0;
	if (gl_FragCoord.y < vol) {
		gl_FragColor.rgb *= 0.5;
		gl_FragColor.rgb += vec3(1.0, 1.0, 1.0) * 0.5;
	}
}
`
};