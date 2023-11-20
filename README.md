# Test Assignment Luxonis

## Description

This application scrapes the first 500 (adjustable in config) listings from the SReality portal and displays the first image and title of each listing. The page is accessible after the backend is initiated at http://localhost:8080, and listings are served in sets of 10 (adjustable in config).

The database is truncated on each startup.

No additional functionality has been added beyond the scope of the assignment intentionally. There is potential for further improvement, such as the addition of tests and the separation of business logic into a separate layer. However, it's important to note that scraping data directly from a website within the backend of a web application may not be the optimal solution. Ideally, a different microservice should continuously fill the database with fresh data. This implementation is not the best practice, but it aligns with the assignment's requirement to keep it as simple as possible.



## How run app

To run the application, follow these commands in the project's root folder:

**Run Frontend, Backend, and PostgreSQL in Docker**

```
docker-compose up --build
```


Please follow these steps to set up and test the Node.js application.

