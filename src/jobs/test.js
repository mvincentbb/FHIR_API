import ExcelJS from 'exceljs'
import { Promise } from '../resources/promise/promise.model'
import mongoose from 'mongoose'
import fs from 'fs'

process.chdir('../../')
const config = require('../config')

const outputDir = '../reports'

async function main() {
  await mongoose.connect(config.default.dbUrl)

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Me'
  workbook.lastModifiedBy = 'Her'
  workbook.created = new Date(1985, 8, 30)
  workbook.modified = new Date()
  workbook.lastPrinted = new Date(2016, 9, 27)
  workbook.properties.date1904 = true
  workbook.calcProperties.fullCalcOnLoad = true
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible'
    }
  ]
  const sheet = workbook.addWorksheet('Promesse')
  sheet.columns = [
    { header: 'No', key: 'id', width: 10 },
    { header: 'MONTANT (XOF)', key: 'amount', width: 32 },
    { header: 'NOMBRE DE PERSONNE', key: 'count', width: 32 },
    { header: 'TOTAL', key: 'total', width: 10, outlineLevel: 1 }
  ]

  const p = await Promise.aggregate([
    { $match: { amount: { $gt: 0 } } },
    {
      $group: { _id: '$amount', count: { $sum: 1 }, total: { $sum: '$amount' } }
    }
  ])
  p.forEach((elt, index) =>
    sheet.addRow({
      id: index + 1,
      amount: elt._id,
      count: elt.count,
      total: elt.total
    })
  )
  sheet.addRow({
    amount: 'TOTAUX',
    count: p
      .map(elt => elt.count)
      .reduce((previous, current) => previous + current),
    total: p
      .map(elt => elt.total)
      .reduce((previous, current) => previous + current)
  })

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)
  await workbook.xlsx
    .writeFile(`${outputDir}/test.xlsx`)
    .then(() => console.log('Done!'))
    .catch(e => console.log(e))
}

main()
  .then(() => process.exit())
  .catch(e => {
    console.log(e)
    process.exit()
  })
