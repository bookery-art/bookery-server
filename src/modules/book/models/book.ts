import { model } from "@medusajs/framework/utils"
import BookMedia from "./book-media"
import BookOrder from "./book-order"

const Book = model.define("book", {

    id: model.id().primaryKey(),
    title: model.text(),
    author: model.number(),
    cover: model.text(),
    series: model.text(),
    series_num: model.number(),
    summary: model.text(),
    genres: model.array(),
    tags: model.array(),
    cws: model.array(),
    price: model.float(),
    status: model.text(),
    slug: model.text(),
    medias: model.hasMany(() => BookMedia, {
        mappedBy: "book",
    }),
    orders: model.manyToMany(() => BookOrder, {
        mappedBy: "products",
    })
}).cascades({
    delete: ["medias"],
})


export default Book