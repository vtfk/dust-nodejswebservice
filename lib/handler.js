const { existsSync } = require('fs')
const { join } = require('path')

const config = require('./config')
const isValidJSON = str => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return false
  }
}

export const getFrontpage = (req, res) => {
  console.log('Hello world', req.headers['x-forwarded-for'] || req.socket.remoteAddress)
  res.send(`
<h1>Usage</h1>

<b><u>args</u> in JSON body is optional, but must be of type <u>object</u> if given</b>

<h3>/:service/invoke</h3>

<pre style="border: 1px solid black; background-color: lightgray;">
{
  "fileName": "ScriptFileName.ps1",
  "args": {
    "SamAccountName": "sak8976",
    "Properties": [
      "title",
      "mail"
    ],
  }
}
</pre>

<h3>/invoke/psfile</h3>

<pre style="border: 1px solid black; background-color: lightgray;">
{
  "filePath": "C:\\FullPath\\To\\ScriptFileName.ps1",
  "args": {
    "SamAccountName": "sak8976",
    "Properties": [
      "title",
      "mail"
    ],
  }
}
</pre>`)
}

export const invokeService = (req, res) => {
  const caller = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  if (!req.body) {
    return res.status(500).json({
      statusCode: 500,
      message: `JSON input is required for endpoint '${req.params.service}'!`
    })
  }

  if (!req.body.fileName) {
    console.log(`${caller} ::'fileName' is required for endpoint '${req.params.service}'`, req.body)
    return res.status(500).json({
      statusCode: 500,
      message: `'fileName' is required for endpoint '${req.params.service}'!`,
      message2: req.params.body
    })
  }

  const servicePath = config[`${req.params.service.toUpperCase()}_PATH`]
  console.log(`${caller} ::`, 'Endpoint:', `'/${req.params.service}/invoke'`, 'ScriptPath:', `'${servicePath}'`)

  if (!servicePath || !existsSync(servicePath)) {
    return res.status(404).json({
      statusCode: 404,
      message: `'${req.params.service}' is not a valid script endpoint!`
    })
  }

  const filePath = join(servicePath, req.body.fileName)

  if (!existsSync(filePath)) {
    return res.status(404).json({
      statusCode: 404,
      message: `'${req.body.fileName}' is not a valid script for endpoint '${req.params.service}'!`
    })
  }

  invokePSFile(filePath, caller, req.body.args || undefined)
    .then(result => {
      const json = isValidJSON(result)
      json ? res.json(json) : res.send({
        statusCode: 200,
        message: result
      })
    })
    .catch(error => {
      console.log(`${caller} ::${error.stack}`)
      const json = isValidJSON(error.message)
      json ? res.status(500).json(json) : res.status(500).send({
        statusCode: 500,
        message: error.message
      })
    })
}

export const invokePSFile = (req, res) => {
  const caller = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  if (!req.body) {
    return res.status(500).json({
      statusCode: 500,
      message: 'JSON input is required!'
    })
  }

  if (!req.body.filePath) {
    return res.status(500).json({
      statusCode: 500,
      message: "'filePath' is required"
    })
  }

  if (!existsSync(req.body.filePath)) {
    return res.status(404).json({
      statusCode: 404,
      message: `'${req.body.filePath}' is not a valid script!`
    })
  }

  invokePSFile(req.body.filePath, caller, req.body.args || undefined)
    .then(result => {
      const json = isValidJSON(result)
      json ? res.json(json) : res.send({
        statusCode: 200,
        message: result
      })
    })
    .catch(error => {
      console.log(`${caller} :: ${error.stack}`)
      const json = isValidJSON(error.message)
      json ? res.status(500).json(json) : res.status(500).send({
        statusCode: 500,
        message: error.message
      })
    })
}