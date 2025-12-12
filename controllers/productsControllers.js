import { getDBConnection } from '../db/db.js'

export async function getGenres(req, res) {

  try {
//Opens a new SQLite connection each time.
//Yaha db variable me database ka object aata hai jisse hum:db.all()db.run()db.get()
// jaisi SQL commands chala sakte hain.
    const db = await getDBConnection()
//Fetches unique genres.
    const genreRows = await db.all('SELECT DISTINCT genre FROM products')
    const genres = genreRows.map(row => row.genre)
    res.json(genres)//Send response to frontend

  } catch (err) {

    res.status(500).json({error: 'Failed to fetch genres', details: err.message})

  }
}

export async function getProducts(req, res) {

  try {

    const db = await getDBConnection()
//✔ Agar user ne filter na diya ho → ye base query chalegi.
//  params me wo values jayengi jo ? ke jagah bind hoti hain.
    let query = 'SELECT * FROM products'
    let params = []
//Read URL query parameters
    const { genre, search } = req.query
    //Example:/api/products?genre=rock → genre = "rock"
    // /api/products?search=cloud → search = "cloud"
//If genre filter applied
// SQL query ban jayegi:SELECT * FROM products WHERE genre = 'rock'
    if (genre) {

      query += ' WHERE genre = ?'
      params.push(genre)

    } else if (search) {

      query += ' WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?'
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern)
      
    }
    
    const products = await db.all(query, params)

    res.json(products)
//Frontend ko JSON me saare product bhej diye.

  } catch (err) {

    res.status(500).json({error: 'Failed to fetch products', details: err.message})

  }

}