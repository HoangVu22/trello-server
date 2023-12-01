import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn.
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false }) 
}

const createNew = async (data) => {
  try {
    // Trước khi gọi đến DB để lưu dl thì chúng ta sẽ validate trước
    const validateData = await validateBeforeCreate(data)

    // Đổi kiểu dl của boadId trong columns từ string thành ObjectId
    const newColumnToAdd = {
      ...validateData,
      boardId: new ObjectId(validateData.boardId) // ghì đè lại boardId bằng ObjectId và giá trị chính là nó luôn
    }

    // Gọi vào DB
    // collection(): ghi bản ghi dl vào collection columns
    const createdColumn = await getDB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)
    return createdColumn
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await getDB().collection(COLUMN_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Push 1 giá trị cardId vào cuối mảng cardOrderIds trong collection columns
const pushCardOrderIds = async (card) => {
  try {
    const result = await getDB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) }, // Tìm 1 collection columns theo id
      { $push: { cardOrderIds: new ObjectId(card._id) } }, // đẩy cardId vào mảng cardOrderIds của collection columns
      { returnDocument: 'after' } // trả về document mới sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds
}