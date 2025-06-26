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
        'startDate': holiday.startDate,
        'startDate': holiday.endDate,
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
  let isSalaryChecked = data.isSalaryChecked;
  let timeStart = new Date(data.startDate + 'T' + data.startTime);
  let timeEnd = new Date(data.endDate + 'T' + data.endTime);
  let totalTimeWorked = 0;
  let hourDiff = (timeEnd.getHours() - timeStart.getHours());
  let minutesDiff = (timeEnd.getMinutes() - timeStart.getMinutes());
  let daysDiff = (dataEnd - dataStart);
  let salary = data.salary ? data.salary : 0;

  let days = daysDiff / (1000 * 3600 * 24); 
 
  let timeDiff = ((hourDiff * 60) + minutesDiff) / 60;

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
  }
  
  days++;

  totalTimeWorked = days * timeDiff;

  console.log(days, totalTimeWorked);
  console.log(salary);

  return {
    days: days,
    hours: totalTimeWorked,
    salary: (salary * totalTimeWorked),
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
    let salaryValue = document.querySelector("#salary").value;
    let workedHours = document.querySelector("#workedHours").value;

    if(isEmpty(startDate) || isEmpty(endDate)) {
      $.toast({
        heading: 'Error',
        text: 'Preencha as datas de inicio e fim',
        position: 'top-right',
        icon: 'error',
        stack: false
      });
      return;
    }

    if(isTimeChecked && (isEmpty(startTime) || isEmpty(endTime))){
      $.toast({
        heading: 'Error',
        text: 'Preencha as horas de inicio e fim',
        position: 'top-right',
        icon: 'error',
        stack: false
      });
      return;
    }

    if(isSalaryChecked && (isEmpty(salaryValue) || isEmpty(workedHours))) {
      $.toast({
        heading: 'Error',
        text: 'Preencha o salario e as horas de trabalho',
        position: 'top-right',
        icon: 'error',
        stack: false
      });
      return;
    }

    data = {
      'startDate': startDate,
      'endDate': endDate,
      'startTime': isTimeChecked ? startTime : '00:00',
      'endTime': isTimeChecked ? endTime : '00:00',
      'pauseDuration': isTimeChecked ? pauseInterval : 00,
      'isSameDate': (startDate === endDate),
      'isTimeChecked': isTimeChecked,
      'isSalaryChecked': isSalaryChecked, // isSalaryChecked
      'salary': salaryValue // isSalaryChecked
    };

    const [holidays, holidaysInfo] = await getHolidays(data);

    console.log("Holidays: ", holidays);
    console.log("Holidays Info: ", holidaysInfo);

    let variable = await countDays(data, holidays);
    let timestamp = new Date().toLocaleString();

    document.querySelector("#resultContainer").appendChild(document.createTextNode(timestamp + " Dias: " + variable.days));

    if (isTimeChecked) {
      document.querySelector("#resultContainer").appendChild(document.createTextNode(" Horas: " + variable.hours));
    }


    if (isSalaryChecked) {
      document.querySelector("#resultContainer").appendChild(document.createTextNode(" Salario: " + variable.salary));
    }

    document.querySelector("#resultContainer").appendChild(document.createElement("br"));

  });

});
