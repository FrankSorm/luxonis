import express from 'express';
import config from './config'
import { initDB, getPaginatedData, getTotalPages, getTotalCount } from './db';

const app = express();
const port = 8081;

initDB();

app.get('/api/data', async (req: any, res: any) => {
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = parseInt(req.query.pageSize as string) ||  config.defaultPerPage;
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    try {
      const data = await getPaginatedData(page, pageSize);
      const totalPages = await getTotalPages(pageSize);
      const totalCount = await getTotalCount();
      console.log({ data, page, totalPages, totalCount })
      res.json({ data, page, totalPages, totalCount });
    } catch (error) {
      console.error('Error fetching paginated data', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});