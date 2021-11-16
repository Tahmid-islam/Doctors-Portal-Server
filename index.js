const express = require("express");
const { MongoClient } = require("mongodb");
const admin = require("firebase-admin");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
const stripe = require("stripe")(
  sk_test_51IgBWFJnP3U4GjEn3c9mOk3zkK8gBxmLiQHssOvcKxAVsxe0UZkjoU1lfSlu1xqa9jzaOALDXfWhaddkrQgiyX8d00sA6hQz73
);
const fileUpload = require("express-fileUpload");

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "doctors-portal-9b37a",
    private_key_id: "6a9b585f0efda547eca5023f4b8fc35558b1a98d",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCd5gyVXBRQsZ5b\nicH/zh7dbHLYD3/rnwjxuEjBWKRCtbyFu/3UnnbJWlgGeqdpioswgUDzZ/Bf4TN9\nMn8jTD41nvNXUFOTkXuutltJAmIj7geXkg+rvxhQJjgP2EVPOZil3gH+jejCjzFR\n2/gm3d5M5mwNdNOK6eaB7I7Op+Zy3vIY+D/2nLmAHMNDxTLJHtjSIOC+z1r/5uJ+\nBKemsYt58rxcKkLzGMxuVz5lKV+r+XgqDFWyk8Xky9roUhD9ehmjx6o0UFBJ6BOh\n+jnTj7UHdNU5pIa4dsMXF74AL4DkWmiP3sGN9vWsPVhUWl2hjwPCjHdphHNTWZta\nVPHmtKNvAgMBAAECggEAAu9X6YjPdIaF/9k/gA6Sl/a1lcWH+6xg7AP1uj5NuKhh\ny4c92xoM8YYv362fogBqFj84zVgaaYspPAOtxaKw/1R9MnDISj8TMkv/xgt4y9vX\nS/PHkx+CB1oGgxONNOvy+0D1VDLKvPRmFsmaGGLZsx/kqfAIz0AKFv0mKbozjYwG\n2iWT4k3mCTuoGxiqxpj2ug5L3U/FQqZHZJTPiXKcFltDdZS+5rv/oFBEMPfOaARv\nbgAu4qFc/MCiLZEBGi/XLUa0fYz4qdvfQcLAKXdpB6lE5z8LybMVrfhQrohSibON\nD7Ty2AHSgLghuYYZaVqjzhhCPflQYWIlnReXHAWOoQKBgQDRAAW26P5dLzzXAB0r\nbCroD3LmvXe7OmTx6+SyNfwllhYCpXIKYWVLDydLjjyWcv5Raoo69Q5I1hjI2O9K\nTOOxDziZgt6o5m2GpWpDszgUOa2mKmUgeIWEQ0elOcfmLLDIVCssZex6TDe3rVIv\n/3cQcMLuqSdanEifdIhhGDwpoQKBgQDBaCeFrjhmhAGUwL6TsF4slF8L2HB6GeAU\nL5dD4LBP3cOdsO6wZRmZMYlv74xaTKneZjR6MD9F5zxQd9zxqSOfymrl6JTzCz4S\nnYCIEPN03feKTBjmQC3mTpPkMvJ//PWBbUKdiWlUEWWb0kFRcFjIrezotPf5XGpD\nnUD7gU9TDwKBgE3ogjjS1a8K4tUKl9UN91iWGbDlw/IpLGP6GUBNW3bvYbkOz1oL\nQGUgevdxSCiVKTRUUL71hqOkG40TQPAjhWUFVYX0AOhZLU7Z7qjZ7/eqII8mkpfu\nFWdeZSC0T04ALs4eghGE1QgpzUNM+qwlwM6CGkg5ChB+3ZuDJyt6i0LBAoGBAIDo\nS9dU7LCfcXJVGXDUj6BE8Ci0BRvM3UZ3Beou+zTwSW50PFMDv5EUrFcYIcMZ7+qU\n0otSVwnfeprjmTbVFjJtttwwLf7kUmYT5lRKgAo328Kov7vPsQgc/YOO1YSq9HNk\ngI8BxFtNER1PgUunhvWSvyHHZLQmfYk9ac94O4fPAoGBAKs/PnUNxOha/VaBk6k9\nUXgjdyaJlYyVkMvZ3aE2hYOJypuJoOrNfVKe7GSwjjaI2NUT/kgX2a7xFfonbJch\nDZZ2eM2iQUxPcoEcUvm82GCq80d+UbYP7TT10j7cX0/nmgVxudL0j8xWP0AbTU9Y\n6R8RXHrWWnIpshNuzlZinb3f\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-2lxyr@doctors-portal-9b37a.iam.gserviceaccount.com",
    client_id: "107402487256959249853",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2lxyr%40doctors-portal-9b37a.iam.gserviceaccount.com",
  }),
});

// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://doctorDB:jfpAcuNOVPqXwIec@cluster0.nsljh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const token = req.headers?.authorization?.split(" ")[1];
    try {
      const decodedUser = await admin.auth().verifyIdToken(token);
      req.decodedEmail = decodedUser.email;
    } catch {}
  }
  next();
}

async function run() {
  try {
    await client.connect();
    const database = client.db("doctors_portal");
    const appointmentsCollection = database.collection("appointments");
    const usersCollection = database.collection("users");
    const doctorsCollection = database.collection("doctors");

    app.get("/appointments", verifyToken, async (req, res) => {
      const email = req.query.email;
      const date = req.query.date;
      const query = { email: email, date: date };
      const cursor = appointmentsCollection.find(query);
      const appointments = await cursor.toArray();
      res.json(appointments);
    });

    app.get("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await appointmentsCollection.findOne(query);
      res.json(result);
    });

    app.put("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          payment: payment,
        },
      };
      const result = await appointmentsCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    app.post("/appointments", async (req, res) => {
      const appointment = req.body;
      const result = await appointmentsCollection.insertOne(appointment);
      res.json(result);
    });

    app.get("/doctors", async (req, res) => {
      const cursor = doctorsCollection.find({});
      const doctors = await cursor.toArray();
      res.json(doctors);
    });

    app.post("/doctors", async (req, res) => {
      const name = req.body.name;
      const email = req.body.email;
      const pic = req.files.image;
      const picData = pic.data;
      const encodedPic = picData.toString("base64");
      const imageBuffer = Buffer.from(encodedPic, "base64");
      const doctor = {
        name,
        email,
        image: imageBuffer,
      };
      const result = await doctorsCollection.insertOne(doctor);
      res.json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    app.put("/users/admin", verifyToken, async (req, res) => {
      const user = req.body;
      const requester = req.decodedEmail;
      if (requester) {
        const requesterAccount = await usersCollection.findOne({
          email: requester,
        });
        if (requesterAccount?.role === "admin") {
          const filter = { email: user.email };
          const updateDoc = {
            $set: { role: "admin" },
          };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);
        }
      } else {
        res
          .status(403)
          .json({ message: "you do not have access to make admin" });
      }
    });

    app.post("/create-payment-intent", async (req, res) => {
      const paymentInfo = req.body;

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentInfo.price * 100,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Doctors Portal!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});

// app.get("/users");
// app.post("/users");
// app.get("/users/:id");
// app.put("/users: id");
// app.delete("/users: id");
// users: get
// users: post
