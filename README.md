## Work Sample for Product Aspect, Node.js Variant

[What is this?](https://github.com/EQWorks/work-samples#what-is-this)

## Setup and Run

A few ways to get started, pick the one you're most comfortable with.

All approaches would require a set of environment variables that will be given to you in the problems email:

```bash
PGHOST=
PGPORT=
PGDATABASE=
PGUSER=
PGPASSWORD=
```

### Glitch

You can [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/EQWorks/ws-product-nodejs) now to get started.

This is the most recommended way since it's one of the easiest to setup (requiring zero local effort), as well the easiest to share.

### Local Node.js (6.10+)

0. Clone this repository
1. Install Node.js dependencies `$ npm install`
2. Set appropriate PostgreSQL environment variables according to https://www.postgresql.org/docs/9.6/static/libpq-envars.html
3. Run `$ npm run dev` and by default it should now be listening on port `5555`.
4. Open your browser and point to `localhost:5555` and you should see `Welcome to EQ Works 😎`

### Local Docker

0. Clone this repository
1. Store PostgreSQL environment variables into a `.env` file
2. Run `$ docker-compose up` (or `$ docker-compose up -d` to run in the background)
3. Open your browser and point to `localhost:5555` and you should see `Welcome to EQ Works 😎`

## Notes on working through the problems

Make sure any external dependencies are properly added into `package.json`. Unless otherwise specified, we welcome a healthy mix of your own implementations, and good choices of existing open-source libraries/tools.
