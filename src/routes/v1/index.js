import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'

const router = express.Router()

// Check APIs v1/status
router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use' })
})

// Boards APIs
router.use('/boards', boardRoute)

// Columns APIs
router.use('/columns', columnRoute)

// Cars APIs
router.use('/cards', cardRoute)

export const APIs_V1 = router

