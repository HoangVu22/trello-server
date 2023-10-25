import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'

const router = express.Router()

// Check APIs v1/status
router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use' })
})

// Boards APIs
router.use('/boards', boardRoute)

export const APIs_V1 = router

