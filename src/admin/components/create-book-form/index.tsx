import { useState } from "react"
import { Input, Button, Select, toast } from "@medusajs/ui"
import { MediaType } from "../../types"

type CreateMedia = {
    type: MediaType
    file?: File
}

type Props = {
    onSuccess?: () => void
}

const CreateBookForm = ({
    onSuccess
}: Props) => {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [series, setSeries] = useState("")
    const [series_num, setSeriesNum] = useState("")
    const [genres, setGenres] = useState("")
    const [tags, setTags] = useState("")
    const [cws, setCWS] = useState("")
    const [slug, setSlug] = useState("")
    const [price, setPrice] = useState("")
    const [medias, setMedias] = useState<CreateMedia[]>([])
    const [productTitle, setProductTitle] = useState("")
    const [loading, setLoading] = useState(false)

    const onAddMedia = () => {
        setMedias((prev) => [
            ...prev,
            {
        type: MediaType.PREVIEW,
        }
    ])
    }

    const changeFiles = (
        index: number,
        data: Partial<CreateMedia>
    ) => {
        setMedias((prev) => [
            ...(prev.slice(0, index)),
            {
            ...prev[index],
            ...data
        } ,
        ...(prev.slice(index + 1))
    ])
}

    const uploadMediaFiles = async (
        type: MediaType
    ) => {
        const formData = new FormData()
        const mediaWithFiles = medias.filter(
        (media) => media.file !== undefined && 
            media.type === type
        )

        if (!mediaWithFiles.length) {
        return
        }

        mediaWithFiles.forEach((media) => {
        if (!media.file) {
            return
        }
        formData.append("files", media.file)
        })

        const { files } = await fetch(`/admin/book/upload/${type}`, {
        method: "POST",
        credentials: "include",
        body: formData,
        }).then((res) => res.json())

        return {
        mediaWithFiles,
        files
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
        const {
            mediaWithFiles: previewMedias,
            files: previewFiles
        } = await uploadMediaFiles(MediaType.PREVIEW) || {}
        const {
            mediaWithFiles: epubMedias,
            files: epubFiles
        } = await uploadMediaFiles(MediaType.EPUB) || {}
        const {
            mediaWithFiles: pdfMedias,
            files: pdfFiles
        } = await uploadMediaFiles(MediaType.PDF) || {}
        const {
            mediaWithFiles: coverMedias,
            files: coverFiles
        } = await uploadMediaFiles(MediaType.COVER) || {}

        const mediaData: {
            type: MediaType
            file_id: string
            mime_type: string
        }[] = []
    
        previewMedias?.forEach((media, index) => {
            mediaData.push({
            type: media.type,
            file_id: previewFiles[index].id,
            mime_type: media.file!.type,
            })
        })
    
        epubMedias?.forEach((media, index) => {
            mediaData.push({
            type: media.type,
            file_id: epubFiles[index].id,
            mime_type: media.file!.type,
            })
        })

        pdfMedias?.forEach((media, index) => {
            mediaData.push({
            type: media.type,
            file_id: pdfFiles[index].id,
            mime_type: media.file!.type,
            })
        })

        coverMedias?.forEach((media, index) => {
            mediaData.push({
            type: media.type,
            file_id: coverFiles[index].id,
            mime_type: media.file!.type,
            })
        })

        fetch(`/admin/book`, {
            method: "POST",
            credentials: "include",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            title,
            author,
            series,
            series_num,
            genres,
            tags,
            cws,
            price,
            status,
            slug,
            medias: mediaData,
            product: {
                title: productTitle,
                options: [{
                title: "Default",
                values: ["default"]
                }],
                variants: [{
                title: productTitle,
                options: {
                    Default: "default"
                },
                manage_inventory: false,
                // delegate setting the prices to the
                // product's page.
                prices: []
                }],
                shipping_profile_id: ""
            }
            })
        })
        .then((res) => res.json())
        .then(({ message }) => {
            if (message) {
            throw message
            }
            onSuccess?.()
        })
        .catch((e) => {
            console.error(e)
            toast.error("Error", {
            description: `An error occurred while creating the digital product: ${e}`
            })
        })
        .finally(() => setLoading(false))
        } catch (e) {
        console.error(e)
        setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit}>
        <fieldset className="my-4">
        <legend className="mb-2">Book Details</legend>
        <Input
            name="title"
            placeholder="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <Input
            name="author"
            placeholder="Author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
        />
        <Input
            name="series"
            placeholder="Series"
            type="text"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
        />
        <Input
            name="series_num"
            placeholder="Series #"
            type="text"
            value={series_num}
            onChange={(e) => setSeriesNum(e.target.value)}
        />
        <Input
            name="genres"
            placeholder="Genres"
            type="text"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
        />
        <Input
            name="tags"
            placeholder="Tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
        />
        <Input
            name="cws"
            placeholder="Content Warnings"
            type="text"
            value={cws}
            onChange={(e) => setCWS(e.target.value)}
        />
        <Input
            name="slug"
            placeholder="Slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
        />
        <Input
            name="price"
            placeholder="Price"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
        />
        </fieldset>
        <fieldset className="my-4">
            <legend className="mb-2">Media</legend>
            <Button type="button" onClick={onAddMedia}>Add Media</Button>
            {medias.map((media, index) => (
            <fieldset className="my-2 p-2 border-solid border rounded">
                <legend>Media {index + 1}</legend>
                <Select 
                value={media.type} 
                onValueChange={(value) => changeFiles(
                    index,
                    {
                    type: value as MediaType
                    }
                )}
                >
                <Select.Trigger>
                    <Select.Value placeholder="Media Type" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value={MediaType.COVER}>
                    Cover
                    </Select.Item>
                    <Select.Item value={MediaType.EPUB}>
                    Main
                    </Select.Item>
                    <Select.Item value={MediaType.PDF}>
                    PDF
                    </Select.Item>
                    <Select.Item value={MediaType.PREVIEW}>
                    Preview
                    </Select.Item>
                </Select.Content>
                </Select>
                <Input
                name={`file-${index}`}
                type="file"
                onChange={(e) => changeFiles(
                    index,
                    {
                    file: e.target.files?.[0]
                    }
                )}
                className="mt-2"
                />
            </fieldset>
            ))}
        </fieldset>
        <fieldset className="my-4">
            <legend className="mb-2">Book</legend>
            <Input
            name="book_title"
            placeholder="Book Title"
            type="text"
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            />
        </fieldset>
        <Button 
            type="submit"
            isLoading={loading}
        >
            Create Book
        </Button>
        </form>
    )
}

export default CreateBookForm