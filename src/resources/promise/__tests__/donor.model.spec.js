import { Donor } from '../donor.model'
import mongoose from 'mongoose'

describe('Donor model', () => {
  describe('schema', () => {
    test('name', () => {
      const name = Donor.schema.obj.name
      expect(name).toEqual({
        type: String,
        required: true,
        trim: true,
        maxlength: 50
      })
    })

    test('status', () => {
      const status = Donor.schema.obj.status
      expect(status).toEqual({
        type: String,
        required: true,
        enum: ['active', 'complete', 'pastdue'],
        default: 'active'
      })
    })

    test('notes', () => {
      const notes = Donor.schema.obj.notes
      expect(notes).toEqual(String)
    })

    test('due', () => {
      const due = Donor.schema.obj.due
      expect(due).toEqual(Date)
    })

    test('createdBy', () => {
      const createdBy = Donor.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      })
    })

    test('list', () => {
      const list = Donor.schema.obj.list
      expect(list).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'list',
        required: true
      })
    })
  })
})
