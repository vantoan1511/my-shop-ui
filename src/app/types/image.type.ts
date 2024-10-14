export interface Image {
    id: number
    altText: string
    content: string
    avatar: boolean
    createdAt: string
    modifiedAt: string
    userId: number
}

export interface ProductImage {
    id: number
    imageId: number
    featured: boolean
}
