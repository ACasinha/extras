import { settings } from './settings.js'

export function calculateSalary(data) {
  const hourlyRate =
    settings.manual.hourlyRateEnabled
      ? settings.manual.hourlyRateValue
      : (
          data.baseSalary *
          settings.formula.monthsPerYear
        ) /
        (
          settings.formula.weeksPerYear *
          settings.formula.weeklyHours
        )

  const firstHourValue =
    data.firstHour *
    hourlyRate *
    settings.overtime.firstHourRate

  const remainingValue =
    data.remainingHours *
    hourlyRate *
    settings.overtime.remainingHoursRate

  const holidayValue =
    data.holidayHours *
    hourlyRate *
    settings.overtime.holidayRate

  const grossExtraHours =
    firstHourValue +
    remainingValue +
    holidayValue

  const extraIRS =
    grossExtraHours * settings.salary.irsRate

  const extraSS =
    grossExtraHours * settings.salary.ssRate

  const netExtraHours =
    grossExtraHours - extraIRS -
