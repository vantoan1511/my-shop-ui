export interface Review {
    id: string
    rating: number
    title: string
    text: string
    helpfulCount: number
    createdAt: string
    username: string
    productSlug: string
}

export interface ReviewRequestFilter {
    productSlug?: string
    rating?: number
}

export interface ReviewStatistic {
    averageRating: number
    totalReviews: number
    totalOneStars: number
    totalTwoStars: number
    totalThreeStars: number
    totalFourStars: number
    totalFiveStars: number
}
