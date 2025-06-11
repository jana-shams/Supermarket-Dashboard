const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const dbPath = 'supermarket.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Database initialized.');
    }
});

const initializeDatabase = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS sales (
            InvoiceID TEXT,
            Branch TEXT,
            City TEXT,
            CustomerType TEXT,
            Gender TEXT,
            ProductLine TEXT,
            UnitPrice REAL,
            Quantity INTEGER,
            Tax REAL,
            Sales REAL,
            Date TEXT,
            Time TEXT,
            Payment TEXT,
            COGS REAL,
            GrossMarginPercentage REAL,
            GrossIncome REAL,
            Rating REAL
        )`);

        db.get("SELECT COUNT(*) AS count FROM sales", (err, row) => {
            if (err) {
                console.error("Error checking table:", err);
                return;
            }
            if (row && row.count === 0) {
                console.log('Loading data into the database...');
                fs.createReadStream('SuperMarket Analysis.csv')
                    .pipe(csv())
                    .on('data', (data) => {
                        db.run(`
                            INSERT INTO sales (InvoiceID, Branch, City, CustomerType, Gender, ProductLine, UnitPrice, Quantity, Tax, Sales, Date, Time, Payment, COGS, GrossMarginPercentage, GrossIncome, Rating)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `, [
                            data['Invoice ID'], data['Branch'], data['City'], data['Customer type'], data['Gender'],
                            data['Product line'], data['Unit price'], data['Quantity'], data['Tax 5%'],
                            data['Sales'], data['Date'], data['Time'], data['Payment'], data['cogs'],
                            data['gross margin percentage'], data['gross income'], data['Rating']
                        ]);
                    })
                    .on('end', () => {
                        console.log('CSV data loaded into the database.');
                    });
            }
        });
    });
};

initializeDatabase();

const queryDatabase = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

app.get('/api/sales-by-city', async (req, res) => {
    try {
        const rows = await queryDatabase(`SELECT City, SUM(Sales) AS total_sales FROM sales GROUP BY City ORDER BY total_sales DESC`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/popular-products', async (req, res) => {
    try {
        const rows = await queryDatabase(`SELECT ProductLine, SUM(Sales) AS total_sales FROM sales GROUP BY ProductLine ORDER BY total_sales DESC`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/customer-demographics', async (req, res) => {
    try {
        const rows = await queryDatabase(`SELECT Gender, CustomerType, COUNT(*) AS count FROM sales GROUP BY Gender, CustomerType`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/total-revenue', async (req, res) => {
    try {
        const row = await queryDatabase(`SELECT SUM(Sales) AS totalRevenue FROM sales`);
        res.json({ totalRevenue: row[0].totalRevenue });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/sales-by-product-line-filtered/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const rows = await queryDatabase(`
            SELECT ProductLine, SUM(Sales) AS total_sales
            FROM sales
            WHERE City = ?
            GROUP BY ProductLine
            ORDER BY total_sales DESC
        `, [city]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/top-products', async (req, res) => {
    try {
        const rows = await queryDatabase(`
            SELECT ProductLine, SUM(Sales) AS total_sales
            FROM sales
            GROUP BY ProductLine
            ORDER BY total_sales DESC
            LIMIT 4
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/total-sales', async (req, res) => {
    const TotalSales = 1726268.00;
    res.json({ totalSales: TotalSales });
});

app.get('/api/total-orders', async (req, res) => {
    const TotalOrders = 472915;
    res.json({ totalOrders: TotalOrders });
});

app.get('/api/average-order-value', async (req, res) => {
    try {
        const row = await queryDatabase(`SELECT AVG(Sales) AS averageOrderValue FROM sales`);
        res.json({ averageOrderValue: row[0].averageOrderValue });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/total-products-sold', async (req, res) => {
    try {
        const row = await queryDatabase(`SELECT SUM(Quantity) AS totalProductsSold FROM sales`);
        res.json({ totalProductsSold: row[0].totalProductsSold });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/customer-count', async (req, res) => {
    const CustomerCount = 2815420;
    res.json({ customerCount: CustomerCount });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});