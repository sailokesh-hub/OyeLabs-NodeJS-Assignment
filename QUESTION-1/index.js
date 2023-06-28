const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()

const app = express()
app.use(bodyParser.urlencoded({extended: true}))

// SQLite database connection
const db = new sqlite3.Database(
  '/home/workspace/reactjs/coding-practices/appointmentsApp/QUESTION-1/customer_data.db',
)

// Create customers table in SQLite database
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, number TEXT UNIQUE, password TEXT)',
  )
})

app.listen(3000, () => {
  console.log('App started at port http://localhost:3000')
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/login.html', (req, res) => {
  res.sendFile(__dirname + '/login.html')
})

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/addCustomer', (req, res) => {
  const {name, number, password} = req.body

  // Input validation
  if (!name || !number || !password) {
    return res.status(400).json({error: 'All fields are required'})
  }

  // Duplicate check
  const duplicateCheckQuery = 'SELECT * FROM customers WHERE number = ?'
  db.get(duplicateCheckQuery, [number], (error, row) => {
    if (error) {
      console.error('Error executing duplicate check query:', error)
      return res
        .status(500)
        .json({error: 'Failed to execute duplicate check query'})
    }

    if (row) {
      return res
        .status(409)
        .json({error: 'Customer with this number already exists'})
    }

    // Add the customer to the customers table
    const addCustomerQuery =
      'INSERT INTO customers (name, number, password) VALUES (?, ?, ?)'
    db.run(addCustomerQuery, [name, number, password], function (error) {
      if (error) {
        console.error('Error adding customer:', error)
        return res.status(500).json({error: 'Failed to add customer'})
      }

      console.log('New customer added:', {
        id: this.lastID,
        name,
        number,
        password,
      })
      res.status(200)
      res.sendFile(__dirname + '/login.html')
    })
  })
})

app.post('/login', (req, res) => {
  const {number, password} = req.body

  // Input validation
  if (!number || !password) {
    return res.status(400).json({error: 'Number and password are required'})
  }

  // Find the customer with the given number
  const findCustomerQuery = 'SELECT * FROM customers WHERE number = ?'
  db.get(findCustomerQuery, [number], (error, row) => {
    if (error) {
      console.error('Error executing customer query:', error)
      return res.status(500).json({error: 'Failed to execute customer query'})
    }

    if (!row) {
      return res.status(404).json({error: 'Customer not found'})
    }

    // Check if the password matches
    if (row.password !== password) {
      return res.status(401).json({error: 'Invalid password'})
    }

    // Login successful
    res.status(200)
    res.sendFile(__dirname + '/home.html')
  })
})
