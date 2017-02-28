# FeedHenry RainCatcher Auth

An Authentication Service for RainCatcher based projects, can be used as mbaas service inside a Red Hat Mobile PLatform instance but also run in standalone mode for local development.

This repository should be used in conjunction with these following repos :

- [Portal Demo App](https://github.com/feedhenry-raincatcher/raincatcher-demo-portal)
- [Mobile Client Demo App](https://github.com/feedhenry-raincatcher/raincatcher-demo-mobile)
- [WFM Cloud App](https://github.com/feedhenry-raincatcher/raincatcher-demo-cloud)


## Setup 
  This service requires `FH_MONGODB_CONN_URL` environment variable to be a valid mongodb connection string.
  It can be made available through upgrading database in the Data Browser part of RHMAP [data browser upgrade docs](https://access.redhat.com/documentation/en/red-hat-mobile-application-platform-hosted/3/single/server-side-developer-guide/#upgrading-the-database).

## Setup (locally)

`npm install`

## Starting (locally)

`grunt`
