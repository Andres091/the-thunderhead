#!/bin/bash

./updateCommands.sh && ./updateStatic.sh 
cd .. && rm index.js
wget https://raw.githubusercontent.com/humboldt123/the-thunderhead/master/index.js
node index.js