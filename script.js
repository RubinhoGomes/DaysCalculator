// Author: Rubinho
// Date: 25-05-2025

// @param: data => {'starTime', 'endTime', 'countryCode', 'subDivisionCode'}
// @brief: This functions gets all the holidays between two dates in a region / country
const getHolidays = async (data) => {
  "use strict";
  let startDate = data.startDate;
  let endDate = data.endDate;
  let countryCode = data.countryCode ? data.countryCode : 'PT';
  let subDivisionCode = data.subDivisionCode ? data.subDivisionCode : 'PT-PT'

  const requestUrl = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${countryCode}&validFrom=${startDate}&validTo=${endDate}&languageIsoCode=${countryCode}&subdivisionCode={subDivisionCode}`

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


// @param: data => array, promiseHolidays => promise
// @brief: This function is to count the days between two dates and remove te holidays to calculate the workdays
// TODO: Implement the countDays to ignore the weekends not the holidays alone
// Implement probably the getDay with the days diff. This way you go trough all the "days known" and decrement the weekends
const countDays = async (data, promiseHolidays) => {
  let days = 0;

  let dataStart = new Date(data.startDate);
  let dataEnd = new Date(data.endDate);
  let timeStart = data.startTime;
  let timeEnd = data.endTime;
  let timeDiff = (timeEnd - timeStart) - data.pauseDuration;
  let daysDiff = dataEnd - dataStart;
  let totalTimeWorked = 0;
  days = daysDiff / (1000 * 3600 * 24); 

  const holidays = await promiseHolidays;

  console.log(holidays);

  holidays.forEach(holiday => {
    days--;
  });
 
  for (let i = days; i >= 0; i--){
    let currentDate = new Date(dataStart);
    currentDate.setDate(currentDate.getDate() + i);

    // console.log(currentDate); To see the current date being checked

    // Check if the current date is a weekend (Saturday or Sunday)
    if (currentDate.getDay() == 0 || currentDate.getDay() == 6) {
      days--;
    }
  }
  
  totalTimeWorked = days * timeDiff;

  console.log(days, totalTimeWorked);

  return {
    'days': days,
    'totalHours': totalTimeWorked
  };

}


document.addEventListener("DOMContentLoaded", () => {
  data = {
    'startDate': '2025-04-07',
    'endDate': '2025-07-24',
    'startTime': 09,
    'endTime': 18,
    'pauseDuration': 1
  };

  const holidays = getHolidays(data);
  
  console.log(countDays(data, holidays))

});
