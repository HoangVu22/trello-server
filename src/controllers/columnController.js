import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async (req, res, next) => {
  try {
    console.log(req.body)

    // Điều hướng dl sang tầng Service
    const createdColumn = await columnService.createNew(req.body)

    // có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  createNew,
}
