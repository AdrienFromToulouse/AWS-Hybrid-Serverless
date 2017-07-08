cmake_minimum_required(VERSION 3.0)

project(ServerlessSG)

set(VERSION_MAJOR 1)
set(VERSION_MINOR 0)

set(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/build/bin)

file(GLOB sources ${PROJECT_SOURCE_DIR}/src/*.cpp)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O2 -Wall -std=c++11")

add_executable(serverlessSG ${sources})

install(TARGETS serverlessSG DESTINATION bin)
