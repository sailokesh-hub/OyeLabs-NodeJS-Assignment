const sqlite3 = require('sqlite3')

const customers = [
  {
    email: 'anurag11@yopmail.com',
    name: 'anurag',
  },
  {
    email: 'sameer11@yopmail.com',
    name: 'sameer',
  },
  {
    email: 'ravi11@yopmail.com',
    name: 'ravi',
  },
  {
    email: 'akash11@yopmail.com',
    name: 'akash',
  },
  {
    email: 'anjali11@yopmail.com',
    name: 'anjai',
  },
  {
    email: 'santosh11@yopmail.com',
    name: 'santosh',
  },
]

const db = new sqlite3.Database('data.db', err => {
  if (err) {
    console.error('Error connecting to SQLite database:', err)
    return
  }

  console.log('Connected to SQLite database')

  // Create customers table if it doesn't exist
  db.run(
    `
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      name TEXT
    )
  `,
    error => {
      if (error) {
        console.error('Error creating customers table:', error)
        return
      }

      console.log('Customers table created or already exists')

      // Insert or update customers
      customers.forEach(customer => {
        const {email, name} = customer

        db.run(
          'INSERT OR REPLACE INTO customers (email, name) VALUES (?, ?)',
          [email, name],
          error => {
            if (error) {
              console.error('Error inserting or updating customer:', error)
            } else {
              console.log('Customer inserted or updated:', email)
            }
          },
        )
      })

      db.close()
    },
  )
})
