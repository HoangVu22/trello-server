/* eslint-disable no-useless-catch */
// Tầng này sinh ra để xử lý logic dl

import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

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
    return board
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}

