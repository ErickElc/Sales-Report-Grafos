# End-to-End Tests

This directory contains end-to-end tests for the Sales Report API.

## Prerequisites

**⚠️ MongoDB must be running before executing tests!**

Start MongoDB using Docker:
```bash
docker-compose up -d mongodb
```

Or if you have MongoDB installed locally:
```bash
mongod
```

## Test Structure

- `app.e2e.test.ts` - Main E2E test suite covering all API endpoints
- `setup.ts` - Test setup and teardown configuration
- `global-setup.ts` - Global setup that checks MongoDB availability
- `helpers/test-data.ts` - Helper functions to create test data

## Running Tests

### Run all E2E tests:
```bash
npm run test:e2e
```

**Note:** If MongoDB is not running, the tests will fail with a clear error message indicating that MongoDB needs to be started.

### Run with watch mode:
```bash
npm run test:watch
```

### Run with coverage:
```bash
npm run test:coverage
```

## Test Coverage

The E2E tests cover:

1. **Health Check**
   - API health status endpoint

2. **Categories API**
   - Get all categories
   - Get category by ID
   - 404 handling for non-existent categories

3. **Products API**
   - Get all products
   - Get products by category ID
   - Get product by ID
   - 404 handling for non-existent products

4. **Brands API**
   - Get all brands
   - Get brands by product ID
   - Get brand by ID
   - 404 handling for non-existent brands

5. **Sales API**
   - Get sales by brand ID (default months)
   - Get sales by brand ID with specific months
   - Get sales by brand ID with specific year

6. **Dependent Selects Flow**
   - Complete flow: Category → Products → Brands → Sales

## Test Database

Tests use a separate test database: `sales-report-test`

The test database is automatically cleaned after each test to ensure test isolation.

