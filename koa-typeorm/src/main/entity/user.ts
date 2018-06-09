import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeRemove, getRepository, AfterRemove} from "typeorm"
import {Post} from "./post"

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
    cascade: true,
  })
  posts: [Post]
}
