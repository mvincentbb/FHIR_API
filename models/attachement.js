/*
This type is for containing or referencing attachments - additional data content defined in other formats. The most common use of this type is to include images or reports in some report format such as PDF. However, it can be used for any data that has a MIME type.
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const attachmentSchema = new Schema({
  _id: false,
    contentType : {type: String}, // Mime type of the content, with charset etc.
  language : {type: String}, // Human language of the content (BCP-47)
  data : {type: Buffer}, // Data inline, base64ed
  url : {type: String}, // Uri where the data can be found
  size : {type: String}, // Number of bytes of content (if url provided)
  hash : {type: String}, // Hash of the data (sha-1, base64ed)
  title : {type: String}, // Label to display in place of the data
  creation : {type:Date} // Date attachment was first created
})

module.exports = mongoose.model('AttachmentSchema', attachmentSchema)
module.exports = attachmentSchema