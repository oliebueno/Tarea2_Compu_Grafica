// Functions that draw a triangle
function triangle() {
    
    // Create and Check canvas element
    const canvas = document.getElementById('canvasGL');
    canvas.style.width = '100%';
    canvas.style.height = '100vh';
    if(!canvas) {
        showError('Canvas not found');
        return;
    }

    // Initialize WebGL2 context
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        alert('Unable to initialize WebGL2. Your browser or machine may not support it.');
        return;
    }

    // Create vertices
    const vertices = [
        -0.5, -0.3, 0.0, // Botton left
        0.5, -0.3, 0.0,   // Botton right
        0.0, 0.57, 0.0   // top middle
    ]

    const colors = [
        0.0, 1.0, 0.0,  // Green (bottom left)
        0.0, 0.0, 1.0,  // Blue (bottom right)
        1.0, 0.0, 0.0,  // Red (top middle)
    ];

    // Create buffers for vertices
    const triangleGeoBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Create buffers for colors
    const triangleColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Create shaders
    const vertexShaderSource = `#version 300 es
                                precision mediump float;
                                in vec3 a_position;
                                in vec3 a_color;
                                out vec3 v_color;
                                void main() {
                                gl_Position = vec4(a_position.x,  a_position.y, a_position.z, 1.0);
                                v_color = a_color;
    }
    `;

    const fragmentShaderSource = `#version 300 es
                                precision mediump float;
                                in vec3 v_color;
                                out vec4 outColor;
                                void main() {
                                outColor = vec4(v_color, 1.0);
                                }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Vertex shader compilation failed: ', gl.getShaderInfoLog(vertexShader));
        return null;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader compilation failed: ', gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    // Create shader program
    const triangleProgram = gl.createProgram();
    gl.attachShader(triangleProgram, vertexShader);
    gl.attachShader(triangleProgram, fragmentShader);
    gl.linkProgram(triangleProgram);
    if (!gl.getProgramParameter(triangleProgram, gl.LINK_STATUS)) {
        console.error('Shader program linking failed: ', gl.getProgramInfoLog(triangleProgram));
        return null;
    }

    // Get attribute locations
    const positionAttributeLocation = gl.getAttribLocation(triangleProgram, 'a_position');
    if (positionAttributeLocation === -1) {
        console.error('Failed to get the attribute location for a_position');
        return null;
    }

    // Get attribute color location
    const colorAttributeLocation = gl.getAttribLocation(triangleProgram, 'a_color');
    if (colorAttributeLocation === -1) {
        console.error('Failed to get the attribute location for a_color');
        return null;
    }

    // Output merger
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    gl.clearColor(0.1059, 0.1176, 0.1686, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    // Rasterizer
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set GPU program
    gl.useProgram(triangleProgram);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);

    // Bind vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 3*Float32Array.BYTES_PER_ELEMENT, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 3*Float32Array.BYTES_PER_ELEMENT, 0);

    // Draw triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

}

// Call de main function
triangle();
