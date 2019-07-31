export const beforeShaderList = {
0: "#if !defined(_i)&&!defined(_j)&&!defined(_k)\n#endif\n#ifdef _i\n#endif\n#ifdef _j\n#endif\n#ifdef _k\n#endif\nvarying vec2 m;\n#ifdef _c\nvarying vec3 n;\n#endif\n#ifdef _b\nvarying float o;\n#endif\nvarying float p;\n#ifdef _a\nvarying vec3 q;\n#endif\n#ifdef _d\nvarying vec4 r;\n#endif\nuniform mat4 s;uniform float t[8];\n#if defined(_a)||defined(_c)||0\nuniform mat4 u;\n#endif\n#ifdef _d\nuniform mat4 v;\n#endif\nuniform vec4 w;\n#ifdef _b\nuniform float x,A,B,C,D,E;float Va(float sa){return sa/(x*A);}float Wa(float sa){float ta,ua,va,wa;ta=Va(sa);ua=C/ta;va=.5*ua/B;wa=.05;return va/wa;}float Xa(float sa){return E*abs(sa-D)/sa;}float Ya(float sa){float ta,ua;ta=Wa(sa);ua=Xa(sa);return clamp(max(ta,ua),0.,1.);}\n#endif\nattribute vec4 F;attribute vec2 G;\n#ifdef _c\nattribute vec3 H;const vec3 ra=vec3(127);\n#endif\nvoid main(){float sa=t[int(floor(F.w*255.+.5))];if(sa>0.){vec4 ta=vec4(floor(F.xyz*255.+.5),1);gl_Position=s*ta;m=(floor(G*65535.+.5)+w.xy)*w.zw;\n#ifdef _b\no=Ya(gl_Position.w);\n#endif\np=sa;\n#ifdef _a\nvec4 ua=u*ta;q=ua.xyz/6371010.;\n#endif\n#ifdef _c\nn=(u*vec4(floor(H*255.+.5)-ra,0)).xyz;\n#endif\n#ifdef _d\nr=v*ta;\n#endif\n}else gl_Position=vec4(0,0,0,1);}",
1: "precision highp float;\n#ifdef _a\nconst float Z=3.141592657;const float ba=1.;\n#if !defined(_i)&&!defined(_j)&&!defined(_k)\nconst float ca=6360.;const float da=6350./ca;const float ea=6420./ca;const float ga=ea-ba;const float ia=.148657681;const float ja=8./ca;const vec3 ka=vec3(.0058,.0135,.0331)*ca;const float la=1.2/ca;const vec3 ma=vec3(.004)*ca;const vec3 na=ma/.9;const vec3 qa=vec3(.031586,.063477,.129883)*2.;\n#endif\n#ifdef _i\nconst float ca=3380.;const float da=3372./ca;const float ea=3485./ca;const float ga=ea-ba;const float ia=.260429152;const float ja=11.1/ca;const vec3 ka=vec3(9.53e-5,.0002218,.000544)*ca;const float la=14./ca;const vec3 ma=vec3(.02,.0159,.0118)*.33*ca;const vec3 na=ma/.8;const vec3 qa=vec3(.19873,.163208,.127075);\n#endif\n#ifdef _j\nconst float ca=6052.;const float da=6050./ca;const float ea=6120./ca;const float ga=ea-ba;const float ia=.1525;const float ja=15.9/ca;const vec3 ka=vec3(.0028,.000535,7.31e-5)*ca;const float la=1.2/ca;const vec3 ma=vec3(.04)*ca;const vec3 na=ma/.9;const vec3 qa=vec3(.29873,.163208,.127075)*2.;\n#endif\n#ifdef _k\nconst float ca=1187.;const float da=1186./ca;const float ea=1247./ca;const float ga=ea-ba;const float ia=.324;const float ja=45./ca;const vec3 ka=vec3(9.53e-6,2.218e-5,5.44e-5)*ca;const float la=1./ca;const vec3 ma=vec3(.02,.0159,.0118)*.33*ca;const vec3 na=ma/.2;const vec3 qa=vec3(.19873,.163208,.127075);\n#endif\nconst float ta=da+1e-7;const vec3 ua=(ka*ja+na*la)/(ja+la);const float va=64.;const float wa=64.;uniform sampler2D a,b,c;uniform vec4 e;vec2 pb(float La,float Ma){const vec2 Na=vec2(8,128);const vec2 Oa=vec2(.5)/Na;const vec2 Pa=(Na-vec2(1))/Na;const float Qa=.06868;const vec2 Ra=vec2(1./ga,1./1.2);const float Sa=Qa*Ra.x;const vec2 Ta=Ra*Pa;const vec2 Ua=vec2(-ba,.2)*Ra;const vec2 Va=vec2(0,Qa*(1.+Ua.x))*Ta;const vec2 Wa=Oa+Ua*Pa+Va;return vec2(La,La*Sa+Ma)*Ta+Wa;}vec4 qb(float La,float Ma){return texture2D(a,pb(La,Ma));}vec2 rb(float La,float Ma){const vec2 Na=vec2(64,16);const vec2 Oa=vec2(.5)/Na;const vec2 Pa=(Na-vec2(1))/Na;const vec2 Qa=vec2(1./1.2,1./ga);const vec2 Ra=Qa*Pa;const vec2 Sa=vec2(.2,-ba)*Qa;const vec2 Ta=Oa+Sa*Pa;return vec2(Ma,La)*Ra+Ta;}vec3 sb(float La,float Ma){vec3 Na=texture2D(b,rb(La,Ma)).rgb;return Na*Na*qa;}vec3 tb(vec3 La,float f){La=La*f;\n#ifdef _h\nLa=vec3(1)-exp(-La);\n#else\nLa=vec3(1)-exp(-(sqrt(La)+La)*(1./1.8));\n#endif\nreturn La;}vec3 ub(vec3 La,float f){float Ma=1./f;\n#ifdef _h\nreturn log(vec3(1)-La)*-Ma;\n#else\nLa=-1.*log(vec3(1)-La)*1.8;La=(vec3(1)-sqrt(vec3(1)+4.*La))*.5;return La*La*Ma;\n#endif\n}float vb(float La,float Ma,float Na){return Na<La?La+(1./((La-Na)*(1./Ma)+1.)-1.)*Ma:Na;}vec2 wb(float La,float Ma,float Na,out float Oa){Oa=Ma+sqrt(Ma*Ma+La*La-1.);float Pa,Qa;Pa=vb(-.15,.1,Na-Oa);Qa=max(Pa+1e-6,min(1.,Na+Oa));return vec2(Pa,Qa);}vec2 xb(float La,float Ma,float Na){const float Oa=ba*ba;const float Pa=(ea+ba)*.5;const float Qa=(ea-ba)*.5;const float Ra=Qa/(.05*ba);const vec4 Sa=vec4(Pa,Ra*Ra,1.-Ra*Ra,Qa*Qa);const float Ta=da*da;const float Ua=(ea+da)*.5;const float Va=(ea-da)*.5;const float Wa=Va/(.05*da);const vec4 Xa=vec4(Ua,Wa*Wa,1.-Wa*Wa,Va*Va);\n#if defined(_i)||defined(_j)||defined(_k)\nconst float Ya=Ta;const vec4 Za=Xa;\n#else\nfloat Ya=e.x>=ba?Oa:Ta;vec4 Za=e.x>=ba?Sa:Xa;\n#endif\nfloat ab,bb,cb,db,eb,fb,gb;ab=La-Za.x;bb=Za.y+Ma*Ma*Za.z;cb=ab*Ma;db=ab*ab-Za.w;eb=max((-cb+sqrt(cb*cb-bb*db))/bb,1e-6);Na=min(Na,-sqrt(La*La-Ya)-.002);fb=Na*Na-La*La+Ya;gb=-Na-sqrt(fb);return eb<gb?vec2(eb,gb):vec2(gb,eb);}float Ab(float La){return La==0.?0.:(1.-sqrt(1.-La*La))/La;}float Bb(float La,float Ma){const float Na=.5/wa;const float Oa=ia;float Pa,Qa,Ra,Sa,Ta,Va;Pa=min(La,ea);Qa=Pa*Pa-da*da;Ra=sqrt(Qa);Sa=Pa*Ma;Ta=Sa*Sa-Qa;vec2 Ua=Sa<-Ra?vec2(-1.,0):vec2(1);Va=(sqrt(Ta+Oa*Oa*Ua.y)-Sa*Ua.x)/(Ra+Oa*Ua.y);return .5+Na*Ua.x+Va*(.5-2.*Na);}float Cb(float La,float Ma,float Na,float Oa,float Pa){const float Qa=.5*(1.-1./va);const float Ra=.5/va+Qa;float Sa,Ta;Sa=Pa;Ta=La*(1./ea);if(Ta>1.){float Ua,Wa;vec2 Va=wb(Ta,Ma,Ta*Na,Ua);Wa=(Oa-Va.x)/(Va.y-Va.x);Sa=clamp(Wa*2.-1.,-1.,1.);}return Ab(Sa)*Qa+Ra;}float Db(float La,float Ma);vec3 Eb(float La,float Ma,float Na,float Oa,float f,out vec3 Pa){float Qa,Ra,Sa,Ta;Qa=max(ta,e.x);Ra=e.y;Sa=Cb(Qa,Ma,Ra,Na,Oa);Ta=Bb(Qa,Ma);vec4 Ua=texture2D(c,vec2(Sa,Ta));\n#ifdef _g\nvec4 Va=Ua;\n#else\nvec4 Va=vec4(ub(Ua.rgb,f),log(Ua.a));\n#endif\nVa*=Db(La,Ma);Pa=vec3(exp(ua/ua.r*Va.a));return Va.rgb;}vec3 Eb(float La,float Ma,float Na,float Oa,float Pa,float Qa,float f,out vec3 Ra){float Sa,Ta,Ua,Va;Sa=max(ta,e.x);Ta=e.y;Ua=Cb(Sa,Ma,Ta,Oa,Pa);Va=Bb(Sa,Ma)*.5;vec4 Wa,Xa;Wa=texture2D(c,vec2(Ua,Va));Xa=texture2D(c,vec2(Ua,Va+.5));vec2 Ya,Za;Ya=xb(La,Ma,Na);Za=vec2(Qa/Ya.x,(min(Ya.y,Qa)-Ya.x)/max(Ya.y-Ya.x,1e-6));Za=Za.x<1.?vec2(Za.x,0):vec2(1.-Za.y,Za.y);Za*=Db(La,Ma);\n#ifdef _g\nfloat ab=dot(vec2(Wa.a,Xa.a),Za);\n#else\nfloat ab=dot(log(vec2(Wa.a,Xa.a)),Za);\n#endif\nRa=vec3(exp(ua/ua.r*ab));\n#ifdef _g\nvec3 bb,cb;bb=Wa.rgb;cb=Xa.rgb;\n#else\nvec3 bb,cb;bb=ub(Wa.rgb,f);cb=ub(Xa.rgb,f);\n#endif\nreturn bb*Za.x+cb*Za.y;}void Fb(vec3 U,vec3 q,vec3 V,float f,out vec3 La,out vec3 Ma){vec3 Na,Oa,Ta;Na=q-U;Oa=normalize(Na);float Pa,Qa,Ra,Sa;Pa=e.x;Qa=dot(U,Oa);Ra=dot(U,V);Sa=dot(Oa,V);if(Pa>ea){const float Ta=ea*ea;float Ua,Va;Ua=Qa*Qa-Pa*Pa+Ta;Va=-Qa-sqrt(Ua);Pa=ea;Qa+=Va;Ra+=Va*Sa;}\n#ifdef _f\nvec3 Ua=Eb(Pa,Qa/Pa,Ra/Pa,Sa,f,Ta);\n#else\nvec3 Ua=Eb(Pa,Qa/Pa,Qa,Ra/Pa,Sa,length(Na.xyz),f,Ta);\n#endif\nLa=Ta;Ma=Ua;}vec3 Fb(vec3 La,vec3 U,vec3 q,vec3 V,float Ma,float f){vec3 Na,Oa,Pa;Fb(U,q,V,f,Na,Oa);Pa=La*Na+Oa*Ma;return tb(Pa,f);}vec3 Fb(vec3 La,vec3 U,vec3 q,vec3 V,float f){return Fb(La,U,q,V,1.,f);}vec3 Gb(vec3 La,vec3 Ma){return mix(La,Ma,e.w);}uniform float f,g;float Db(float La,float Ma){const float Na=da*da;float Oa,Pa,Qa,Ra;Oa=e[2];Pa=Oa*(1./1.45e7);Qa=(1.+Ma)/(1.-sqrt(1.-Na/(La*La)));Ra=clamp(max(Pa,Qa),0.,1.);return pow(Ra,g);}\n#ifdef _s\nconst vec3 Fa=vec3(.00392,.01568,.04705);const float Ja=.016584;float Hb(float La,float Ma){float Na=1.-La;\n#ifdef _u\nfloat Oa,Pa,Qa,Ra;Oa=sqrt(Ma);Pa=Ma*sqrt(Oa);Qa=pow(Na,5.*exp(-2.69*Oa));Ra=1.+22.7*Pa;return Qa/Ra;\n#else\nfloat Sa=Na*Na;return Sa*Sa*Na;\n#endif\n}float Ib(vec3 La,vec3 Ma,float Na,vec3 Oa,float Pa){vec3 Qa=normalize(Oa+La);float Ra,Ya;Ra=dot(Qa,Ma);\n#ifdef _t\nconst float Sa=.02/(4.*Z);float Ta=Sa*Pa;\n#else\nfloat Ua,Va,Wa,Ta;Ua=1.-dot(La,Qa);Va=Ua*Ua;Wa=.02+.98*Va*Va*Ua;const float Xa=1./(4.*Z);Ta=Wa*Xa*Pa;\n#endif\nYa=exp(-2.*Pa*(1.-Ra))*Ta;\n#ifdef _v\nfloat Za,ab;Za=max(dot(Oa,Ma),.01);ab=max(Na,.01);return Ya*sqrt(Za/ab);\n#else\nreturn Ya;\n#endif\n}void Jb(vec3 La,vec3 Ma,vec3 Na,float Oa,vec3 Pa,vec3 Qa,float Ra,out vec3 Sa,out vec3 Ta){float Ua,Va;Ua=dot(La,Ma);Va=Ib(La,Ma,Ua,Na,1./Oa)*Ra;\n#ifdef _t\nconst vec3 Wa=Fa/Z;Sa=Va*Pa;Ta=Wa*Qa;\n#else\nconst float Xa=1./Z;vec3 Ya,Za;Ya=vec3(Hb(Ua,Oa));Za=(1.-Ya)*Fa;Sa=Va*Pa;Ta=(Ya+Za)*Qa*Xa;\n#endif\n}vec3 Jb(vec3 La,vec3 Ma,vec3 Na,float Oa,vec3 Pa,vec3 Qa,float Ra){vec3 Sa,Ta;Jb(La,Ma,Na,Oa,Pa,Qa,Ra,Sa,Ta);return Sa+Ta;}\n#endif\n#ifdef _n\nuniform samplerCube I;uniform vec4 J;float Kb(vec3 q,vec3 La,out vec3 Ma){float Na,Sa;Na=J.x;\n#ifdef _w\nfloat Oa,Pa;Oa=Na-ba;Pa=Oa/dot(q,La);\n#else\nfloat Qa,Ra,Pa;Qa=dot(q,La);Ra=dot(q,q)-Na*Na;Pa=sqrt(Qa*Qa-Ra)-Qa;\n#endif\nMa=q+Pa*La;Sa=textureCube(I,Ma).g;Sa*=Sa;return Sa*J.w*J.y;}vec4 Lb(vec3 La,vec3 q,vec3 V,float Ka){vec3 Ma,Qa,Ra;float Na,Oa,Pa,Sa,Ta;Na=Kb(q,La,Ma);Oa=J.x;Pa=dot(normalize(Ma),V);Qa=qb(Oa,Pa).rgb*Ka;Ra=sb(Oa,Pa)*Ka;Ra=max(Ra,vec3(.004,.0046,.0067));Sa=J.z;Ta=.25+.75*max(Pa,0.);return vec4(Sa*(Qa*Ta+Ra),Na);}vec4 Lb(vec3 La,vec3 q,float Ma,vec3 Na,vec3 Oa){vec3 Pa;float Qa,Ra,Sa;Qa=Kb(q,La,Pa);Ra=J.z;Sa=.25+.75*max(Ma,0.);return vec4(Ra*(Na*Sa+Oa),Qa);}\n#endif\n#ifdef _p\nuniform float K;float Mb(vec3 La,vec3 Ma,vec4 Na,vec3 F){vec3 Oa=F-La;float Pa,Qa,Ra,Sa;Pa=dot(Oa,Ma);Qa=sqrt(dot(Oa,Oa)-Pa*Pa);Ra=Na.x+Pa*Na.y;Sa=Na.z+Pa*Na.w;return mix(1.,smoothstep(Ra,Sa,Qa),K);}\n#endif\n#ifdef _r\nuniform vec3 L;\n#endif\n#ifdef _s\nuniform float M,N;\n#endif\n#ifdef _m\nuniform samplerCube O;uniform float P;\n#endif\n#ifdef _p\nuniform vec3 Q,R;uniform vec4 S;float Ka;\n#endif\nvec3 Nb(vec3 La,vec3 U,vec3 q,vec3 Ma,vec3 V,float f){\n#ifdef _s\nconst vec3 Na=vec3(0,5,15)/255.;vec3 Oa=La+Na;vec2 Pa=Oa.bg-Oa.rr;bool Qa,Ra;Qa=all(greaterThan(vec2(.77,Oa.b),Oa.bg));Ra=all(greaterThan(Pa.rgr,vec3(Oa.b*.35,0,Pa.g*1.6666)));float Sa=all(bvec2(Qa,Ra))?N:0.;Sa*=step(dot(q.xz,vec2(.93,.37)),.98);\n#endif\nconst float Ta=.55/Z;vec3 Ua,Wa,ab,bb,eb,ib;Ua=La*La*Ta;\n#ifdef _s\nconst vec3 Va=1.7*Fa/Z;Ua=mix(Ua,Va,Sa);\n#endif\nWa=normalize(q);float Xa,Ya,Za,db;Xa=e[2];Ya=Xa<1e7?length(q):ba;Za=dot(Wa,V);ab=qb(Ya,Za).rgb;bb=sb(Ya,Za);\n#ifdef _p\nKa=Mb(Q,R,S,q);ab*=Ka;bb*=Ka;\n#endif\nconst float cb=.014;db=smoothstep(0.,.2,-Za);eb=max(bb,cb*db);\n#ifdef _o\nvec3 fb;float gb=Kb(q,V,fb);gb=1.-min(1.,3.*gb);\n#else\nconst float gb=1.;\n#endif\n#ifdef _q\nfloat hb=(dot(Ma,V)+Za)*.5;\n#else\nfloat hb=Za;\n#endif\nib=Ua*(max(hb,0.)*ab*gb+eb);\n#ifdef _r\n#ifdef _q\nhb=dot(Ma,L);\n#else\nhb=dot(Wa,L);\n#endif\nib+=Ua*cb*max(hb,0.);\n#endif\n#ifdef _s\nif(Sa>0.){vec3 jb,kb;jb=normalize(U-q);kb=Jb(jb,Wa,V,Ja,ab*gb,bb,1.);ib+=kb*M;}\n#endif\n#ifndef _l\nconst vec3 jb=vec3(.2126,.7152,.0722);const vec3 kb=vec3(.874,.874,2.622);float lb=dot(ib,jb);ib=mix(lb*kb,ib,1.-.75*db);\n#endif\nvec4 mb=vec4(0);\n#ifdef _n\nif(e.x>J.x){vec3 nb=normalize(U-q);\n#ifdef _w\nmb=Lb(nb,q,Za,ab,bb);\n#else\n#ifdef _p\nmb=Lb(nb,q,V,Ka);\n#else\nmb=Lb(nb,q,V,1.);\n#endif\n#endif\nib=mix(ib,mb.rgb,mb.a);}\n#endif\n#ifdef _m\nconst vec3 nb=vec3(.01,.01,.005)*6.;float ob=clamp(-Za*5.,0.,1.);ob*=max(1.-1.25*mb.a,0.);ib+=nb*textureCube(O,q).g*ob*P;\n#endif\n#ifdef _p\nreturn Fb(ib,U,q,V,Ka,f);\n#else\nreturn Fb(ib,U,q,V,1.,f);\n#endif\n}\n#endif\n#ifdef _d\nuniform vec4 T;vec3 Ob(vec4 r,sampler2D X){float La,Oa,Pa,Qa;La=3.141592653589793;vec3 Ma,Na,Sa;Ma=r.xyz/r.w;Na=normalize(Ma);Oa=atan(Na.x,Na.y)/(2.*La)+.5;Pa=acos(Na.z)/La;Qa=dot(Na,Ma);vec2 Ra=vec2(Oa,Pa);Sa=vec3(Ra*T.xy+T.zw,1)*Qa;return texture2DProj(X,Sa).rgb;}\n#endif\nvarying vec2 m;\n#ifdef _c\nvarying vec3 n;\n#endif\n#ifdef _b\nvarying float o;\n#endif\nvarying float p;\n#ifdef _a\nvarying vec3 q;\n#endif\n#ifdef _d\nvarying vec4 r;\n#endif\n#ifdef _a\nuniform vec3 U,V;\n#endif\nuniform sampler2D W;\n#ifdef _d\nuniform sampler2D X;uniform float Y;\n#endif\nvoid main(){vec3 La=texture2D(W,m).rgb;\n#ifdef _c\nvec3 H=dot(n,n)>1e-6?normalize(n):vec3(0);\n#endif\n#ifdef _a\n#ifdef _c\nvec3 Ma=dot(H,vec3(1))!=0.?H:normalize(q);\n#else\nvec3 Ma=normalize(q);\n#endif\nvec3 Na=Nb(La,U,q,Ma,V,f);La=Gb(La,Na);\n#endif\n#ifdef _d\nvec3 Oa=Ob(r,X);La=mix(La,Oa,Y);\n#endif\n#ifdef _b\ngl_FragColor=vec4(La,o);\n#else\ngl_FragColor=vec4(La,1);\n#endif\n}",
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

void main() {
	float sa=t[int(floor(F.w*255.+.5))];
	if(sa>0.) {
		vec4 ta=vec4(floor(F.xyz*255.+.5),1);
		#ifdef _a
		vec4 ua=u*ta;
		q=ua.xyz/6371010.;
		#endif

		// --------------------------------------------------------------------
		/*
		float pi = acos(0.0) * 2.0;
		float theta1 = atan(q.y, q.x) * 40000.0;
		float theta2 = atan(q.z, sqrt(q.x * q.x + q.y * q.y)) * 40000.0;
		theta1 = (theta1 + pi) / (2.0 * pi);
		float pixIndex = (theta1 - floor(theta1));
		float vol = texture2D(orgTexture, vec2(pixIndex, 0.0)).r;
		vec4 ua2 = vec4(ua.xyz * (1.0 + vol * 0.0001), ua.w);
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
#ifdef _a
const float Z=3.141592657;
const float ba=1.;
#if !defined(_i)&&!defined(_j)&&!defined(_k)
const float ca=6360.;
const float da=6350./ca;
const float ea=6420./ca;
const float ga=ea-ba;
const float ia=.148657681;
const float ja=8./ca;
const vec3 ka=vec3(.0058,.0135,.0331)*ca;
const float la=1.2/ca;
const vec3 ma=vec3(.004)*ca;
const vec3 na=ma/.9;
const vec3 qa=vec3(.031586,.063477,.129883)*2.;
#endif
#ifdef _i
const float ca=3380.;
const float da=3372./ca;
const float ea=3485./ca;
const float ga=ea-ba;
const float ia=.260429152;
const float ja=11.1/ca;
const vec3 ka=vec3(9.53e-5,.0002218,.000544)*ca;
const float la=14./ca;
const vec3 ma=vec3(.02,.0159,.0118)*.33*ca;
const vec3 na=ma/.8;
const vec3 qa=vec3(.19873,.163208,.127075);
#endif
#ifdef _j
const float ca=6052.;
const float da=6050./ca;
const float ea=6120./ca;
const float ga=ea-ba;
const float ia=.1525;
const float ja=15.9/ca;
const vec3 ka=vec3(.0028,.000535,7.31e-5)*ca;
const float la=1.2/ca;
const vec3 ma=vec3(.04)*ca;
const vec3 na=ma/.9;
const vec3 qa=vec3(.29873,.163208,.127075)*2.;
#endif
#ifdef _k
const float ca=1187.;
const float da=1186./ca;
const float ea=1247./ca;
const float ga=ea-ba;
const float ia=.324;
const float ja=45./ca;
const vec3 ka=vec3(9.53e-6,2.218e-5,5.44e-5)*ca;
const float la=1./ca;
const vec3 ma=vec3(.02,.0159,.0118)*.33*ca;
const vec3 na=ma/.2;
const vec3 qa=vec3(.19873,.163208,.127075);
#endif
const float ta=da+1e-7;
const vec3 ua=(ka*ja+na*la)/(ja+la);
const float va=64.;
const float wa=64.;
uniform sampler2D a,b,c;
uniform vec4 e;
vec2 pb(float La,float Ma){
	const vec2 Na=vec2(8,128);
	const vec2 Oa=vec2(.5)/Na;
	const vec2 Pa=(Na-vec2(1))/Na;
	const float Qa=.06868;
	const vec2 Ra=vec2(1./ga,1./1.2);
	const float Sa=Qa*Ra.x;
	const vec2 Ta=Ra*Pa;
	const vec2 Ua=vec2(-ba,.2)*Ra;
	const vec2 Va=vec2(0,Qa*(1.+Ua.x))*Ta;
	const vec2 Wa=Oa+Ua*Pa+Va;
	return vec2(La,La*Sa+Ma)*Ta+Wa;
}
vec4 qb(float La,float Ma){
	return texture2D(a,pb(La,Ma));
}
vec2 rb(float La,float Ma){
	const vec2 Na=vec2(64,16);
	const vec2 Oa=vec2(.5)/Na;
	const vec2 Pa=(Na-vec2(1))/Na;
	const vec2 Qa=vec2(1./1.2,1./ga);
	const vec2 Ra=Qa*Pa;
	const vec2 Sa=vec2(.2,-ba)*Qa;
	const vec2 Ta=Oa+Sa*Pa;
	return vec2(Ma,La)*Ra+Ta;
}
vec3 sb(float La,float Ma){
	vec3 Na=texture2D(b,rb(La,Ma)).rgb;
	return Na*Na*qa;
}
vec3 tb(vec3 La,float f){
	La=La*f;
	#ifdef _h
	La=vec3(1)-exp(-La);
	#else
	La=vec3(1)-exp(-(sqrt(La)+La)*(1./1.8));
	#endif
	return La;
}
vec3 ub(vec3 La,float f){
	float Ma=1./f;
	#ifdef _h
	return log(vec3(1)-La)*-Ma;
	#else
	La=-1.*log(vec3(1)-La)*1.8;
	La=(vec3(1)-sqrt(vec3(1)+4.*La))*.5;
	return La*La*Ma;
	#endif
}
float vb(float La,float Ma,float Na){
	return Na<La?La+(1./((La-Na)*(1./Ma)+1.)-1.)*Ma:Na;
}
vec2 wb(float La,float Ma,float Na,out float Oa){
	Oa=Ma+sqrt(Ma*Ma+La*La-1.);
	float Pa,Qa;
	Pa=vb(-.15,.1,Na-Oa);
	Qa=max(Pa+1e-6,min(1.,Na+Oa));
	return vec2(Pa,Qa);
}
vec2 xb(float La,float Ma,float Na){
	const float Oa=ba*ba;
	const float Pa=(ea+ba)*.5;
	const float Qa=(ea-ba)*.5;
	const float Ra=Qa/(.05*ba);
	const vec4 Sa=vec4(Pa,Ra*Ra,1.-Ra*Ra,Qa*Qa);
	const float Ta=da*da;
	const float Ua=(ea+da)*.5;
	const float Va=(ea-da)*.5;
	const float Wa=Va/(.05*da);
	const vec4 Xa=vec4(Ua,Wa*Wa,1.-Wa*Wa,Va*Va);
	#if defined(_i)||defined(_j)||defined(_k)
	const float Ya=Ta;
	const vec4 Za=Xa;
	#else
	float Ya=e.x>=ba?Oa:Ta;
	vec4 Za=e.x>=ba?Sa:Xa;
	#endif
	float ab,bb,cb,db,eb,fb,gb;
	ab=La-Za.x;
	bb=Za.y+Ma*Ma*Za.z;
	cb=ab*Ma;
	db=ab*ab-Za.w;
	eb=max((-cb+sqrt(cb*cb-bb*db))/bb,1e-6);
	Na=min(Na,-sqrt(La*La-Ya)-.002);
	fb=Na*Na-La*La+Ya;
	gb=-Na-sqrt(fb);
	return eb<gb?vec2(eb,gb):vec2(gb,eb);
}
float Ab(float La){
	return La==0.?0.:(1.-sqrt(1.-La*La))/La;
}
float Bb(float La,float Ma){
	const float Na=.5/wa;
	const float Oa=ia;
	float Pa,Qa,Ra,Sa,Ta,Va;
	Pa=min(La,ea);
	Qa=Pa*Pa-da*da;
	Ra=sqrt(Qa);
	Sa=Pa*Ma;
	Ta=Sa*Sa-Qa;
	vec2 Ua=Sa<-Ra?vec2(-1.,0):vec2(1);
	Va=(sqrt(Ta+Oa*Oa*Ua.y)-Sa*Ua.x)/(Ra+Oa*Ua.y);
	return .5+Na*Ua.x+Va*(.5-2.*Na);
}
float Cb(float La,float Ma,float Na,float Oa,float Pa){
	const float Qa=.5*(1.-1./va);
	const float Ra=.5/va+Qa;
	float Sa,Ta;
	Sa=Pa;
	Ta=La*(1./ea);
	if(Ta>1.){
		float Ua,Wa;
		vec2 Va=wb(Ta,Ma,Ta*Na,Ua);
		Wa=(Oa-Va.x)/(Va.y-Va.x);
		Sa=clamp(Wa*2.-1.,-1.,1.);
	}
	return Ab(Sa)*Qa+Ra;
}
float Db(float La,float Ma);
vec3 Eb(float La,float Ma,float Na,float Oa,float f,out vec3 Pa){
	float Qa,Ra,Sa,Ta;
	Qa=max(ta,e.x);
	Ra=e.y;
	Sa=Cb(Qa,Ma,Ra,Na,Oa);
	Ta=Bb(Qa,Ma);
	vec4 Ua=texture2D(c,vec2(Sa,Ta));
	#ifdef _g
	vec4 Va=Ua;
	#else
	vec4 Va=vec4(ub(Ua.rgb,f),log(Ua.a));
	#endif
	Va*=Db(La,Ma);
	Pa=vec3(exp(ua/ua.r*Va.a));
	return Va.rgb;
}
vec3 Eb(float La,float Ma,float Na,float Oa,float Pa,float Qa,float f,out vec3 Ra){
	float Sa,Ta,Ua,Va;
	Sa=max(ta,e.x);
	Ta=e.y;
	Ua=Cb(Sa,Ma,Ta,Oa,Pa);
	Va=Bb(Sa,Ma)*.5;
	vec4 Wa,Xa;
	Wa=texture2D(c,vec2(Ua,Va));
	Xa=texture2D(c,vec2(Ua,Va+.5));
	vec2 Ya,Za;
	Ya=xb(La,Ma,Na);
	Za=vec2(Qa/Ya.x,(min(Ya.y,Qa)-Ya.x)/max(Ya.y-Ya.x,1e-6));
	Za=Za.x<1.?vec2(Za.x,0):vec2(1.-Za.y,Za.y);
	Za*=Db(La,Ma);
	#ifdef _g
	float ab=dot(vec2(Wa.a,Xa.a),Za);
	#else
	float ab=dot(log(vec2(Wa.a,Xa.a)),Za);
	#endif
	Ra=vec3(exp(ua/ua.r*ab));
	#ifdef _g
	vec3 bb,cb;
	bb=Wa.rgb;
	cb=Xa.rgb;
	#else
	vec3 bb,cb;
	bb=ub(Wa.rgb,f);
	cb=ub(Xa.rgb,f);
	#endif
	return bb*Za.x+cb*Za.y;
}
void Fb(vec3 U,vec3 q,vec3 V,float f,out vec3 La,out vec3 Ma){
	vec3 Na,Oa,Ta;
	Na=q-U;
	Oa=normalize(Na);
	float Pa,Qa,Ra,Sa;
	Pa=e.x;
	Qa=dot(U,Oa);
	Ra=dot(U,V);
	Sa=dot(Oa,V);
	if(Pa>ea){
		const float Ta=ea*ea;
		float Ua,Va;
		Ua=Qa*Qa-Pa*Pa+Ta;
		Va=-Qa-sqrt(Ua);
		Pa=ea;
		Qa+=Va;
		Ra+=Va*Sa;
	}
	#ifdef _f
	vec3 Ua=Eb(Pa,Qa/Pa,Ra/Pa,Sa,f,Ta);
	#else
	vec3 Ua=Eb(Pa,Qa/Pa,Qa,Ra/Pa,Sa,length(Na.xyz),f,Ta);
	#endif
	La=Ta;
	Ma=Ua;
}
vec3 Fb(vec3 La,vec3 U,vec3 q,vec3 V,float Ma,float f){
	vec3 Na,Oa,Pa;
	Fb(U,q,V,f,Na,Oa);
	Pa=La*Na+Oa*Ma;
	return tb(Pa,f);
}
vec3 Fb(vec3 La,vec3 U,vec3 q,vec3 V,float f){
	return Fb(La,U,q,V,1.,f);
}
vec3 Gb(vec3 La,vec3 Ma){
	return mix(La,Ma,e.w);
}
uniform float f,g;
float Db(float La,float Ma){
	const float Na=da*da;
	float Oa,Pa,Qa,Ra;
	Oa=e[2];
	Pa=Oa*(1./1.45e7);
	Qa=(1.+Ma)/(1.-sqrt(1.-Na/(La*La)));
	Ra=clamp(max(Pa,Qa),0.,1.);
	return pow(Ra,g);
}
#ifdef _s
const vec3 Fa=vec3(.00392,.01568,.04705);
const float Ja=.016584;
float Hb(float La,float Ma){
	float Na=1.-La;
	#ifdef _u
	float Oa,Pa,Qa,Ra;
	Oa=sqrt(Ma);
	Pa=Ma*sqrt(Oa);
	Qa=pow(Na,5.*exp(-2.69*Oa));
	Ra=1.+22.7*Pa;
	return Qa/Ra;
	#else
	float Sa=Na*Na;
	return Sa*Sa*Na;
	#endif
}
float Ib(vec3 La,vec3 Ma,float Na,vec3 Oa,float Pa){
	vec3 Qa=normalize(Oa+La);
	float Ra,Ya;
	Ra=dot(Qa,Ma);
	#ifdef _t
	const float Sa=.02/(4.*Z);
	float Ta=Sa*Pa;
	#else
	float Ua,Va,Wa,Ta;
	Ua=1.-dot(La,Qa);
	Va=Ua*Ua;
	Wa=.02+.98*Va*Va*Ua;
	const float Xa=1./(4.*Z);
	Ta=Wa*Xa*Pa;
	#endif
	Ya=exp(-2.*Pa*(1.-Ra))*Ta;
	#ifdef _v
	float Za,ab;
	Za=max(dot(Oa,Ma),.01);
	ab=max(Na,.01);
	return Ya*sqrt(Za/ab);
	#else
	return Ya;
	#endif
}
void Jb(vec3 La,vec3 Ma,vec3 Na,float Oa,vec3 Pa,vec3 Qa,float Ra,out vec3 Sa,out vec3 Ta){
	float Ua,Va;
	Ua=dot(La,Ma);
	Va=Ib(La,Ma,Ua,Na,1./Oa)*Ra;
	#ifdef _t
	const vec3 Wa=Fa/Z;
	Sa=Va*Pa;
	Ta=Wa*Qa;
	#else
	const float Xa=1./Z;
	vec3 Ya,Za;
	Ya=vec3(Hb(Ua,Oa));
	Za=(1.-Ya)*Fa;
	Sa=Va*Pa;
	Ta=(Ya+Za)*Qa*Xa;
	#endif
}
vec3 Jb(vec3 La,vec3 Ma,vec3 Na,float Oa,vec3 Pa,vec3 Qa,float Ra){
	vec3 Sa,Ta;
	Jb(La,Ma,Na,Oa,Pa,Qa,Ra,Sa,Ta);
	return Sa+Ta;
}
#endif
#ifdef _n
uniform samplerCube I;
uniform vec4 J;
float Kb(vec3 q,vec3 La,out vec3 Ma){
	float Na,Sa;
	Na=J.x;
	#ifdef _w
	float Oa,Pa;
	Oa=Na-ba;
	Pa=Oa/dot(q,La);
	#else
	float Qa,Ra,Pa;
	Qa=dot(q,La);
	Ra=dot(q,q)-Na*Na;
	Pa=sqrt(Qa*Qa-Ra)-Qa;
	#endif
	Ma=q+Pa*La;
	Sa=textureCube(I,Ma).g;
	Sa*=Sa;
	return Sa*J.w*J.y;
}
vec4 Lb(vec3 La,vec3 q,vec3 V,float Ka){
	vec3 Ma,Qa,Ra;
	float Na,Oa,Pa,Sa,Ta;
	Na=Kb(q,La,Ma);
	Oa=J.x;
	Pa=dot(normalize(Ma),V);
	Qa=qb(Oa,Pa).rgb*Ka;
	Ra=sb(Oa,Pa)*Ka;
	Ra=max(Ra,vec3(.004,.0046,.0067));
	Sa=J.z;
	Ta=.25+.75*max(Pa,0.);
	return vec4(Sa*(Qa*Ta+Ra),Na);
}
vec4 Lb(vec3 La,vec3 q,float Ma,vec3 Na,vec3 Oa){
	vec3 Pa;
	float Qa,Ra,Sa;
	Qa=Kb(q,La,Pa);
	Ra=J.z;
	Sa=.25+.75*max(Ma,0.);
	return vec4(Ra*(Na*Sa+Oa),Qa);
}
#endif
#ifdef _p
uniform float K;
float Mb(vec3 La,vec3 Ma,vec4 Na,vec3 F){
	vec3 Oa=F-La;
	float Pa,Qa,Ra,Sa;
	Pa=dot(Oa,Ma);
	Qa=sqrt(dot(Oa,Oa)-Pa*Pa);
	Ra=Na.x+Pa*Na.y;
	Sa=Na.z+Pa*Na.w;
	return mix(1.,smoothstep(Ra,Sa,Qa),K);
}
#endif
#ifdef _r
uniform vec3 L;
#endif
#ifdef _s
uniform float M,N;
#endif
#ifdef _m
uniform samplerCube O;
uniform float P;
#endif
#ifdef _p
uniform vec3 Q,R;
uniform vec4 S;
float Ka;
#endif
vec3 Nb(vec3 La,vec3 U,vec3 q,vec3 Ma,vec3 V,float f){
	#ifdef _s
	const vec3 Na=vec3(0,5,15)/255.;
	vec3 Oa=La+Na;
	vec2 Pa=Oa.bg-Oa.rr;
	bool Qa,Ra;
	Qa=all(greaterThan(vec2(.77,Oa.b),Oa.bg));
	Ra=all(greaterThan(Pa.rgr,vec3(Oa.b*.35,0,Pa.g*1.6666)));
	float Sa=all(bvec2(Qa,Ra))?N:0.;
	Sa*=step(dot(q.xz,vec2(.93,.37)),.98);
	#endif
	const float Ta=.55/Z;
	vec3 Ua,Wa,ab,bb,eb,ib;
	Ua=La*La*Ta;
	#ifdef _s
	const vec3 Va=1.7*Fa/Z;
	Ua=mix(Ua,Va,Sa);
	#endif
	Wa=normalize(q);
	float Xa,Ya,Za,db;
	Xa=e[2];
	Ya=Xa<1e7?length(q):ba;
	Za=dot(Wa,V);
	ab=qb(Ya,Za).rgb;
	bb=sb(Ya,Za);
	#ifdef _p
	Ka=Mb(Q,R,S,q);
	ab*=Ka;
	bb*=Ka;
	#endif
	const float cb=.014;
	db=smoothstep(0.,.2,-Za);
	eb=max(bb,cb*db);
	#ifdef _o
	vec3 fb;
	float gb=Kb(q,V,fb);
	gb=1.-min(1.,3.*gb);
	#else
	const float gb=1.;
	#endif
	#ifdef _q
	float hb=(dot(Ma,V)+Za)*.5;
	#else
	float hb=Za;
	#endif
	ib=Ua*(max(hb,0.)*ab*gb+eb);
	#ifdef _r
	#ifdef _q
	hb=dot(Ma,L);
	#else
	hb=dot(Wa,L);
	#endif
	ib+=Ua*cb*max(hb,0.);
	#endif
	#ifdef _s
	if(Sa>0.){
		vec3 jb,kb;
		jb=normalize(U-q);
		kb=Jb(jb,Wa,V,Ja,ab*gb,bb,1.);
		ib+=kb*M;
	}
	#endif
	#ifndef _l
	const vec3 jb=vec3(.2126,.7152,.0722);
	const vec3 kb=vec3(.874,.874,2.622);
	float lb=dot(ib,jb);
	ib=mix(lb*kb,ib,1.-.75*db);
	#endif
	vec4 mb=vec4(0);
	#ifdef _n
	if(e.x>J.x){
		vec3 nb=normalize(U-q);
		#ifdef _w
		mb=Lb(nb,q,Za,ab,bb);
		#else
		#ifdef _p
		mb=Lb(nb,q,V,Ka);
		#else
		mb=Lb(nb,q,V,1.);
		#endif
		#endif
		ib=mix(ib,mb.rgb,mb.a);
	}
	#endif
	#ifdef _m
	const vec3 nb=vec3(.01,.01,.005)*6.;
	float ob=clamp(-Za*5.,0.,1.);
	ob*=max(1.-1.25*mb.a,0.);
	ib+=nb*textureCube(O,q).g*ob*P;
	#endif
	#ifdef _p
	return Fb(ib,U,q,V,Ka,f);
	#else
	return Fb(ib,U,q,V,1.,f);
	#endif
}
#endif
#ifdef _d
uniform vec4 T;
vec3 Ob(vec4 r,sampler2D X){
	float La,Oa,Pa,Qa;
	La=3.141592653589793;
	vec3 Ma,Na,Sa;
	Ma=r.xyz/r.w;
	Na=normalize(Ma);
	Oa=atan(Na.x,Na.y)/(2.*La)+.5;
	Pa=acos(Na.z)/La;
	Qa=dot(Na,Ma);
	vec2 Ra=vec2(Oa,Pa);
	Sa=vec3(Ra*T.xy+T.zw,1)*Qa;
	return texture2DProj(X,Sa).rgb;
}
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
#ifdef _a
uniform vec3 U,V;
#endif
uniform sampler2D W;
#ifdef _d
uniform sampler2D X;
uniform float Y;
#endif

uniform float time;
uniform sampler2D orgTexture;

void main(){
	vec3 La=texture2D(W,m).rgb;
	#ifdef _c
	vec3 H=dot(n,n)>1e-6?normalize(n):vec3(0);
	#endif
	#ifdef _a
	#ifdef _c
	vec3 Ma=dot(H,vec3(1))!=0.?H:normalize(q);
	#else
	vec3 Ma=normalize(q);
	#endif
	vec3 Na=Nb(La,U,q,Ma,V,f);
	La=Gb(La,Na);
	#endif
	#ifdef _d
	vec3 Oa=Ob(r,X);
	La=mix(La,Oa,Y);
	#endif
	#ifdef _b
	gl_FragColor=vec4(La,o);
	#else
	gl_FragColor=vec4(La,1);
	#endif


	// ---------------------------
	#ifdef _a
	float theta1 = atan(q.y, q.x) * 40000.0 + time * 1.0;
	float theta2 = atan(q.z, sqrt(q.x * q.x + q.y * q.y)) * 40000.0;
	float light = sin(theta1) * sin(theta2);
	light = step(light, 0.0);

	float pi = acos(0.0) * 2.0;
	vec3 col1 = gl_FragColor.rgb;
	vec3 col2 = texture2D(orgTexture, vec2((atan(q.y, q.x) + pi) / (2.0 * pi), 0.0)).rgb;
	vec3 col = col1 * light + col2 * (1.0 - light);
	
	gl_FragColor=vec4(col, gl_FragColor.a);
	#endif
	// ---------------------------
}
`
};