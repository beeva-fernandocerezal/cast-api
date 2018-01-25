FROM resin/raspberrypi3-node:onbuild

RUN sudo npm install -g pm2

WORKDIR /usr/src/app
COPY package.json package.json
RUN JOBS=MAX npm install --production --unsafe-perm 
COPY . ./
COPY bi-contents /usr/src/app
COPY bi-contents/bi-schedule.cron /etc/cron.d/
RUN chmod +x /usr/src/app/bi-contents/*.sh
ENV INITSYSTEM on
CMD ["npm", "start"]
