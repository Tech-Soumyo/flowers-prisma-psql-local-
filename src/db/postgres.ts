// db/postgres.ts
import EmbeddedPostgresFromPackage from 'embedded-postgres'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

const EmbeddedPostgres = (EmbeddedPostgresFromPackage as any).default || EmbeddedPostgresFromPackage

const pgDataDir = path.join(process.cwd(), 'pg-data')
if (!fs.existsSync(pgDataDir)) {
  fs.mkdirSync(pgDataDir)
}

function runMigrations() {
  console.log('Running database migrations...')
  try {
    execSync('npx prisma migrate deploy')
    console.log('✅ Migrations applied successfully.')
  } catch (e) {
    console.error('❌ Error applying migrations:', e)
    process.exit(1)
  }
}

let pg: any | null = null

export async function startEmbeddedPostgres() {
  pg = new EmbeddedPostgres({
    databaseDir: pgDataDir,
    port: 5432,
    user: 'postgres',
    password: 'password',
    persistent: true
  })

  if (fs.readdirSync(pgDataDir).length === 0) {
    await pg.initialise()
  }

  await pg.start()
  console.log('✅ Embedded PostgreSQL started')

  const dbName = 'flowers_db'
  const client = pg?.getPgClient()
  if (client) {
    try {
      await client.connect()
      const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`)
      if (res.rowCount === 0) {
        console.log(`Database '${dbName}' not found. Creating...`)
        await client.query(`CREATE DATABASE "${dbName}"`)
        console.log(`Database '${dbName}' created.`)
      } else {
        console.log(`Database '${dbName}' already exists.`)
      }
    } catch (e) {
      console.log('Error while ensuring database exists', e)
    } finally {
      await client.end()
    }
  }

  runMigrations()
}

export async function stopEmbeddedPostgres() {
  if (pg) await pg.stop()
}
