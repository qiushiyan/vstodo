import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./User";

@Entity()
export default class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  title: string;

  @Column("boolean", { default: false })
  completed: boolean;

  @Column("text")
  creatorId: number;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: "creatorId" })
  creator: Promise<User>;
}
