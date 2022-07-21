require('dotenv').config();
const express = require('express');
const pg = require('pg');

const app = express();
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html

class TokenBucket {
  constructor(capacity, fillPerSecond) {
    this.capacity = capacity;
    this.tokens = capacity;
    setInterval(() => this.addToken(), 1000 / fillPerSecond);
  }

  addToken() {
    if (this.tokens < this.capacity) {
      this.tokens += 1;
    }
  }

  take() {
    if (this.tokens > 0) {
      this.tokens -= 1;
      return true;
    }

    return false;
  }
}
function limitRequests(perSecond, maxBurst) {
  const buckets = new Map();

  // Return an Express middleware function
  return function limitRequestsMiddleware(req, res, next) {
    if (!buckets.has(req.ip)) {
      buckets.set(req.ip, new TokenBucket(maxBurst, perSecond));
    }

    const bucketForIP = buckets.get(req.ip);
    if (bucketForIP.take()) {
      next();
    } else {
      res.status(429).send('Client rate limit exceeded');
    }
  };
}
const pool = new pg.Pool();

const queryHandler = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  pool
    .query(req.sqlQuery)
    .then((r) => {
      return res.json(r.rows || []);
    })
    .catch(next);
};

app.get('/', limitRequests(2, 3), (req, res) => {
  res.send('Welcome to EQ Works 😎');
});

app.get(
  '/events/hourly',
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 287;
  `;
    return next();
  },
  queryHandler
);

app.get(
  '/events/daily',
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 70;
  `;
    return next();
  },
  queryHandler
);

app.get(
  '/stats/hourly',
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 815;
  `;
    return next();
  },
  queryHandler
);

app.get(
  '/stats/daily',
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 61;
  `;
    return next();
  },
  queryHandler
);

app.get(
  '/poi',
  (req, res, next) => {
    req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `;
    return next();
  },
  queryHandler
);

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`);
  }
});

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  process.exit(1);
});
