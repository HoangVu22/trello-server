import express from 'express'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: 'POST: API create new board' })
  })

export const boardRoutes = router