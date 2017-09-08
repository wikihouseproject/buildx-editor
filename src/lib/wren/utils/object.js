const mutatingMap = (obj, fn) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        mutatingMap(obj[key], fn);
      } else {
        obj[key] = fn(obj[key]);
      }
    }
  }
  return obj;
};

module.exports = {
  mutatingMap
};
