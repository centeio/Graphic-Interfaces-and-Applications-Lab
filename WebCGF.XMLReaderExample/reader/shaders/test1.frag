#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;


float getPosition(float nDiv, float coord)
{
	float pos = floor(coord * nDiv);
	
	if(pos == nDiv)
		pos = pos - 1.0;
	
	return pos;
}

void main() {

	vec4 color;
	float posU = getPosition(du, vTextureCoord.s);
	float posV = getPosition(dv, vTextureCoord.t);
	
	float x = posU + posV;
	float mod = x - 2.0 * floor(x/2.0);
	
	if(mod == 0.0)
		color = c1;
	else
		color = c2;
		
	if(posU == su && posV == sv)
		color = cs;		


	gl_FragColor = texture2D(uSampler, vTextureCoord);
	gl_FragColor.rgb = 0.5*(gl_FragColor.rgb + color.rgb);
	gl_FragColor.a = 1.0;
}


