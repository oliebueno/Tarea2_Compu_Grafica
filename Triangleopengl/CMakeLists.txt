cmake_minimum_required(VERSION 3.10)

project(TriangleOpenGL)

set(CMAKE_CXX_STANDARD 11)

add_executable(triangle
               src/glad.c
               src/triangle.cpp)

set(INCLUDE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/include")

target_include_directories(triangle PUBLIC ${INCLUDE_DIR})
target_link_libraries(triangle glfw)