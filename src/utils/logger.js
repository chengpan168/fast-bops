/**
 * Created by chengpanwang on 2019/1/29.
 */
const level = 0;

const logger = {
  empty: () => {},
  debug: level < 1 ? console.debug.bind(this, '%cDEBUG ', 'color:#808695') : this.empty,
  info: level < 2 ? console.info.bind(this, '%cINFO ', 'color:#2db7f5') : this.empty,
  warn: level < 3 ? console.warn.bind(this, '%cWARN ', 'color:#ff9900') : this.empty,
  error: level < 4 ? console.error.bind(this, '%cERROR ', 'color:#ed4014') : this.empty,
};

export default logger;
