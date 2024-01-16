
let GL, vao, program1, program2;
let currColor = [0, 0, 0, 0];
let currTriangles = 1;
let maxTriangles = 1;
let useJSON = false;

window.updateTriangles = function() {
}

window.updateColor = function() {

}

window.checkBox = function() {
    
}

function uploadFile(event) {
    // load file and create buffers
}

async function createPrograms() { 
    // create vertex and fragment shaders, create programs
}

function createShader(source, type) {
    // create shader
};

function createBuffer(vertices) {
    // create buffer
}

function createVAO(posAttribLoc, posBuffer, colAttribLoc, colBuffer) {
    // create vertex array
}

function draw() {

    // bind vao
    // use program
    // draw arrays
};

async function initialize() {

    // initialive canvas
    // create programs
    // draw
};
 
window.onload = initialize;
