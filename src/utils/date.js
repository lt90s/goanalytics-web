var moment = require('moment')

var dateUtils = {
  todayTimestamp: () => {
    const format = 'YYYY-M-D'
    const date = moment().utcOffset(8).format(format)
    return moment(date, format).unix()
  },
  nowHour: () => {
    const date = moment().utcOffset(8)
    return date.hour()
  },
  timeStampToString: ts => {
    return moment.unix(ts).format('YYYY-MM-DD')
  }
}

export default dateUtils
