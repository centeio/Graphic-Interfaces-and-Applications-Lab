attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

float getPosition(float nDiv, float coord)
{
	float pos = floor(coord * nDiv);

	if(pos == nDiv)
		pos = pos - 1.0;	
	
	return pos;
}

void main() {
	vTextureCoord = aTextureCoord;		

	vec3 v = vec3(0.0,0.0,0.0);

	float posU = getPosition(du, vTextureCoord.s);
	float posV = getPosition(dv, vTextureCoord.t);
	
	if(posU == su && posV == sv)
		v.z = 0.05;
		
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+v, 1.0);

}

