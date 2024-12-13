import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {

    const url = "mongodb+srv://MuhammadUbaid:786125@cluster0.k2aq8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    const client = new MongoClient(url);
    await client.connect();

    try {

        const db = client.db("Stock");
        const inventory = db.collection("Inventory");

        const query = {}

        const products = await inventory.find(query).toArray();


        console.log("Successfully connected to Atlas");
        return NextResponse.json({ success: true, products });

    } catch (err) {
        console.log('Not connected to Atlas');
    }


}

export async function POST(request) {
    let body = await request.json();

    const url = "mongodb+srv://MuhammadUbaid:786125@cluster0.k2aq8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    const client = new MongoClient(url);
    await client.connect();

    try {

        const db = client.db("Stock");
        const inventory = db.collection("Inventory");

        const product = await inventory.insertOne(body)


        console.log(product);
        console.log("Successfully connected to Atlas");

        return NextResponse.json({ product, ok: true });

    } catch (err) {
        console.log('Not connected to Atlas');
    }


}

export async function DELETE(req) {
    const id = req.nextUrl.searchParams.get('id');
    console.log(id);


    const url = "mongodb+srv://MuhammadUbaid:786125@cluster0.k2aq8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    const client = new MongoClient(url);
    await client.connect();

    try {
        const db = client.db("Stock");
        const inventory = db.collection("Inventory");

        const result = await inventory.deleteOne({ _id: new ObjectId(id) });
        console.log(result);
        if (result.deletedCount == 1) {
            return NextResponse.json({ message: 'Product deleted successfully!' });
        } else {
            return NextResponse.json({ message: 'Product not found!' }, { status: 404 });
        }

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false });
    }
}