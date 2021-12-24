import dotenv from 'dotenv'

dotenv.config()
export const config = {
  secrets: {
    jwt: 'learneverything'
  },
  dbUrl: 'mongodb://localhost:27017/fhirDatabase',
  // process.env.CONNECTIONSTRING || 'mongodb://localhost:27017/fhirDatabase', // 'mongodb://DESKTOP-7F87LGU:27017,DESKTOP-7F87LGU:27018,DESKTOP-7F87LGU:27019/vaillant-batisseur?replicaSet=rs'
  cinetpay_api_key: process.env.CINETPAY_API_KEY,
  cinetpay_site_id: process.env.CINETPAY_SITE_ID,
  admin_id: process.env.ADMIN_ID,
  anonymous_id: process.env.ANONYMOUS_ID
}
