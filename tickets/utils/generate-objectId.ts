import mongoose from "mongoose"

export const generateObjectId = () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    return id;
}