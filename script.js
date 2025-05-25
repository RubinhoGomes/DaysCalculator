// Author: Rubinho
// Date: 25-05-2025

// @param: data => {'starTime', 'endTime', 'countryCode', 'subDivisionCode'}
// @brief: This functions gets all the holidays between two dates in a region / country
const getHolidays = async (data) => {
  "use strict";
  let startTime = data.startTime;
  let endTime = data.endTime;
  let countryCode = data.countryCode ? data.countryCode : 'PT';
  let subDivisionCode = data.subDivisionCode ? data.subDivisionCode : 'PT-PT'

  const requestUrl = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${countryCode}&validFrom=${startTime}&validTo=${endTime}&languageIsoCode=${countryCode}&subdivisionCode={subDivisionCode}`

  let holidays = [];
  let i = 0;

 try {
    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    json.forEach(holiday => {
      holidays[i] = holiday.startDate;
      i++;
    });

    return holidays;

  } catch (error) {
    console.error(error.message);
  }

};


// TODO: Implement the countDays to ignore the weekends not the holidays alone
// Implement probably the getDay with the days diff. This way you go trough all the "days known" and decrement the weekends
// @param: data => array, promiseHolidays => promise
// @brief: This function is to count the days between two dates and remove te holidays to calculate the workdays
// STILL IN PROGRESS
const countDays = async (data, promiseHolidays) => {
  let days = 0;

  let dataStart = new Date(data.startTime);
  let dataEnd = new Date(data.endTime);
  let timeDiff = dataEnd - dataStart;
  days = timeDiff / (1000 * 3600 * 24); 

  const holidays = await promiseHolidays;

  console.log(holidays);

  holidays.forEach(holiday => {
    days--;
  });
  

  console.log(days)

  return days;

}


document.addEventListener("DOMContentLoaded", () => {
  data = {
    'startTime': '2025-04-07',
    'endTime': '2025-07-24'
  };

  const holidays = getHolidays(data);
  
  console.log(countDays(data, holidays))

});
