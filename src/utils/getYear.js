export function getYears() {
  var max = new Date().getFullYear();
  var min = max - 60;
  var years = [];

  for (var i = max; i >= min; i--) {
    const value = {
      smID: i,
      name: i,
    };
    years.push(value);
  }
  return years;
}

export function getExpn() {
  const years = []
  for (let i = 0; i <= 55; i++) {
    const value = {
      smID: i,
      name: i,
    };
    years.push(value);
  }
  return years;
}
export function getMonths() {
  const arr = [
    { name: "January", hmID: "1" },
    { name: "February", hmID: "2" },
    { name: "March", hmID: "3" },
    { name: "April", hmID: "4" },
    { name: "May", hmID: "5" },
    { name: "June", hmID: "6" },
    { name: "July", hmID: "7" },
    { name: "August", hmID: "8" },
    { name: "September", hmID: "9" },
    { name: "October", hmID: "10" },
    { name: "November", hmID: "11" },
    { name: "December", hmID: "12" },
  ];
  return arr;
}

export function getNoticePeriod() {
  const arr = [
    { name: "Available Immediately", hmID: "Available Immediately" },
    { name: "Less than 8 days", hmID: "Less than 8 days" },
    { name: "15 days", hmID: "15 days" },
    { name: "30 days", hmID: "30 days" },
    { name: "45 days", hmID: "45 days" },
    { name: "2 months", hmID: "2 months" },
    { name: "3 months", hmID: "3 months" },
    { name: "4 months", hmID: "4 months" },
    { name: "5 months", hmID: "5 months" },
    { name: "6 months", hmID: "6 months" },
  ];
  return arr;
}
export function getFromTime () {
  const fromTime = [
    "12 AM",
    "01 AM",
    "02 AM",
    "03 AM",
    "04 AM",
    "05 AM",
    "06 AM",
    "07 AM",
    "08 AM",
    "09 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "01 PM",
    "02 PM",
    "03 PM",
    "04 PM",
    "05 PM",
    "06 PM",
    "07 PM",
    "08 PM",
    "09 PM",
    "10 PM",
    "11 PM",
  ];
  return fromTime
}

export const Salary = () => {
  const salary = []
  for (var i = 0; i < 101; i++) {
    const value = {
      name: i,
    };
    salary.push(value);
  }
  return salary;
}