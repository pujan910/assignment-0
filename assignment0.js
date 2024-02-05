let GL;
let currColor = [0.0, 0.0, 0.0, 0.0];
let currTriangles = 1;
let positions = [];
let colors = [];
let useJSON = false;

function initializeWebGL() {
    const canvas = document.getElementById('canvas');
    GL = canvas.getContext('webgl');
    if (!GL) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    GL.viewport(0, 0, canvas.width, canvas.height);
}

function createShader(type, source) {
    const shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + GL.getShaderInfoLog(shader));
        GL.deleteShader(shader);
        return null;
    }
    return shader;
}

function initShaderProgram(vsSource, fsSource) {
    const vertexShader = createShader(GL.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(GL.FRAGMENT_SHADER, fsSource);
    const shaderProgram = GL.createProgram();
    GL.attachShader(shaderProgram, vertexShader);
    GL.attachShader(shaderProgram, fragmentShader);
    GL.linkProgram(shaderProgram);
    if (!GL.getProgramParameter(shaderProgram, GL.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + GL.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function createBuffer(data) {
    const buffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data), GL.STATIC_DRAW);
    return buffer;
}

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    varying lowp vec4 vColor;
    void main(void) {
        gl_Position = aVertexPosition;
        vColor = aVertexColor;
    }
`;

const fsSource = `
    varying lowp vec4 vColor;
    uniform lowp vec4 uColor;
    uniform bool useJsonColors;
    void main(void) {
        gl_FragColor = useJsonColors ? vColor : uColor;
    }
`;

function draw() {
    if (!positions.length) return;
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(vsSource, fsSource);
    GL.useProgram(shaderProgram);

    const positionBuffer = createBuffer(positions.slice(0, currTriangles * 9));
    const vertexPosition = GL.getAttribLocation(shaderProgram, 'aVertexPosition');
    GL.enableVertexAttribArray(vertexPosition);
    GL.bindBuffer(GL.ARRAY_BUFFER, positionBuffer);
    GL.vertexAttribPointer(vertexPosition, 3, GL.FLOAT, false, 0, 0);

const useJsonColorsUniform = GL.getUniformLocation(shaderProgram, 'useJsonColors');
GL.uniform1i(useJsonColorsUniform, useJSON ? 1 : 0); 

const uColorUniform = GL.getUniformLocation(shaderProgram, 'uColor');
GL.uniform4fv(uColorUniform, currColor);

    if (useJSON && colors.length) {
        const colorBuffer = createBuffer(colors.slice(0, currTriangles * 12)); 
        const vertexColor = GL.getAttribLocation(shaderProgram, 'aVertexColor');
        GL.enableVertexAttribArray(vertexColor);
        GL.bindBuffer(GL.ARRAY_BUFFER, colorBuffer);
        GL.vertexAttribPointer(vertexColor, 4, GL.FLOAT, false, 0, 0);
    }

    GL.drawArrays(GL.TRIANGLES, 0, currTriangles * 3); 
}

function updateColor() {
    currColor = [
        document.getElementById('sliderR').value / 255,
        document.getElementById('sliderG').value / 255,
        document.getElementById('sliderB').value / 255,
        1.0
    ];
    draw();
}

function updateTriangles() {
    currTriangles = parseInt(document.getElementById('sliderN').value);
    draw();
}

function uploadFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const json = JSON.parse(e.target.result);
        positions = json.positions;
        colors = json.colors; 
        document.getElementById('sliderN').max = positions.length / 9; 
        currTriangles = 1; 
        document.getElementById('sliderN').value = currTriangles;
        draw();
    };
    reader.readAsText(file);
}

function checkBox() {
    useJSON = document.getElementById('colorToggle').checked;
    draw();
}

function initialize() {
    initializeWebGL();
    document.getElementById('sliderR').addEventListener('input', updateColor);
    document.getElementById('sliderG').addEventListener('input', updateColor);
    document.getElementById('sliderB').addEventListener('input', updateColor);
    document.getElementById('sliderN').addEventListener('input', updateTriangles);
    document.getElementById('jsonInput').addEventListener('change', uploadFile);
    document.getElementById('colorToggle').addEventListener('change', checkBox);
}

window.onload = initialize;
