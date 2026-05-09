export function calculateSalary(data) {
  const hourlyRate =
    (data.baseSalary * 12) / (52 * 28)

  const firstHourValue =
    (data.firstHour * hourlyRate) * 1.25

  const remainingValue =
    (data.remainingHours * hourlyRate) * 1.375

  const holidayValue =
    (data.holidayHours * hourlyRate) * 1.5

  const grossExtraHours =
    firstHourValue +
    remainingValue +
    holidayValue

  const extraIRS =
    grossExtraHours * data.irsRate

  const extraSS =
    grossExtraHours * 0.11

  const netExtraHours =
    grossExtraHours - extraIRS - extraSS

  const adjustedSalary =
    data.baseSalary * 0.8

  const mealAllowance =
    data.workDays * data.mealAllowanceDaily

  const salaryIRS =
    adjustedSalary * data.irsRate

  const salarySS =
    adjustedSalary * 0.11

  const adse =
    adjustedSalary * 0.035

  const club = 1

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
  }
}
