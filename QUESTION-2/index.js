const sqlite3 = require('sqlite3').verbose()

// Connect to the SQLite database
const db = new sqlite3.Database('data.db', err => {
  if (err) {
    console.error('Error connecting to SQLite database:', err)
    return
  }

  console.log('Connected to SQLite database')

  // SQL query to retrieve subjects for each student
  const query = `
    SELECT
      c.customerId,
      c.name,
      GROUP_CONCAT(s.subjectName, ',') AS subjects
    FROM
      customers AS c
    JOIN
      "Subject student mapping" AS m ON c.customerId = m.customerId
    JOIN
      Subjects AS s ON m.subjectId = s.subjectId
    GROUP BY
      c.customerId, c.name
    ORDER BY
      subjects ASC;
  `

  // Execute the query
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err)
      return
    }

    // Process the results
    rows.forEach(row => {
      console.log(`customerId: ${row.customerId}`)
      console.log(`name: ${row.name}`)
      console.log(`subjects: ${row.subjects}`)
      console.log('---------------------------')
    })

    // Close the database connection
    db.close()
  })
})
