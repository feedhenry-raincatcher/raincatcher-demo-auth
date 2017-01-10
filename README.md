# FeedHenry RainCatcher Auth

An Authentication Service for RainCatcher based projects, can be used as mbaas service inside a Red Hat Mobile PLatform instance but also run in standalone mode for local development.

This repository should be used in conjunction with these following repos :

- [Portal Demo App](https://github.com/feedhenry-raincatcher/raincatcher-demo-portal)
- [Mobile Client Demo App](https://github.com/feedhenry-raincatcher/raincatcher-demo-mobile)
- [WFM Cloud App](https://github.com/feedhenry-raincatcher/raincatcher-demo-cloud)

## Setup (locally)

`npm install`

## Starting (locally)

`grunt`

## Seed data

This demo project is seeded with sample user data from [`lib/data.json`](./lib/data.json) upon initialization, make sure to replace this with your own data.

By default all example users' passwords is `'123'`.

# Data reset endpoint
This service exposes an additional endpoint that is intended for tests and demonstrations at `DELETE /admin/reset`, which causes the underlying data store to be reseeded with the original data for users.

Make sure to deactivate this endpoint when building your own solution on top of this demo, by editing [this file](./lib/routes/admin/index.js).