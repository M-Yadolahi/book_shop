import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { cart } = req.body;
    const uri = process.env.MONGOURL;
    
    if (!uri) {
      return res.status(500).json({ message: 'Database connection string not found' });
    }

    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const usersCollection = db.collection('users');

      // Clear all existing documents in the users collection
      await usersCollection.deleteMany({});
      
      // Insert or update the cart in the users collection
      await usersCollection.insertOne({ cart });

      res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Failed to add cart to the database' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
