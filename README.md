# 🛒 Supermarket Dashboard - Data Visualization Project

![Screenshot 2025-06-11 040529](https://github.com/user-attachments/assets/792aef64-6508-4f06-8ef6-73fafd8fbd84)


A Node.js-based web dashboard application for visualizing supermarket sales data using SQLite and CSV ingestion. This project provides an interactive API backend for sales insights, customer demographics, product popularity, and revenue analytics.

---

## 📊 Project Overview

The Supermarket Dashboard visualizes various metrics from supermarket sales data stored in a local SQLite database. It processes data from a CSV file and exposes RESTful API endpoints to be consumed by a front-end dashboard (not included in this repo).

---

## 🚀 Features

- 📈 Sales Analysis by City and Product Line  
- 🧍 Customer Demographics (Gender & Type)  
- 💰 Revenue and Order Statistics  
- 🔝 Most Popular Products  
- 📦 Total Products Sold & Customer Count  
- 🗂️ Filterable Metrics by City

---

## 🛠️ Tech Stack

- **Backend Framework**: [Express.js](https://expressjs.com/)  
- **Database**: [SQLite3](https://www.sqlite.org/index.html)  
- **Data Parsing**: [csv-parser](https://www.npmjs.com/package/csv-parser)  
- **Runtime**: [Node.js](https://nodejs.org/)  
- **Static Hosting**: Express static middleware

---

## 📂 Project Structure

supermarket-dashboard/
│
├── public/ # Frontend assets (HTML/CSS/JS)
├── supermarket.db # SQLite database (auto-generated)
├── SuperMarket Analysis.csv # Raw dataset (CSV)
├── index.js # Main server application
├── package.json # Project dependencies
└── README.md # Project overview

---

## 📦 Installation

1. **Clone the Repository**

bash
git clone https://github.com/your-username/supermarket-dashboard.git
cd supermarket-dashboard

2. **Install Dependencies**
npm install

3. **Run the Server**
node index.js
The server will be available at: http://localhost:3000

--

**📊 Available API Endpoints**
| Endpoint                                    | Description                                      |
| ------------------------------------------- | ------------------------------------------------ |
| `/api/sales-by-city`                        | Get total sales grouped by city                  |
| `/api/popular-products`                     | Get total sales per product line                 |
| `/api/customer-demographics`                | Get customer type breakdown by gender            |
| `/api/total-revenue`                        | Get total revenue across all sales               |
| `/api/sales-by-product-line-filtered/:city` | Filter sales by product line for a specific city |
| `/api/top-products`                         | Get top 4 products by sales                      |
| `/api/total-sales`                          | Get fixed total sales value (static)             |
| `/api/total-orders`                         | Get total number of orders (static)              |
| `/api/average-order-value`                  | Get average value per order                      |
| `/api/total-products-sold`                  | Get total quantity of products sold              |
| `/api/customer-count`                       | Get total customer count (static)                |


**📌 Notes**
The database is automatically created and populated from the CSV file on the first run.

Static values in /api/total-sales, /api/total-orders, and /api/customer-count are hardcoded for demonstration.

Make sure SuperMarket Analysis.csv is present in the root directory.
