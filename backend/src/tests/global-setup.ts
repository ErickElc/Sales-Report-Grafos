module.exports = async () => {
  // Check if MongoDB is available before running tests
  const mongoose = require('mongoose');
  const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/sales-report-test';
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    await mongoose.connection.close();
    console.log('✅ MongoDB is available for tests');
  } catch (error) {
    console.error('❌ MongoDB is not available!');
    console.error('Please start MongoDB first:');
    console.error('  docker-compose up -d mongodb');
    console.error('  or');
    console.error('  mongod');
    process.exit(1);
  }
};

