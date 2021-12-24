import { SmsMessage, SMSApi, SmsMessageCollection } from 'clicksend'
import UIDGenerator from 'uid-generator'

export const uidGen = new UIDGenerator(512, UIDGenerator.BASE62)

const USERNAME = 'christophe.assekouda@aluksons.com'
const API_KEY = '672CE7E2-B674-B5F1-9E3D-C475B7489B74'
const smsApi = new SMSApi(USERNAME, API_KEY)
const SMS_ORIGINATOR = 'FATAD'

const inviteUser = (mobileNumber, req, UUID, secret, callback) => {
  const msg = `${req.user.lastName} vous invite sur le projet VAILLANT-BATISSEUR. Pour accepter l'invitation cliquez sur le lien suivant : ${req.headers.origin}/accept-invite/${UUID} . Code de verification : ${secret}`

  sendSMS(mobileNumber, msg)
    .then(response => callback(null, response.body, UUID))
    .catch(err => callback(err.body, null, UUID))
}

const sendSMS = (mobileNumber, message) => {
  const smsMessage = new SmsMessage()

  smsMessage.source = SMS_ORIGINATOR
  smsMessage.from = SMS_ORIGINATOR
  smsMessage.to = mobileNumber
  smsMessage.body = message

  const smsCollection = new SmsMessageCollection()

  smsCollection.messages = [smsMessage]

  return smsApi.smsSendPost(smsCollection)
}

export default { inviteUser, sendSMS }
