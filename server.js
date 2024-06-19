        // server.js
        const express = require('express');
        const bodyParser = require('body-parser');
        const sqlite3 = require('sqlite3').verbose();

        const app = express();
        app.use(bodyParser.json());

        const db = new sqlite3.Database(':memory:');

        db.serialize(() => {
          db.run("CREATE TABLE vacation (id INTEGER PRIMARY KEY AUTOINCREMENT, employee TEXT NOT NULL, date TEXT NOT NULL)");

          app.post('/api/vacation', (req, res) => {
            const { employee, dates } = req.body;
            const stmt = db.prepare("INSERT INTO vacation (employee, date) VALUES (?, ?)");
            
            dates.forEach(date => {
              stmt.run(employee, date);
            });

            stmt.finalize();
            res.send('Vacation dates successfully registered.');
          });

          app.get('/api/vacation', (req, res) => {
            db.all("SELECT * FROM vacation", (err, rows) => {
              res.json(rows);
            });
          });
        });

        app.listen(3000, () => {
          console.log('Server is running on port 3000');
        });