#!/bin/bash

cd back
screen -dm -S back bash -c "cargo run --release"

cd ../front
screen -dm -S front bash -c "npm run start"
