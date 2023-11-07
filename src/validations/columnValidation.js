import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict()
  })

  try {
    // abortEarly: false để trường hợp có nhiều lỗi validation thì nó sẽ trả về tất cả lỗi.
    await correctCondition.validateAsync(req.body, { abortEarly: false }) 
    // Validate dl xong hợp lệ thì cho request đi tiếp sang Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    // thông thường sẽ dùng mã UNPROCESSABLE_ENTITY(422) để validate dl
  }
}

export const columnValidation = {
  createNew
}