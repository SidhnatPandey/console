import { get } from "src/@core/services/masterServices";

export const getFetcher = (url: string) => get(url).then((res: any) => res.data)