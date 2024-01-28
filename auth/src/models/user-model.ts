import mongoose from 'mongoose';
import { Password } from '../services/password';


// @desc properties required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

// @desc properties the User model need
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id;
            delete ret.password;
        }
    }
})

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User }