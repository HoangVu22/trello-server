import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { getDB } from '~/config/mongodb'
import { BOARD_BAR_TYPES } from '~/utils/constants'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

// Define Collection (Name & Schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(250).trim().strict(),
  type: Joi.string().valid(BOARD_BAR_TYPES.PUBLIC, BOARD_BAR_TYPES.PRIVATE).required(),

  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn.
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false) // bản ghi này đã bị xóa hay chưa
})

const validateBeforeCreate = async (data) => {
  /* Tại sao validate ở tầng Validation rồi mà ở bên tầng Model lại validate tiếp:
    - Vì: ngoài những cái client gửi lên ở Validation (title, description) là mình validate trước rồi mới đưa dl sang controller -> service -> model
    - Bên model nó vẫn validate những dl giống Validation, ngoài ra nó có validate thêm những dl khác cho chuẩn chỉnh và cẩn thận
  */
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false }) 
}

const createNew = async (data) => {
  try {
    // Trước khi gọi đến DB để lưu dl thì chúng ta sẽ validate trước
    const validateData = await validateBeforeCreate(data)

    // Gọi vào DB
    // collection(): ghi bản ghi dl vào collection boards
    const createdBoard = await getDB().collection(BOARD_COLLECTION_NAME).insertOne(validateData)
    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await getDB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (id) => {
  try {
    // Hàm này giống hàm findOneById - và sẽ update phần aggregate tiếp
    // Query tổng hợp (aggregate): để lấy toàn bộ Columns và Card thuộc Board
    // const result = await getDB().collection(BOARD_COLLECTION_NAME).findOne({
    //   _id: new ObjectId(id)
    // })
    const result = await getDB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: { // tìm 1 bản ghi có id này với điều kiện distroy phải là false
          _id: new ObjectId(id),
          _destroy: false
        }
      },
      {
        $lookup: { // đứng từ board chạy sang collection column, tìm toàn bộ column nào có boardId là id của board chúng ta đang đứng để tìm đến và lấy những column thuộc về nó và trả về cho người dùng.
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId', // khóa ngoại
          as: 'columns',
        }
      },
      {
        $lookup: { // đứng từ board chạy sang collection card, tìm toàn bộ card nào có boardId là id của board chúng ta đang đứng để tìm đến và lấy những card thuộc về nó và trả về cho người dùng.
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId', // khóa ngoại
          as: 'cards',
        }
      }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

// Push 1 giá trị columnId vào cuối mảng columnOrderIds trong collection boards
const pushColumnOrderIds = async (column) => {
  try {
    const result = await getDB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) }, // Tìm 1 collection boards theo id
      { $push: { columnOrderIds: new ObjectId(column._id) } }, // đẩy columnId vào mảng columnOrderIds của collection boards
      { returnDocument: 'after' } // trả về document mới sau khi đã cập nhật
    )
    return result.value || null
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds
}