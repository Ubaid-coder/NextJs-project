import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let { action, slug, initialQuantity } = await request.json();
    console.log(slug);


    const url = "mongodb+srv://MuhammadUbaid:786125@cluster0.k2aq8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    const client = new MongoClient(url);
    await client.connect();

    try {
        const db = client.db("Stock");
        const inventory = db.collection("Inventory");


        const filter = { slug: slug };


        let newQuantity = action == 'plus' ? parseInt(initialQuantity + 1) : parseInt(initialQuantity > 0 && initialQuantity - 1);

        const updateDoc = {
            $set: {
                quantity: newQuantity
            },
        };
        // Update the first document that matches the filter
        const result = await inventory.updateOne(filter, updateDoc);

        // Print the number of matching and modified documents
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );
        return NextResponse.json({ success: true, message: `Updated quantity of ${slug} to ${newQuantity}` });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: 'Failed to update quantity' });
    }
}