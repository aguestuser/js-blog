import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import {User} from "./user"

export interface PostLike {
  id?: number,
  title: string,
  body: string,
}

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  body: string

  @ManyToOne(type => User, user => user.posts, {
    onDelete: "CASCADE",
  })
  author: User
}
