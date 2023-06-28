const request = require('request')

// Define promisified function
function getGoogleHomePage() {
  return new Promise((resolve, reject) => {
    request('http://www.jakjfkdj.com', function (error, response, body) {
      if (error) {
        console.error('error:', error)
        reject(error)
      } else {
        console.log('statusCode:', response && response.statusCode)
        console.log('body:', body)
        resolve(body)
      }
    })
  })
}

// Call the promisified function
getGoogleHomePage()
  .then(result => {
    console.log('RESULT==>', result)
  })
  .catch(error => {
    console.error('ERROR==>', error)
  })
