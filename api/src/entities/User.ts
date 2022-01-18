import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Todo from "./Todo";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("text", { unique: true })
  githubId: string;

  @OneToMany(() => Todo, (todo) => todo.creator)
  todos: Promise<Todo[]>;
}
