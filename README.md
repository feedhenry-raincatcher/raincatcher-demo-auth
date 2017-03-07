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

## Seed data

This demo project is seeded with sample user data from [`lib/data.json`](./lib/data.json) upon initialization, make sure to replace this with your own data.

By default all example users' passwords is `'123'`.

# Data reset endpoint
This service exposes an additional endpoint that is intended for tests and demonstrations at `DELETE /admin/reset`, which causes the underlying data store to be reseeded with the original data for users.

**WARNING**: The above endpoint delete all data created during the life of the application. This is intended for development purposes only. Do not use this for production applications.

Make sure to deactivate this endpoint when building your own solution on top of this demo, by editing [this file](./lib/routes/admin/index.js).