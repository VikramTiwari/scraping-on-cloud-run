/**
 * Unset webdriver value for window.navigator as soon as possible
 */
window.unsetNavigator = () => {
  // Do not expose webdriver flag which lets others determine that we are automating
  // More: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/webdriver
  Object.defineProperty(window, `navigator`, {
    value: new Proxy(navigator, {
      has: (target, key) => (key === `webdriver` ? false : key in target),
      get: (target, key) => {
        if (key === `webdriver`) {
          return undefined
        }
        if (typeof target[key] === `function`) {
          return target[key].bind(target)
        }
        return target[key]
      },
    }),
  })
}

window.unsetNavigator()

// Add your custom functions here to be used within the scope of the page itself
