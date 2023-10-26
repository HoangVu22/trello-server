import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    console.log(req.body)
    // có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: API create new board' })
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew
}
