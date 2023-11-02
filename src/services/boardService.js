/* eslint-disable no-useless-catch */
// Tầng này sinh ra để xử lý logic dl

import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào DB
    const createdBoard = await boardModel.createNew(newBoard)

    // Lấy bản ghi board sau khi gọi (tùy mục đích dự án mà có cần bước này hay k)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // Trả kq về, trong tầng Service luôn phải có return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào DB
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found') //404
    }

    // Deep Clone board ra 1 cái mới để xử lý, không ảnh hưởng tới board ban đầu
    const resBoard = cloneDeep(board)

    // Đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      // tìm trong mảng cards, tất cả các thằng có chưa key là columnId đồng thời nó chính là id của column chúng ta đang đứng để gán ngược lại mảng column.cards => columns có thêm mảng cards nữa
      // convert objectId về string bằng hàm toString()
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString()) 
    })

    // xóa mảng cards khỏi board ban đầu: vì đã chạy qua forEach, đã biến đổi tất cả cards cần thiết đổ vào trong columns rồi
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}

