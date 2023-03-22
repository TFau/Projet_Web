const db = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: "./hero.sqlite"
	},
	migrations: {
		directory: 'src/database/migrations'
	},
    seeds: {
        directory: 'src/database/seeds'
    },
    debug: true
}
module.exports = db