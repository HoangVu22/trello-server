import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'

const router = express.Router()

router.route('/')
  .post(columnValidation.createNew, columnController.createNew)

router.route('/:id')
  .put(columnValidation.update, columnController.update)  
  .delete(columnValidation.deleteItem, columnController.deleteItem)  

export const columnRoute = router