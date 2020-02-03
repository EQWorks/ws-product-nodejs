const serverLimiter = {
  
  limit: null,
  hitCount: 0,
  period: 60000,
  
  resetCountAsync() {
    setInterval(() => {
      this.hitCount = 0;
      console.log('resetting');
    }, this.period);
  },

  evaluateCountAndHandleLimit(res) {
    this.hitCount++;
    if(this.hitCount > this.limit) {
      res.status(439);
      res.send('Server is being throttled. Please wait and try again.');
      return true;
    }
    return false;
  }
};

module.exports = { serverLimiter };