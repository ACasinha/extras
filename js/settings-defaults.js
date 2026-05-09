export const defaultSettings = {
  salary: {
    irsRate: 0.1162,
    ssRate: 0.11,
    adseRate: 0.035,
    clubTax: 1,
    mealAllowanceDaily: 6,
    salaryAdjustment: 0.8,
  },

  overtime: {
    firstHourRate: 1.25,
    remainingHoursRate: 1.375,
    holidayRate: 1.5,
  },

  formula: {
    monthsPerYear: 12,
    weeksPerYear: 52,
    weeklyHours: 28,
  },

  manual: {
    hourlyRateEnabled: false,
    hourlyRateValue: 0,
  },
}
