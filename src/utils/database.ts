import mongoose from 'mongoose';
import { DATABASE_URL } from './env';

// konek ke database
const connect = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            dbName: 'iae-auth',
        });
        return Promise.resolve("Connected")
    }catch(error){
        return Promise.reject("Gagal tersambung ke database")
    }
}
export default connect;