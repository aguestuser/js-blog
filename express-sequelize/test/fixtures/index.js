export const userAttrs = {
  username: "pynchon",
  email: "pynchon@riseup.net",
}

export const usersAttrs = [
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

export const postAttrs = {
  title: "gravity's rainbow",
  body: "a screaming came across the sky",
}

export const postsAttrs = [
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

export const followersAttrs = usersAttrs.slice(1)

export const followeesAttrs = [
  { username: "joyce", email: "joyce@riseup.net" },
  { username: "kafka", email: "kakfa@riseup.net" }
]