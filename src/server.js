import express from 'express'
import exitHook from 'async-exit-hook'
import { connectDB, closeDB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'

const START_SERVER = () => {
  const app = express()

  app.use(express.json())
  
  app.use('/v1', APIs_V1)
  
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`🚀🚀 Hi ${env.AUTHOR}, Server ready at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  // Thực hiện các tác vụ cleanup trước khi dừng server lại
  exitHook(() => {
    console.log('Disconnected from MongoDB Atlas!')
    closeDB()
  })
}

// Cách kết nối thứ 2
// Immediately-invoked / Anonymous Asyns function (IIFE)
(async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// Chỉ khi kết nối với Database thành công thì mới Start server Backend lên
// connectDB()
//   .then(() => console.log('Connected to MongoDB Atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })


