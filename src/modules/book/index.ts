import { Module } from "@medusajs/framework/utils"
import BookModuleService from "./service"

export const BOOK_MODULE = "BookModuleService"

export default Module(BOOK_MODULE, {
    service: BookModuleService,
})
