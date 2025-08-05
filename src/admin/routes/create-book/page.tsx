import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BookOpen } from "@medusajs/icons"
import { Container, Heading, Table, Button, Drawer } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Book } from "../../types"
import CreateBookForm from "../../components/create-book-form"

const BookPage = () => {
    const [book, setBook] = useState<
        Book[]
    >([])
    const [open, setOpen] = useState(false)
    
    const [currentPage, setCurrentPage] = useState(0)
    const pageLimit = 20
    const [count, setCount] = useState(0)
    const pagesCount = useMemo(() => {
    return count / pageLimit
    }, [count])
    const canNextPage = useMemo(
        () => currentPage < pagesCount - 1, 
        [currentPage, pagesCount]
    )
    const canPreviousPage = useMemo(
        () => currentPage > 0, 
        [currentPage]
    )

    const nextPage = () => {
        if (canNextPage) {
        setCurrentPage((prev) => prev + 1)
        }
    }

    const previousPage = () => {
        if (canPreviousPage) {
        setCurrentPage((prev) => prev - 1)
        }
    }

    const fetchProducts = () => {
    const query = new URLSearchParams({
        limit: `${pageLimit}`,
        offset: `${pageLimit * currentPage}`
    })
    
    fetch(`/admin/book?${query.toString()}`, {
        credentials: "include"
    })
    .then((res) => res.json())
    .then(({ 
        book: data, 
        count
    }) => {
        setBook(data)
        setCount(count)
    })
    }

    useEffect(() => {
    fetchProducts()
    }, [currentPage])

    return (
    <Container>
        <div className="flex justify-between items-center mb-4">
        {/* Replace the TODO with the following */}
        <Heading level="h2">Books</Heading>
        <Drawer open={open} onOpenChange={(openChanged) => setOpen(openChanged)}>
            <Drawer.Trigger 
            onClick={() => {
                setOpen(true)
            }}
            asChild
            >
            <Button>Create</Button>
            </Drawer.Trigger>
            <Drawer.Content>
            <Drawer.Header>
                <Drawer.Title>Create Book</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
                <CreateBookForm onSuccess={() => {
                setOpen(false)
                if (currentPage === 0) {
                    fetchProducts()
                } else {
                    setCurrentPage(0)
                }
            }} />
            </Drawer.Body>
            </Drawer.Content>
        </Drawer>
        </div>
        <Table>
        <Table.Header>
            <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {book.map((book) => (
            <Table.Row key={book.id}>
                <Table.Cell>
                    {book.title}
                </Table.Cell>
                <Table.Cell>
                <Link to={`/products/${book.product_variant?.product_id}`}>
                    View Product
                </Link>
                </Table.Cell>
            </Table.Row>
            ))}
        </Table.Body>
        </Table>
        <Table.Pagination
            count={count}
            pageSize={pageLimit}
            pageIndex={currentPage}
            pageCount={pagesCount}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            previousPage={previousPage}
            nextPage={nextPage}
        />
    </Container>
)
}

export const config = defineRouteConfig({
    label: "Books",
    icon: BookOpen,
})

export default BookPage