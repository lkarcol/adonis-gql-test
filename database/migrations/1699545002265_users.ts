import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Role } from '../../app/Inputs/UserInput'
import { UserPlan } from 'App/Models/User'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.enum('role', Object.values(Role)).defaultTo(Role.User)
      table.enum('plan', Object.values(UserPlan)).defaultTo(UserPlan.Free)
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
