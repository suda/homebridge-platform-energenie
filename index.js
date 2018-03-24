var Service, Characteristic, LastUpdate;
var energenie = require("energenie");
var CommandQueue = require('./lib/CommandQueue');
var storage = require('node-persist');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerPlatform("homebridge-platform-energenie", "Energenie", EnergeniePlatform);
}

function EnergeniePlatform(log, config) {
    var self = this;
    self.config = config;
    self.log = log;
    self.commandQueue = new CommandQueue(self.config.delay ? self.config.delay : 500);
    if (config.persist_dir) {
      storage.initSync({dir: config.persist_dir});
    }
}
EnergeniePlatform.prototype.accessories = function(callback) {
    var self = this;
    self.accessories = [];
    self.config.switches.forEach(function(sw) {
        self.accessories.push(new EnergenieAccessory(sw, self.log, self.config, self.commandQueue));
    });
    callback(self.accessories);
}

function EnergenieAccessory(sw, log, config, commandQueue) {
    var self = this;
    self.name = sw.name;
    self.sw = sw;
    self.log = log;
    self.config = config;
    self.commandQueue = commandQueue;
    if (self.config.persist_dir) {
      self.currentState = storage.getItemSync(self.name + '-state') || false;
    } else {
      self.currentState = false;
    }

    self.service = new Service.Switch(self.name);

    self.service.getCharacteristic(Characteristic.On).value = self.currentState;

    self.service.getCharacteristic(Characteristic.On).on('get', function(cb) {
        cb(null, self.currentState);
    }.bind(self));

    self.service.getCharacteristic(Characteristic.On).on('set', function(state, cb) {
        self.currentState = state;
        if (self.config.persist_dir) {
          storage.setItemSync(self.name + '-state', state);
        }
        if(self.currentState) {
          if(self.sw.on.command === "on") {
            self.commandQueue.queue(function() {
              energenie.switchOn(self.sw.on.socket);
            });
          } else {
            self.commandQueue.queue(function() {
              energenie.switchOff(self.sw.on.socket);
            });
          }
        } else {
          if(self.sw.on.command === "off") {
            self.commandQueue.queue(function() {
              energenie.switchOn(self.sw.off.socket);
            });
          } else {
            self.commandQueue.queue(function() {
              energenie.switchOff(self.sw.off.socket);
            });
          }
        }
        cb(null);
    }.bind(self));
}
EnergenieAccessory.prototype.getServices = function() {
    var self = this;
    var services = [];
    var service = new Service.AccessoryInformation();
    service.setCharacteristic(Characteristic.Name, self.name)
        .setCharacteristic(Characteristic.Manufacturer, 'Raspberry Pi')
        .setCharacteristic(Characteristic.Model, 'Raspberry Pi')
        .setCharacteristic(Characteristic.SerialNumber, 'Raspberry Pi')
        .setCharacteristic(Characteristic.FirmwareRevision, '1.0.0')
        .setCharacteristic(Characteristic.HardwareRevision, '1.0.0');
    services.push(service);
    services.push(self.service);
    return services;
}
