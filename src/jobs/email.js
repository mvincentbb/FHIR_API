const pdf = require('pdf-creator-node')
const fs = require('fs')

// Read HTML Template
const html = fs.readFileSync('mars.html', 'utf8')

const options = {
  format: 'A4',
  orientation: 'portrait',
  border: '10mm',
  header: {
    height: '45mm',
    contents:
      '<div style="text-align: center; font-weight: bold; font-size: 2rem">FATAD VAILLANT-BATISSEUR</div>'
  },
  footer: {
    height: '28mm',
    contents: {
      first: 'Cover page',
      2: 'Second page', // Any page number is working. 1-based index
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      last: 'Last Page'
    }
  }
}

const users = [
  {
    name: 'Shyam',
    age: '26'
  },
  {
    name: 'Navjot',
    age: '26'
  },
  {
    name: 'Vitthal',
    age: '26'
  }
]
const document = {
  html: html,
  data: {
    users: users
  },
  path: './output.pdf',
  type: ''
}

pdf
  .create(document, options)
  .then(res => {
    console.log(res)
  })
  .catch(error => {
    console.error(error)
  })
