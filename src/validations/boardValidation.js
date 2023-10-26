import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'


const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    // trim đi chung với strict
    // messages: Custom error messages
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.max': 'Title length must be less than or equal to 50 characters long',
      'string.min': 'Title length must be at least 3 characters long',
      'string.trim': 'Title must not have leading or trailing whitespace',
    }),
    description: Joi.string().required().min(3).max(250).trim().strict(),
  })

  try {
    // abortEarly: false để trường hợp có nhiều lỗi validation thì nó sẽ trả về tất cả lỗi.
    await correctCondition.validateAsync(req.body, { abortEarly: false }) 
    // Validate dl xong hợp lệ thì cho request đi tiếp sang Controller
    next()
  } catch (error) {
    // console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    }) // thông thường sẽ dùng mã UNPROCESSABLE_ENTITY(422) để validate dl
  }
}

export const boardValidation = {
  createNew
}