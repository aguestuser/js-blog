import {UserAttributes} from "../../src/db/User"
import {PostAttributes} from '../../src/db/Post'

export const userAttrs: UserAttributes = {
  username: "pynchon",
  email: "pynchon@riseup.net",
}

export const usersAttrs: UserAttributes[] = [
  userAttrs,
  {
    username: "egoldman",
    email: "egoldman@riseup.net",
  },
  {
    username: "eliot",
    email: "eliot@evilcorp.biz",
  }
]

export const postAttrs: PostAttributes = {
  title: "gravity's rainbow",
  body: "a screaming came across the sky",
}

export const postsAttrs: PostAttributes[] = [
  postAttrs,
  {
    title: "living my life",
    body: "if i can't dance i don't want to be part of your revolution",
  },
  {
    title: "fsociety manifesto",
    body: "the ones who play god without permission. i'm going to take them down. all of them."
  }
]

export const followersAttrs: UserAttributes[] = usersAttrs.slice(1)

export const followeesAttrs: UserAttributes[] = [
  { username: "joyce", email: "joyce@riseup.net" },
  { username: "kafka", email: "kakfa@riseup.net" },
]