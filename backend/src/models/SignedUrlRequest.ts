/**
 * Fields in a request to get a Signed URL request
 */
export interface SignedURLRequest {
    Bucket: string,
    Key: string,
    Expires: number
  }
  