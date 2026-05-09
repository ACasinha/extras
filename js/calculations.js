export function calculateSalary(data, settings) {
    remainingValue +
    holidayValue

  const extraIRS =
    grossExtraHours * settings.salary.irsRate

  const extraSS =
    grossExtraHours * settings.salary.ssRate

  const netExtraHours =
    grossExtraHours - extraIRS - extraSS

  const adjustedSalary =
    data.baseSalary * 0.8

  const mealAllowance =
    data.workDays *
    settings.salary.mealAllowanceDaily

  const salaryIRS =
    adjustedSalary * settings.salary.irsRate

  const salarySS =
    adjustedSalary * settings.salary.ssRate

  const adse =
    adjustedSalary * settings.salary.adseRate

  const club =
    settings.salary.clubTax

  const netSalary =
    adjustedSalary +
    mealAllowance -
    salaryIRS -
    salarySS -
    adse -
    club

  const finalTotal =
    netSalary + netExtraHours

  return {
    hourlyRate,
    grossExtraHours,
    netExtraHours,
    netSalary,
    finalTotal,

    deductions: {
      extraIRS,
      extraSS,
      salaryIRS,
      salarySS,
      adse,
      club,
    },
  }
}
