import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

// Tạo ra 1 đối tượng trelloDatabaseInstance ban đầu là null (vì chúng ta chưa connect)
let trelloDatabaseInstance = null

// Khởi tạo đối tượng mongoClientInstance để connect tới mongo (docs)
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

// Kết nối tới Database
export const connectDB = async () => {
  // Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong mongoClientInstance
  await mongoClientInstance.connect()

  // Kết nối thành công thì lấy DB theo tên và gán ngược nó lại vào biến trelloDatabaseInstance ở trên
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASENAME)
}

// Đóng kết nối tới Database khi cần
// close db khi dừng hẵn ứng dụng node lại (vd: ctrl C)
export const closeDB = async () => {
  await mongoClientInstance.close()
}

// export ra cái trelloDatabaseInstance sau khi đã kết nối thành công tới MongoDB để
// chúng ta sử dụng ở nhiều nơi trong code
// !! Phải đảm bảo chỉ gọi hàm getDB sau khi đã kết nối thành công tới MongoDB
export const getDB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first!')
  return trelloDatabaseInstance
}
