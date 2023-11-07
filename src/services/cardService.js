/* eslint-disable no-useless-catch */
// Tầng này sinh ra để xử lý logic dl

import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newCard vào DB
    const createdCard = await cardModel.createNew(newCard)

    // Lấy bản ghi card sau khi gọi (tùy mục đích dự án mà có cần bước này hay k)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      // Cập nhật lại mảng cardOrderIds trong collection columns
      await columnModel.pushCardOrderIds(getNewCard)
    }

    // Trả kq về, trong tầng Service luôn phải có return
    return getNewCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
}

