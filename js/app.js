import { calculateSalary } from './calculations.js'

const fields = {
  baseSalary: document.querySelector('#baseSalary'),
  irsRate: document.querySelector('#irsRate'),
  workDays: document.querySelector('#workDays'),
  firstHour: document.querySelector('#firstHour'),
  remainingHours: document.querySelector('#remainingHours'),
  holidayHours: document.querySelector('#holidayHours'),
}

const finalTotal = document.querySelector('#finalTotal')
const netExtraHours = document.querySelector('#netExtraHours')
const netSalary = document.querySelector('#netSalary')

function update() {
  const data = {
    baseSalary: Number(fields.baseSalary.value),
    irsRate: Number(fields.irsRate.value),
    workDays: Number(fields.workDays.value),
    mealAllowanceDaily: 6,
    firstHour: Number(fields.firstHour.value),
    remainingHours: Number(fields.remainingHours.value),
    holidayHours: Number(fields.holidayHours.value),
  }

  const result = calculateSalary(data)

  finalTotal.textContent =
    `€ ${result.finalTotal.toFixed(2)}`

  netExtraHours.textContent =
    `€ ${result.netExtraHours.toFixed(2)}`

  netSalary.textContent =
    `€ ${result.netSalary.toFixed(2)}`

  localStorage.setItem(
    'hours-extra-last',
    JSON.stringify(data)
  )
}

Object.values(fields).forEach((field) => {
  field.addEventListener('input', update)
})

const saved = localStorage.getItem('hours-extra-last')

if (saved) {
  const data = JSON.parse(saved)

  Object.entries(data).forEach(([key, value]) => {
    if (fields[key]) {
      fields[key].value = value
    }
  })
}

update()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
