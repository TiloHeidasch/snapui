# SnapUI
SnapUI is an angular Snapcast UI that mainly targets mobile devices.

## Design
UX/UI concept was created by Maximilian Tränkner

## Usage
You can use SnapUI in different ways.

### Using SnapCast web server
First way is to use it natively on your snapcast server (recommended). to do that, clone or download this repo and adjust your /etc/snapserver.conf respectively:
Edit following lines:

        # which port the server should listen to
        port = 80
        # serve a website from the doc_root location
        doc_root = /path/to/snapui/dist/snapui/

### Using own web-server or ng-serve
Clone the repository.
Insert your snapcast IP and Port in `snapui/src/environments/environment.prod.ts` like:
        export const environment = {
            production: true,  
            snapcastIp: 'aaa.bbb.ccc.ddd',
            snapcastPort: 'xyz',
        };
Install node.
Install dependancies with `npm install`
Build the package with `npm build --prod`.
Point your webserver to the `dist/snapui` folder or copy it to your webservers root. Alternatively run `ng serve --host 0.0.0.0`

## Misuse of Server Data Structures
This UI saves configuration data like icons and maxVolume Information on the server side. It misuses the `client.name` and `group.name` attributes, to store that data.
Data is stored in JSON Format.
SnapUI properly parses this data, and migrates existing Information to its own datastructure. Nevertheless, it does not "unmigrate". So other UIs might report the Group Name and Client Name as a JSON Object.
To get rid of this, change the group/client Name (using a different UI/JSON-RPC) and do not use SnapUI again.