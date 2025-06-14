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
  let holidaysInfo = [];
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
      holidaysInfo[i] = {
        'name': holiday.name,
        'date': holiday.startDate,
        'subDivision': subDivisionCode
      }
    });

    return [holidays, holidaysInfo];

  } catch (error) {
    console.error(error.message);
  }

};

// @param: data => array, promiseHolidays => promise
// @brief: This function is to count the days between two dates and remove te holidays to calculate the workdays
// TODO: Implement the countDays to ignore the weekends not the holidays alone
// Implement probably the getDay with the days diff. This way you go trough all the "days known" and decrement the weekends
const countDays = async (data, promiseHolidays) => {
  let dataStart = new Date(data.startDate);
  let dataEnd = new Date(data.endDate);
  let sameDate = data.isSameDate;
  let isTimeChecked = data.isTimeChecked;
  let timeStart = data.startTime;
  let timeEnd = data.endTime;
  let totalTimeWorked = 0;
  let timeDiff = (timeEnd - timeStart) - data.pauseDuration;
  let daysDiff = (dataEnd - dataStart);

  let days = daysDiff / (1000 * 3600 * 24); 
 

  const holidays = await promiseHolidays;

  
  if(!isEmpty(holidays)) {
    holidays.forEach(holiday => {
      days--;
    });
  }
 
  if(!sameDate) {
    for (let i = days; i >= 0; i--){
      let currentDate = new Date(dataStart);
      currentDate.setDate(currentDate.getDate() + i);

      if (currentDate.getDay() == 0 || currentDate.getDay() == 6) {
        days--;
      }
    }
  } else  {
    days++;
  }
  
  totalTimeWorked = days * timeDiff;

  console.log(days, totalTimeWorked);

  return {
    days: days,
    hours: totalTimeWorked
  };

}

const isEmpty = (data) => {
  return (data == '' || data == null || data == undefined || data.lenght == 0 )
}

document.addEventListener("DOMContentLoaded", async () => {

  const calculateBtn = document.querySelector("#calculateDays");

  calculateBtn.addEventListener("click", async () => {
    
    let startDate = document.querySelector("#startDate").value;
    let endDate = document.querySelector("#endDate").value;

    let isSalaryChecked = document.querySelector('#salaryCheck').checked;
    let isTimeChecked = document.querySelector('#timeCheck').checked;
    let startTime = document.querySelector("#startTime").value;
    let endTime = document.querySelector("#endTime").value;
    let pauseInterval = document.querySelector("#pauseDuration").value;

    if(isEmpty(startDate) || isEmpty(endDate)) {
      alert('Preencha a data do inicio e fim');
      return;
    }

    if(isTimeChecked && (isEmpty(startTime) || isEmpty(endTime))){
      alert('Preencha o tempo do inicio e fim do seu horario')
      return;
    }

    if(isSalaryChecked && isEmpty(salary)) {
      alert('Preencha o salario');
      return;
    }

    console.log("Start Time: " + startTime);
    console.log("End Time: " + endTime);

    data = {
      'startDate': startDate,
      'endDate': endDate,
      'startTime': isTimeChecked ? startTime : '00:00',
      'endTime': isTimeChecked ? endTime : '00:00',
      'pauseDuration': isTimeChecked ? pauseInterval : 00,
      'isSameDate': (startDate === endDate),
      'isTimeChecked': isTimeChecked,
      'isSalaryChecked': false // isSalaryChecked
    };

    const [holidays, holidaysInfo] = await getHolidays(data);

    console.log("Holidays: ", holidays);
    console.log("Holidays Info: ", holidaysInfo);

    let variable = await countDays(data, holidays);

    const paragraph = document.createElement("p");

    paragraph.appendChild(document.createTextNode("Dias: " + variable.days));
    document.body.appendChild(paragraph);

    if (isTimeChecked) {
      paragraph.appendChild(document.createTextNode(" Horas: " + variable.hours));
      document.body.appendChild(paragraph);
    }

  });

});
