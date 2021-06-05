const path = require('path')
const { chromium } = require('playwright')

// Set NODE_ENV as development by default. This will get updated on cloud run.
const { NODE_ENV = `development` } = process.env

// Declare a global browser that will be used for a container
let browser = false

/**
 * Returns an incognito page instance
 * NOTE: Page should be closed by the function utilizing it
 *
 * @returns {Playwright.Page}
 */
async function getPage() {
  // Starting a browser utilizes a lot of resources, so we want to launch a browser and reuse it as much as possible
  if (!browser)
    browser = await chromium.launch({
      // run headless in prod, this makes it easier to see what's happening locally
      headless: NODE_ENV === `production`,
    })

  // Creating a new incognito page is very cheap to do and keeps each page independent of each other
  // More options: https://playwright.dev/docs/api/class-browser#browsernewpageoptionsF
  const page = await browser.newPage({
    bypassCSP: true,
    // even with incognito, it allows you to set your own cookies
    storageState: {
      cookies: [
        {
          name: `repo`,
          value: `scraping-on-cloud-run`,
          url: `https://github.com/VikramTiwari/scraping-on-cloud-run`,
        },
      ],
    },
  })

  // Add init script which contains utility functions
  await page.addInitScript({
    path: path.join(__dirname, './injected.js'),
  })
  return page
}

/**
 * Gets innerText for the URL provided
 *
 * @param {String} url URL that you want to get all the text from
 * @returns {{Text|Error}} innerText of the page or playwright error (if any)
 */
async function getInnerText(url) {
  let page = false
  try {
    page = await getPage()
    // Go to the URL for the page and wait till content is loaded
    await page.goto(url, { waitUntil: `domcontentloaded` })

    // --- Custom code block start ---

    // At this point you can perform all sorts of operations on this page
    // For example
    // Get all the text from the page
    const text = await page.innerText(`body`)

    // --- Custom code block end ---

    // Close the page to free up RAM utilized by this page
    // NOTE: We don't have to wait for page to close
    page.close()

    // Return the response
    return { text }
  } catch (error) {
    // In case of any error, print it to console so that stackdriver can pick it up
    console.log(`getInnerText Error:`, error)
    // Always close the page to regain all the RAM that was utilized
    if (page) page.close()
    return { error: error.message }
  }
}

module.exports = { getInnerText }
