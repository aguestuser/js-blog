import {PostLike} from "../../main/entity/post"

export const postFields: PostLike = {
  title: "gravity's rainbow",
  body: "a screaming came across the sky",
}

export const postsFields: PostLike[] = [
  postFields,
  {
    title: "against the day",
    body: "single up all the lines",
  },
]