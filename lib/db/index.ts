import * as SQLite from "expo-sqlite";

const databaseName = "ailamina.db";

// integer, real, text, blob, boolean, date, datetime
const dbLayout = 
    `create table if not exists birds (
        id text primary key not null, 
        common_name integer not null, 
        status integer not null, 
        sex integer not null, 
        hatch_date integer not null, 
        taxonomic_order integer not null, 
        id1 text unique not null, 
        id2 text, 
        id3 text,
        name text unique not null,
        family integer not null,
        genus integer not null,
        species integer not null,
        sub_species integer not null,
        body_condition integer not null,
        feather_condition integer not null,
        breeding_quality integer not null,
        breeder_info text,
        mutations text,
        location text not null,
        cost real not null default 0.0,
        market_value real not null default 0.0,
        list_price real not null default 0.0,
        sold_price real not null default 0.0,
        created_at integer default (unixepoch()),
        pending integer not null default 1
    )`;

// Singleton DB
export async function getDb(){
    const db = await SQLite.openDatabaseAsync(databaseName);
    await db.execAsync('PRAGMA journal_mode = WAL');
    await db.execAsync('PRAGMA foreign_keys = ON');
    await db.withExclusiveTransactionAsync(async () => {
        await db.execAsync(dbLayout)
    })

    return db;
}


/* const statement = await db.prepareAsync(
  'INSERT INTO test (value, intValue) VALUES ($value, $intValue)'
);


//try {
//  let result = await statement.executeAsync({ $value: 'bbb', $intValue: 101 });
  console.log('bbb and 101:', result.lastInsertRowId, result.changes);

  result = await statement.executeAsync({ $value: 'ccc', $intValue: 102 });
  console.log('ccc and 102:', result.lastInsertRowId, result.changes);

  result = await statement.executeAsync({ $value: 'ddd', $intValue: 103 });
  console.log('ddd and 103:', result.lastInsertRowId, result.changes);
} finally {
  await statement.finalizeAsync();
}

// Sample Transaction
// Maybe use db.withExclusiveTransactionAsync

Promise.all([
  // 1. A new transaction begins
  db.withTransactionAsync(async () => {
    // 2. The value "first" is inserted into the test table and we wait 2
    //    seconds
    await db.execAsync('INSERT INTO test (data) VALUES ("first")');
    //await sleep(2000);

    // 4. Two seconds in, we read the latest data from the table
    const row = await db.getFirstAsync<{ data: string }>('SELECT data FROM test');

    // ❌ The data in the table will be "second" and this expectation will fail.
    //    Additionally, this expectation will throw an error and roll back the
    //    transaction, including the `UPDATE` query below since it ran within
    //    the transaction.
    //expect(row.data).toBe('first');
  }),
  // 3. One second in, the data in the test table is updated to be "second".
  //    This `UPDATE` query runs in the transaction even though its code is
  //    outside of it because the transaction happens to be active at the time
  //    this query runs.
  //sleep(1000).then(async () => db.execAsync('UPDATE test SET data = "second"')),
]);
*/
