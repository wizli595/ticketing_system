import mongoose from 'mongoose';
import { Password } from '../services/password';


// @desc properties required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

// Define a more specific type for the transformation result
interface TransformRet {
    id?: string; // Define other properties as needed, mirroring the document's structure but with id instead of _id.
    [key: string]: any; // This allows for additional properties not explicitly defined in the type.
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
        transform(doc: UserDoc, ret: TransformRet): any {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;

        }
    }
})

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const password = this.get('password') as string;
        const hashed = await Password.toHash(password);
        this.set('password', hashed);
    }
    done();
})

userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User }