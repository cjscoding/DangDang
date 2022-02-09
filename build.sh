#!/bin/bash
echo "Build 시작"

source /etc/profile.d/gradle.sh

gradle -v

cd backend/dangdang

gradle bootJar

cd ../../
