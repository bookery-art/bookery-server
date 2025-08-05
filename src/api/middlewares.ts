import { 
    defineMiddlewares,
    validateAndTransformBody,
} from "@medusajs/framework/http"
import { createBookSchema } from "./validation-schemas"
import multer from "multer"


const upload = multer({ storage: multer.memoryStorage() })

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/book",
            method: "POST",
            middlewares: [
                validateAndTransformBody(createBookSchema),
            ],
        },
        {
            matcher: "/admin/book/upload**",
            method: "POST",
            middlewares: [
                upload.array("files"),
            ],
        },
    ],
})

