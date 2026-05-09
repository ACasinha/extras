import { defaultSettings } from './settings-defaults.js'

export let settings = loadSettings()

export function loadSettings() {
  const saved = localStorage.getItem(
    'hours-extra-settings'
  )

  return saved
    ? JSON.parse(saved)
    : structuredClone(defaultSettings)
}

export function saveSettings() {
  localStorage.setItem(
    'hours-extra-settings',
    JSON.stringify(settings)
  )
}

export function updateSetting(path, value) {
  const keys = path.split('.')

  let current = settings

  while (keys.length > 1) {
    current = current[keys.shift()]
  }

  current[keys[0]] = value

  saveSettings()
}

export function resetSettings() {
  settings = structuredClone(defaultSettings)

  saveSettings()

  location.reload()
}
