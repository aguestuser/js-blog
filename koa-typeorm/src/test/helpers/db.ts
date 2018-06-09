import {omit} from "lodash"

export const stripId = (x: object): object  => omit(x, ["id"])
