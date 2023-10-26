import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    console.log(req.body)
    res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: API create new board' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    }) // INTERNAL_SERVER_ERROR(500)
  }
}

export const boardController = {
  createNew
}