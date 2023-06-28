const person = {
  id: 2,
  gender: 'mail',
}

const student = {
  name: 'ravi',
  email: 'ravi11@yopmail.com',
}

const personStudent = {
  ...person,
  ...student,
}

console.log(personStudent)
