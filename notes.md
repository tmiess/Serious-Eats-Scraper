mongodb://heroku_0hqkbv9s:6vrbks5g3fq1j6k45v2v36i9vm@ds245277.mlab.com:45277/heroku_0hqkbv9s

When you’re ready to connect Mongoose with your remote database, you'll need to add it as an environment variable on Heroku:

* As a reminder, you can check for the environment variable and fall back to a local mongo server:
```
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database    
`var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";`
```

* Then, just pass the `MONGODB_URI` variable to `mongoose.connect`. If you define `MONGODB_URI` on heroku, your production app will automatically use the remote database

* You shouldn't connect to the remote database when developing locally. Your classroom's network may
not function if you do (but it's also best practice to use a local databse for development).