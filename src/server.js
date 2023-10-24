import express from 'express'
import exitHook from 'async-exit-hook'
import { connectDB, getDB, closeDB } from '~/config/mongodb'

const START_SERVER = () => {
  const app = express()
  
  const hostname = 'localhost'
  const port = 8017
  
  app.get('/', async (req, res) => {
    console.log(await getDB().listCollections().toArray())

    res.end('<h1>Hello World!</h1><hr>')
  })
  
  app.listen(port, hostname, () => {
    console.log(`🚀🚀 Server ready at http://${hostname}:${port}/`)
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


