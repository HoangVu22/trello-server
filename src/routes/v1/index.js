import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoutes'

const router = express.Router()

// Check APIs v1/status
router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use' })
})

// Boards APIs
router.use('/boards', boardRoutes)

export const APIs_V1 = router

