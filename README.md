﻿# dust-nodejsWebservice

Local web service for DUST (nodejs)

## IIS setup

1.	Add IIS to a Windows 2012/2016/2019 server
1.	Install [nodejs](https://nodejs.org/en/download/)
1.	Install [URL Rewrite](https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=urlrewrite2) to IIS
1.	Install [Application Request Routing](https://www.microsoft.com/web/handlers/webpi.ashx?command=getinstallerredirect&appid=ARRv3_0) to IIS
1.	Configure [Reverse Proxy in IIS](https://tecadmin.net/set-up-reverse-proxy-using-iis/)

## Setup repo

```bash
git clone https://github.com/vtfk/dust-nodejswebservice.git
cd dust-nodejswebservice
npm i
```

## Setup environment variables

Create a `.env` file:

```bash
EXPRESS_PORT=3000
MAX_BUFFER=10240000
ACCEPTED_PATH_ROOT=<local-full-path-to-folder> # Called script must be inside this folder somehow
DUST_PATH=<local-full-path-to-folder-containing-the-scripts>
JWT_SECRET=<SuperDuperSecretSecretKey>
```

`MAX_BUFFER` is total bytes to accept in stdout

## Usage

[👉🏼 Head over here to see usage](./USAGE.md)
