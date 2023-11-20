import { Pool, QueryResult } from 'pg';
import config from './config'
import getDataFromPage from './utils'

interface DataItem {
  title: string;
  imageUrl: string;
}

const pool = new Pool(config.pgsql);

const createTableQuery: string = `
  CREATE TABLE IF NOT EXISTS flats (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL
  );
`;

const truncateTableQuery: string = `
  TRUNCATE flats;
`

const initDB = async (): Promise<void> => {
  try {
    await pool.query(createTableQuery);
    await pool.query(truncateTableQuery);
    console.log('Table created or already exists');
    await populateTable();
  } catch (error) {
    console.error('Error creating table', error);
  }
};

const populateTable = async (): Promise<void> => {
  try {
    let data = await fetchDataFromSReality();
    await insertDataIntoTable(data);
  } catch (error) {
    console.error('Error populating table', error);
  }
};

const fetchDataFromSReality = async (): Promise<DataItem[]> => {
  console.log("fetchDataFromSReality started")
  let data: DataItem[] = [];

  for (let page = 1; data.length < config.fetchItems; page++) {
    
    const url = `https://www.sreality.cz/en/search/for-sale/apartments?page=${page}`;
    console.log("fetchDataFromSReality page: "+page)
    const pageData = await getDataFromPage(url);
    console.log(pageData)
    data = [...data, ...pageData];

    console.log(data.length);

  }

  return data.slice(0, config.fetchItems);
};

const insertDataIntoTable = async (data: DataItem[]): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const item of data) {
      const query = 'INSERT INTO flats(title, image_url) VALUES($1, $2) RETURNING *';
      const values = [item.title, item.imageUrl];
      await client.query(query, values);
    }

    await client.query('COMMIT');
    console.log('Data inserted into the table');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting data into the table', error);
  } finally {
    client.release();
  }
};

const getPaginatedData = async (page: number = 1, pageSize: number = 10): Promise<DataItem[]> => {
  const offset = (page - 1) * pageSize;
  const query = 'SELECT id, title, image_url FROM flats ORDER BY id OFFSET $1 LIMIT $2';
  const values = [offset, pageSize];

  try {
    const result: QueryResult = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error executing paginated query', error);
    throw new Error('Error fetching paginated data');
  }
};

const getTotalPages = async (pageSize: number = 10): Promise<number> => {
  const query = 'SELECT COUNT(*) FROM flats';
  try {
    const result: QueryResult = await pool.query(query);
    const totalItems: number = result.rows[0].count;
    return Math.ceil(totalItems / pageSize);
  } catch (error) {
    console.error('Error executing total pages query', error);
    throw new Error('Error fetching total pages');
  }
};

const getTotalCount = async (): Promise<number> => {
    const query = 'SELECT COUNT(*) FROM flats';
    try {
      const result = await pool.query(query);
      return result.rows[0].count;
    } catch (error) {
      console.error('Error executing total count query', error);
      throw new Error('Error fetching total count');
    }
  };

export { initDB, fetchDataFromSReality, populateTable, getPaginatedData, getTotalPages, getTotalCount };
