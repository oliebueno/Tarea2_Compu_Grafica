/*Standar libraries*/
#include <iostream>

/*OpenGL libraries*/
#include <glad/glad.h>
#include <GLFW/glfw3.h>

using namespace std;

/*Callback function for window size changes*/
void framebuffer_size_callback(GLFWwindow* window, int width, int height);

/*Callback function for keyboard input events*/
void processInputEvents(GLFWwindow* window);

/* Main  function */
int main()
{
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 1);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    /*Create a window*/
    GLFWwindow* window = glfwCreateWindow(800, 600, "triangle", NULL, NULL);
    if (window == NULL) 
    {
        cout << "Failed to create GLFW window" << endl;
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);

    /*Load OpenGL functions*/
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        cout << "Failed to initialize GLAD" << endl;
        return -1;
    }

    /*Set vertex buffer object (VBO) data*/
    float vertices[] = {
        -0.4f, -0.4f, 0.0f, // left bottom corner
        0.0f, 1.0f, 0.0f,   // green
        0.4f, -0.4f, 0.0f,  // right bottom corner
        0.0f, 0.0f, 1.0f,   // blue
        0.0f,  0.47f, 0.0f, // top center
        1.0f, 0.0f, 0.0f    // red
    };

    /*Create buffer*/
    unsigned int vbo;
    glGenBuffers(1, &vbo);
    glBindBuffer(GL_ARRAY_BUFFER, vbo);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    /* Create vertex array object */
    unsigned int vao;
    glGenVertexArrays(1, &vao);
    glBindVertexArray(vao);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6*sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6*sizeof(float), (void*)(3*sizeof(float)));
    glEnableVertexAttribArray(1);
    glBindVertexArray(0);

    /* Create shaders*/
    const char *vertexShaderSource = "#version 330 core\n"
                                    "layout (location = 0) in vec3 aPos;\n"
                                    "layout (location = 1) in vec3 aColor;\n"
                                    "out vec3 vertexColor;\n"
                                    "void main()\n"
                                    "{\n"
                                    "gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
                                    "vertexColor = aColor;\n"
                                    "}\0";

    const char *fragmentShaderSource = "#version 330 core\n"
                                    "out vec4 FragColor;\n"
                                    "in vec3 vertexColor;\n"
                                    "void main()\n"
                                    "{\n"
                                    "FragColor = vec4(vertexColor, 1.0);\n"
                                    "}\n";



    unsigned int vertexShader, fragmentShader;


    vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    glCompileShader(vertexShader);

    fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
    glCompileShader(fragmentShader);

    int success;
    char infoLog[512];
    glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
    if(!success)
    {
        glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
        cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n" << infoLog << endl;
    }

    glGetProgramiv(fragmentShader, GL_LINK_STATUS, &success);
    if(!success) 
    {
        glGetProgramInfoLog(fragmentShader, 512, NULL, infoLog);
        cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n" << infoLog << endl;
    }

    /*Create shader program*/
    unsigned int shaderProgram;
    shaderProgram = glCreateProgram();

    glAttachShader(shaderProgram, vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);

    glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
    if(!success) 
    {
        glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
        cout << "ERROR::SHADER::PROGRAM::COMPILATION_FAILED\n" << infoLog << endl;
    }

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);

    glUseProgram(shaderProgram);

    /*Rendering loop*/
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
    while (!glfwWindowShouldClose(window))
    {
        /*input*/
        processInputEvents(window);

        // Rendering
        glClearColor(0.1059f, 0.1176f, 0.1686f, 0.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        /*Draw triangle*/
        glBindVertexArray(vao);
        glDrawArrays(GL_TRIANGLES, 0, 3);
        glBindVertexArray(0);

        /*check  and call OpenGL's events*/
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    /*Clean up and exit*/
    glDeleteVertexArrays(1, &vao);
    glDeleteBuffers(1, &vbo);
    glDeleteProgram(shaderProgram);
    glfwTerminate();
    return 0;
}

/*Callback function for window size changes*/
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    glViewport(0, 0, width, height);
}

/*Callback function for keyboard input events*/
void processInputEvents(GLFWwindow* window)
{
    if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, true);
    }
}
