const express = require('express')
const app = express()

// Import custom function that will do all the operations
const { getInnerText } = require(`./script.js`)

// Get PORT from NODE_ENV with default at 8080
const { PORT = 8080 } = process.env

// This endpoint is used for uptime checks
app.get('/_health', (req, res) => {
  res.send(req.query)
})

// This endpoint is used to perform actual task with playwright
app.get('/', async (req, res) => {
  let result = false

  // Only try to get data if URL is present in req query
  if (req.query.url) {
    result = await getInnerText(req.query.url)
  } else {
    // If no URL is passed, return error along with a correct sample
    res.status(400).json({
      error: `No URL present. Please add a URL as request query parameter.`,
      sample: `http://localhost:8080?url=https://google.com`,
    })
  }
  // if error, return with 400 status code
  if (result.error) res.status(400).json(result)
  else res.json(result)
})

// Start the server
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
