cd ..
echo Starting Up...
pm2 delete all
pm2 start index.js
pm2 save
