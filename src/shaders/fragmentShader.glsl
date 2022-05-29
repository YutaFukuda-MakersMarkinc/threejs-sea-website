uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;


void main() {
    //色のコントランストをはっきりさせる
    float mixStrengthColor = (vElevation + uColorOffset) * uColorMultiplier;


    //波の明るい部分と暗い部分の色を設定する※色の調合
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrengthColor);//第一引数に一色目、第二引数に二色目、第三引数にそれぞれの色の割合（0〜1）


    //Planegeometryの色を指定
    gl_FragColor = vec4(color, 1.0);

    
}