import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(), //optional(): tùy chọn (có cũng được, k có cũng được)

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Những trường không muốn cho phép update
const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false }) 
}

const createNew = async (data) => {
  try {
    // Trước khi gọi đến DB để lưu dl thì chúng ta sẽ validate trước
    const validateData = await validateBeforeCreate(data)

    // Đổi kiểu dl của boadId và columnId trong cards từ string thành ObjectId
    const newCardToAdd = {
      ...validateData,
      boardId: new ObjectId(validateData.boardId), // ghì đè lại boardId bằng ObjectId và giá trị chính là nó luôn
      columnId: new ObjectId(validateData.columnId) // ghì đè lại columnId bằng ObjectId và giá trị chính là nó luôn
    }

    // Gọi vào DB
    // collection(): ghi bản ghi dl vào collection cards
    const createdCard = await getDB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    return createdCard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await getDB().collection(CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  try {
    // Lọc những field mà chúng ta k cho phép update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    // Đối với những dl liên quan đến ObjectId thì biến đổi ở đây
    if (updateData.columnId) updateData.columnId = new ObjectId(updateData.columnId)

    const result = await getDB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) }, // Tìm 1 collection card theo id
      { $set: updateData },
      { returnDocument: 'after' } // trả về document mới sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update
}