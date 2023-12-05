/* eslint-disable no-useless-catch */
// Tầng này sinh ra để xử lý logic dl

import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newColumn vào DB
    const createdColumn = await columnModel.createNew(newColumn)

    // Lấy bản ghi column sau khi gọi (tùy mục đích dự án mà có cần bước này hay k)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      // Xử lý cấu trúc data trước khi trả dl về
      getNewColumn.cards = []

      // Cập nhật lại mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    // Trả kq về, trong tầng Service luôn phải có return
    return getNewColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const updateColumn = await columnModel.update(columnId, updateData)

    return updateColumn
  } catch (error) {
    throw error
  }
}

const deleteItem = async (columnId) => {
  try {
    // Xóa Column
    await columnModel.deleteOneById(columnId)

    // Xóa toàn bộ Card thuộc Column trên
    await cardModel.deleteManyByColumnId(columnId)

    return { deleteResult: 'Column and its Cards deleted successfully!' }
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}

