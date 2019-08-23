const express = require('express');

const pool = require('./connection');
const router = express.Router();

router.use((req, res, next) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
    console.log("-----");
    next();
})


router.post("/user/register", (req, res) => {
    const user = req.body.user;

    if (!user.name || !user.email || !user.password) {
        console.log('error');
        res.status(400).send();
        return;
    }

    const query = `INSERT INTO Users(name, email, password) VALUES ($1::text, $2::text, $3::text)`;

    pool.query(query, [user.name, user.email, user.password]).then(() => {
        res.status(201).json({
            user: {
                name: user.name,
                email: user.email
            }
        }).send();
    }).catch(err => {
        console.log(err);
        res.status(400).send();
    });
});

router.post("/user/login", (req, res) => {
    const user = req.body.user;

    if (!user.email || !user.password) {
        console.log('error');
        res.status(400).send();
        return;
    }

    const query = `SELECT name, email FROM Users WHERE email='${user.email}' AND password='${user.password}' LIMIT 1`;

    pool.query(query).then((queryResults) => {
        const rows = queryResults.rows;

        if (rows.length > 0) {
            res.status(200).json({
                name: rows[0].name
            });
        } else {
            res.status(400).send();
        }
    }).catch(err => {
        console.log(err);
        res.status(400).send();
    })
});

router.get("/products", (req, res) => {
    const isActive = req.query.active;

    console.log(req.query)
    let query = "SELECT p.id, p.name, p.price, array_agg(pc.message ORDER BY pc.id DESC) AS comments FROM Products p LEFT JOIN Product_Comments pc ON p.id = pc.product_id";
    
    if (isActive == 1) {
        query += " WHERE active=true";
    } else if (isActive == 0) {
        query += " WHERE active=false";
    }

    console.log(query + " GROUP BY p.id");

    pool.query(query + " GROUP BY p.id").then(queryResults => {
        console.log(queryResults.rows);
        res.json(queryResults.rows);
    }).catch(err => {
        console.log(err);
        res.status(400).send();
    });
});

router.post("/products/:pid/comment", (req, res) => {
    const { message } = req.body;
    const { pid } = req.params;

    if (!message) {
        res.status(400).send();
        return;
    }

    pool.query(`INSERT INTO product_comments(message, product_id) VALUES('${message}', ${pid})`)
        .then(queryResults => {
            res.status(201).json({
                message
            }).send();
        })
        .catch(err => {
            console.log(err);
            res.status(400).send();
        });
});

module.exports = router;