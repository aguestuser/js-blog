import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import {User} from "./user"

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
