'use strict';

var _ = require('lodash');
var mdns = require('mdns');
var Client                = require('castv2-client').Client;
var Youtube               = require('castv2-youtube').Youtube;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;

var browser = mdns.createBrowser(mdns.tcp('googlecast'));

exports.findDevices = function(callback){
  var devices = [];
  browser.on('serviceUp', function(service) {
    var newDevice = _.pick(service, ['name', 'host', 'port', 'addresses']);
    newDevice['addresses'] = newDevice['addresses'][0];
    devices.push(newDevice);
  });
  browser.start();

  // 100 milisegundos de búsqueda
  setTimeout(function(){
    browser.stop();
    // Hack?!
    browser = mdns.createBrowser(mdns.tcp('googlecast'));
    callback(devices);
  }, 100);
}

exports.setContent = function setContent(content){
  browser.on('serviceUp', function(host) {
    var client = new Client();
    client.connect(host, function() {
      launchPlayer(client, content);
      client.on('error', function(err) {
        console.log('Error: %s', err.message);
        client.close();
      });
    // ToDo esto no va aquí, mas abajo, al sur
    browser.stop();
    browser = mdns.createBrowser(mdns.tcp('googlecast'));
    });
  });
  browser.start();
}

function launchPlayer(client, content){
  // Control de player
  launchDefaultMediaPlayer(client);
}

function launchYoutube(client){
  client.launch(Youtube, function(err, player) {
    player.load('vk_965FrnF0');
    player.on('status', function(status) {
      console.log('status youtube', status);
    });
  });
}

function launchDefaultMediaPlayer(client){
  client.launch(DefaultMediaReceiver, function(err, player){
    var media = {
      // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
      contentId: 'https://d0.awsstatic.com/events/aws-hosted-events/2015/Spain/logo%20beeva%20vertical%20RGB.jpg'
    };

    player.on('status', function(status) {
      console.log('status broadcast playerState=%s', status.playerState);
    });

    player.load(media, { autoplay: true }, function(err, status) {
      console.log('media loaded playerState=%s', err, status);
    });

  });
}