import moment from "moment";

export function convertDate(date) {
  date = moment.unix(date);

  return moment.unix(moment().unix()).isSame(date, "date")
    ? date.format("HH:mm")
    : date.format("DD.MM.YYYY");
}
