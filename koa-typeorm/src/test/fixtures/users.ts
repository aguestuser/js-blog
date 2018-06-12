import {UserLike} from "../../main/entity/user"

export const userFields: UserLike = {
  username: "pynchon",
}

export const followersFields: UserLike[] = [
  { username: "dideon" },
  { username: "kafka" },
]

export const followeesFields: UserLike[] = [
  { username: "joyce" },
  { username: "goldman" }
]