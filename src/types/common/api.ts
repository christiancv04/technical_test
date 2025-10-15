export interface ApiResponse<T = undefined> {
    results: T
    info: {
        seed: string
        results: number
        page: number
        version: string
    }
}