import {
  AfterInsert,
  Column,
  Entity,
  getConnection,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import config from "../../config"
import {Post} from "./post"
import {flow} from "lodash"

export interface UserLike {
  id?: number,
  username: string,
}

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  username: string

  @OneToMany(type => Post, post => post.author, {
    cascade: ["insert", "update", "remove"],
  })
  posts: Post[]

  @ManyToMany(type => User, follower => follower.followees, {
    cascade: ["insert"],
  })
  @JoinTable()
  followers: User[]

  @ManyToMany(type => User, followee => followee.followers, {
    cascade: ["insert"],
  })
  followees: User[]
}
