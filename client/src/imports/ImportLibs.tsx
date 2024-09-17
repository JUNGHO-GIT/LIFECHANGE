// ImportLibs.tsx

import axios from "axios";
import { parseISO, formatISO } from "date-fns";
import numeral from 'numeral';
import moment, { Moment } from "moment-timezone";
import Calendar from "react-calendar";
import { getCountryForTimezone } from "countries-and-timezones";
import { getAllInfoByISO } from "iso-country-currency";

// -------------------------------------------------------------------------------------------------
export {
  axios,
  parseISO,
  formatISO,
  numeral,
  moment,
  Moment,
  Calendar as CalendarReact,
  getCountryForTimezone,
  getAllInfoByISO,
};