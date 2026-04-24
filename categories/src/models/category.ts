import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CategoryAttrs {
    name: string;
    slug: string;
    icon?: string;
}

interface CategoryDoc extends mongoose.Document {
    name: string;
    slug: string;
    icon: string;
    version: number;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
    build(attrs: CategoryAttrs): CategoryDoc;
}

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        icon: {
            type: String,
            default: "",
        },
    },
    {
        toJSON: {
            transform(doc, ret: any) {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            },
        },
    }
);

categorySchema.set("versionKey", "version");
categorySchema.plugin(updateIfCurrentPlugin);

categorySchema.statics.build = (attrs: CategoryAttrs) => {
    return new Category(attrs);
};

export const Category = mongoose.model<CategoryDoc, CategoryModel>(
    "Category",
    categorySchema
);
