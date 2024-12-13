import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

    const query = request.nextUrl.searchParams.get('query');

    const url = "mongodb+srv://MuhammadUbaid:786125@cluster0.k2aq8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    const client = new MongoClient(url);
    await client.connect();

    try {

        const db = client.db("Stock");
        const inventory = db.collection("Inventory");
        

        const products = await inventory.aggregate([
            {
                $match: {
                    $or: [
                        { slug: { $regex: query, $options: 'i' } }
                    ]
                }
            }
        ]).toArray();

        console.log("Successfully connected to Atlas");
        return NextResponse.json({ success: true, products });

    } catch (err) {
        return NextResponse.json({ error: err});
    }


}
