# Gatherly 

## Development
To run this app you will need two terminal windows, one for the server and one for the client.
In terminal 1:
Optional - set MONGO_URI to be the connection string to your MongoDB
```
cd server
npm install
npm start
```
In terminal 2:
```
cd buyer-web
npm install
npm run dev
```
Point your browser at localhost:5173 and see this app working.  Go ahead and sign up and see the document appear in the database

In terminal 3:
```
cd seller-web
npm install
npm run dev
```
Point your browser at localhost:5174 and see this app working.  Go ahead and sign up and see the document appear in the database
