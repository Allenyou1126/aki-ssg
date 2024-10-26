#!/bin/bash

cd deploy
git pull
rm -rf ./*
cp -r ../out/* ./
cp -r ../out/*.* ./
git add .
git commit -m "CI Auto Push"
git push