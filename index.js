const express = require('express')
const pg = require('pg')

// SmartQueue Limiter
const SmartQueue = require('smart-request-balancer');

const app = express()
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
const pool = new pg.Pool()

// SmartQueue configurations
const config = {
  rules: {
    // Settings for individual queries
    individual: {
      rate: 1,      // How many responses are allowed
      limit: 1,     // Limit per second
      priority: 1,  // Rule priority in the list. Two rules can fire simultaneously.
    },
    // Settings for multiple simultaneous queries
    group: {
      rate: 20,
      limit: 60,
      priority: 1,
    },
    // Settings for bots to broadcast
    broadcast: {
      rate: 30,
      limit: 1,
      priority: 2,
    }
  },
  // Total limits set for all the rules combined to ensure max limit is not reached.
  overall: {
    rate: 30,
    limit: 1,
  },
  retryTime: 300, // How many times it should retry.
  ignoreOverallOverheat: true, // Should it ignore if the queue is overheated or reached its overall API limit.
}

// SmartQueue will be initiated with its custom configurations by calling on `queue`
const queue = new SmartQueue(config);

const queryHandler = (req, res, next) => {
  queue(pool).query(req.sqlQuery).then((r) => {
    return res.json(r.rows || [])
  }).catch(next)
}

app.get('/', (req, res) => {
  res.send('Welcome to EQ Works 😎')
})

app.get('/events/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/events/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/stats/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/stats/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/poi', (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
  return next()
}, queryHandler)

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})
