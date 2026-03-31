#!/bin/bash
export NVM_DIR="/home/magdesian-victor/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd /home/magdesian-victor/htdocs/victor.magdesian.com.br
exec npm start -- --port 3000
