# Days Calculator

A web-based utility to calculate the number of days, workdays, and hours between two dates. It also provides a simple salary estimation based on the calculated hours.

### [Try the live calculator here!](https://rubinhogomes.github.io/DaysCalculator/)

---

## Overview

This project provides a user-friendly interface for various date and time calculations. It's built with vanilla JavaScript, Bootstrap, and jQuery, and it leverages the OpenHolidaysAPI to provide more accurate workday calculations by excluding public holidays.

## Features

-   **Date Range Calculation**: Calculates the total number of days between a start and end date.
-   **Workday Calculation**:
    -   Excludes weekends (Saturdays and Sundays).
    -   Excludes public holidays for Portugal by fetching data from the [OpenHolidaysAPI](https://openholidaysapi.org/).
-   **Time & Hour Calculation**: Optionally calculates the total hours worked within the selected date range based on start and end times.
-   **Salary Estimation**: Optionally estimates salary based on the total hours worked and a given hourly rate.
-   **Responsive UI**: Built with Bootstrap for a clean and responsive layout on all devices.
-   **Light/Dark Theme**: Includes a theme toggler for user preference.

## How to Use

1.  Open the [calculator page](https://rubinhogomes.github.io/DaysCalculator/).
2.  Select a **Start Date** and an **End Date** using the date pickers.
3.  To calculate working hours, check the **"Do you want to calculate the time?"** box and input the start time, end time, and any pause duration in minutes.
4.  To estimate your salary, check the **"Do you want to calculate your salary?"** box and input your hourly salary and total worked hours.
5.  Click the **"Calculate Days"** button.
6.  The results will appear in the table below, showing total days, days without holidays, and days without weekends. If applicable, it will also show the calculated hours and salary.

## Technologies Used

-   **Frontend**: HTML, CSS, JavaScript
-   **Frameworks/Libraries**:
    -   [Bootstrap 5](https://getbootstrap.com/) for styling and components.
    -   [jQuery](https://jquery.com/) for DOM manipulation and events.
    -   [jQuery Toast](https://github.com/kamranahmedse/jquery-toast-plugin) for notifications.
-   **APIs**:
    -   [OpenHolidaysAPI](https://openholidaysapi.org/) for fetching public holiday data.

## Local Development

To run this project locally:

1.  Clone the repository:
    ```sh
    git clone https://github.com/RubinhoGomes/DaysCalculator.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd DaysCalculator
    ```
3.  Open the `index.html` file in your web browser.

## Credits

This project was created by Rubinho Gomes.
