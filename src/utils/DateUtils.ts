import moment from 'moment';

/// This will return the date with given day and month that is the next following after the given "afterDate"
/// It will return the start of the day, if time information isn't preserved, which is the default
export function nextDateOfYearAfterDate(
  dayOfMonth: number,
  month: number,
  afterDate: moment.Moment,
  preserveTimeInformation = false
) {
  const resultDate = afterDate.clone();

  if (!preserveTimeInformation) {
    resultDate.startOf('day');
  }

  resultDate.month(month).date(dayOfMonth);

  if (afterDate.clone().month(month).date(dayOfMonth).isAfter(afterDate)) {
    return resultDate;
  }
  return resultDate.year(afterDate.clone().add(1, 'year').year());
}
