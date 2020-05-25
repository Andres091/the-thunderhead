#!/bin/bash

./updateCommands.sh && ./updateStatic.sh 
cd .. wget https://raw.githubusercontent.com/humboldt123/the-thunderhead/master/index.js
wget
node index.js