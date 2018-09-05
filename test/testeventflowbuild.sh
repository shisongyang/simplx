#!/bin/bash

g++ testeventflow.cpp  $(find ../../simplx/src -name "*.cpp") -O0 -g -I ../../simplx/include/ -lpthread -otesteventflow

exit

(
mkdir -p build
cd build
find ../../simplx/src -name "*.cpp" -exec ln -f -s $(pwd)/{} \;
ln -f -s ../*.cpp $(pwd)/
ln -f -s ../*.h $(pwd)/

rm a.out

obj=$(find ./ -maxdepth 1 -name "*.cpp" -exec bash -c "file=\{};echo \${file%.*}.o" \; | tr '\n' ' ')
h=$(find ./ -maxdepth 1 -name "*.h" | tr '\n' ' ')



echo -e "%.o: %.cpp $h \n\tg++ -o \$@ -c -O0 -g $< -I ../simplx/include/\nall: $obj\n\tg++ $obj -lpthread" | make -j8 -f- && cp a.out ../

)
