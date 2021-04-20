// Definitions short for brevity
export interface GifMp4 {
    height: string,
    mp4_size: string,
    mp4: string,
    width: number
  }
  
export interface Gif {
    id: string,
    url: string,
    images: {
      original_mp4: GifMp4
    }
  }
  
export interface GifData {
    data: Gif
  }
  
export interface GifsData {
    data: Gif[]
  }