# SAA Milk Recording App

This application has been built with ionic 4

### Link

https://github.com/autosapien/saa-milk

## Installation

Clone the repo and install

```sh
git clone https://github.com/autosapien/saa-milk.git
ch saa-milk
npm install
```

## Build

Todo

## Develop

Install Vanilla ionic 4

```sh
ionic start saa-milk tabs --type=angular
cd saa-milk
```

Add platforms that you want

```sh
ionic cordova platform add android
ionic cordova platform add ios
```

Update the config.xml file with your bundle id

Install Native Google Plus sign in. See https://github.com/EddyVerbruggen/cordova-plugin-googleplus
Note: The variables will need to changed as per your Google Developer Console Values. "REVERSED_CLIENT_ID" can be found under ios, "WEB_APPLICATION_CLIENT_ID" can be found under web (do not use from android or ios)

```sh
ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.302690628886-di3k8s785acpu16ebdljvskar5508an8 --variable WEB_APPLICATION_CLIENT_ID=302690628886-t6ir7c1i349kce9qp2umiqhi1d9vdcck.apps.googleusercontent.com

npm install --save @ionic-native/google-plus
```