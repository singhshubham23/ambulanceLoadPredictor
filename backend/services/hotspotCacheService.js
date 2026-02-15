const cacheStore = {};
const CACHE_TTL = 5 * 60 * 1000; 

exports.getCache = (key) => {
  const cached = cacheStore[key];
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL) {
    delete cacheStore[key];
    return null;
  }

  return cached.data;
};

exports.setCache = (key, data) => {
  cacheStore[key] = {
    data,
    timestamp: Date.now()
  };
};
