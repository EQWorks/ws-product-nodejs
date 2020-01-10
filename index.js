const express = require('express')
const { Pool, Client } = require('pg')
const dotenv = require('dotenv');
const cors = require("cors");
dotenv.config();
const app = express();
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
app.use(cors());
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const queryHandler = (req, res, next) => {
  pool.query(req.sqlQuery).then((r) => {
    console.log(r.rows);
    return res.json({'data' : r.rows});
  }).catch(next); 
};

app.get('/', (req, res) => {
  res.send('Welcome to EQ Works 😎');
});

app.get('/events/hourly', (req, res, next) => {
  req.sqlQuery = `
  SELECT date, hour, events
  FROM public.hourly_events
  ORDER BY date, hour
  LIMIT 168;
`;
  pool.query(req.sqlQuery).then((r) => {
    const dates = {};
    dates['Week 1'] = {};
    for (let i = 1; i <= 6; i++) {
      let weeks = `Week ${i}`;
      dates[weeks] = {};
    }

    for (let i = 0; i < r.rows.length; i++) {
      const { hour, date, events } = r.rows[i];
      if (date <= new Date('2017-01-07')) {
        if (dates['Week 1'][hour] === undefined) {
          dates['Week 1'][hour] = events;
        } else {
          dates['Week 1'][hour] += events;
        }
      } else if (date > new Date('2017-01-07') && date <= new Date('2017-01-14')) {
        if (dates['Week 2'][hour] === undefined) {
          dates['Week 2'][hour] = events;
        } else {
          dates['Week 2'][hour] += events;
        }
      } else if (date > new Date('2017-01-14') && date <= new Date('2017-01-21')) {
        if (dates['Week 3'][hour] === undefined) {
          dates['Week 3'][hour] = events;
        } else {
          dates['Week 3'][hour] += events;
        }
      } else if (date > new Date('2017-01-21') && date <= new Date('2017-01-28')) {
        if (dates['Week 4'][hour] === undefined) {
          dates['Week 4'][hour] = events;
        } else {
          dates['Week 4'][hour] += events;
        }
      } else if (date > new Date('2017-01-28') && date <= new Date('2017-02-04')) { 
        if (dates['Week 5'][hour] === undefined) {
          dates['Week 5'][hour] = events;
        } else {
          dates['Week 5'][hour] += events;
        }
      } else if (date > new Date('2017-02-04') && date <= new Date('2017-02-11')) {
        if (dates['Week 6'][hour] === undefined) {
          dates['Week 6'][hour] = events;
        } else {
          dates['Week 6'][hour] += events;
        }
      }
    }
    return res.json({'data' : [dates]});
  }).catch(next);
});

app.get('/events/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next();
}, queryHandler);

app.get('/stats/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
    `;
  pool.query(req.sqlQuery).then((r) => {
    const dates = {};
    dates['Week 1'] = {};
    for (let i = 0; i < r.rows.length; i++) {
      const { hour, impressions, clicks, revenue } = r.rows[i];
      let newRev = parseFloat(revenue);
      if (dates['Week 1'][hour] === undefined) {
        dates['Week 1'][hour] = { 'impressions' : impressions, 'clicks' : clicks, 'revenue' : rounded };
      } else {
        dates['Week 1'][hour]['impressions'] += impressions;
        dates['Week 1'][hour]['clicks'] += clicks;
        dates['Week 1'][hour]['revenue'] += Math.round(newRev * 100) / 100;
      }
    }
    console.log(dates);
    return res.send({'data': dates})
  });
});

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
  `;
  pool.query(req.sqlQuery).then((r) => { 
    for (let i = 0; i < r.rows.length; i++) {
      let stats = r.rows[i]
      const { revenue } = stats;
      let newRev = parseFloat(revenue);
      stats['revenue'] = Math.round(newRev * 100) / 100;
    }
    console.log(r.rows);
    return res.send({'data': r.rows});
  });
});

app.get('/poi', (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
  return next()
}, queryHandler);

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
});

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})
