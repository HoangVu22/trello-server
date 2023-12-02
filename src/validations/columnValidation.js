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

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    // Chúng ta k dùng required() trong trường hợp update

    // Nếu cần làm thêm tính năng di chuyển column sang Board khác thì mới thêm validate boardId
    // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false, // abortEarly: false để trường hợp có nhiều lỗi validation thì nó sẽ trả về tất cả lỗi.
      allowUnknown: true // Đối với trường hợp update thì cho phép allowUnknown để chúng ta k cần đẩy 1 số field lên
    })  
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const columnValidation = {
  createNew,
  update
}