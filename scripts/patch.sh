#!/bin/bash

./updateCommands.sh && ./updateStatic.sh 
wget https://raw.githubusercontent.com/humboldt123/the-thunderhead/master/index.js && cd ..
node index.js