# homebridge-platform-energenie
[![NPM Version](https://img.shields.io/npm/v/homebridge-platform-energenie.svg)](https://www.npmjs.com/package/homebridge-platform-energenie)

[Energenie Pi-mote](https://energenie4u.co.uk/catalogue/product/ENER314) plugin for the [Homebridge](https://github.com/nfarina/homebridge) project based on [homebridge-platform-rcswitch](https://github.com/rainlake/homebridge-platform-rcswitch).

# Installation

1. Install [energenie](http://pythonhosted.org/energenie/#installation)
2. Install homebridge using: `npm install -g homebridge`
3. Install this plugin using: `npm install -g homebridge-platform-energenie`
4. Update your configuration file. See the sample below.

# Configuration

Configuration sample:

`delay` is the time in milliseconds between each command. As Pi-mote can only send one command at the time, this allows things like scenes with multiple commands to work by queueing the commands.

`switches` is the list of the commands to send for turning sockets on/off.

`persist_dir` is a folder which Homebridge can write to, if you would like to keep track of switch state between Homebridge restarts.

Note: Some sockets may respond only to `on` commands and turning on/off is done by using different socket id (usually when `n` is for on then `n+1` is for off).


 ```javascript
{
    "bridge": {
        "name": "#####",
        "username": "",
        "port": 51826,
        "pin": ""
    },

    "description": "",

    "platforms": [
        {
          "platform": "Energenie",
          "name": "Energenie Platform",
          "persist_dir": "/homebridge/node-persist",
          "delay": 500,
          "switches": [
                {
                        "name" : "Zap Plug Port 1",
                        "on": {
                                "command": "on",
                                "socket": 1
                        },
                        "off": {
                                "command": "off",
                                "socket": 1
                        }
                }
          ]
        }
    ]
}

```

# Credits

Credit goes to
- [python-energenie](https://github.com/RPi-Distro/python-energenie)
- [homebridge-platform-rcswitch](https://github.com/rainlake/homebridge-platform-rcswitch)

# License

Published under the MIT License.
