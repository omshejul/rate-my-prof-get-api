pm2 start /home/om/server/rate-my-prof-get-api/server.js --name "rate-my-prof" 

pm2 restart rate-my-prof && pm2 logs rate-my-prof

