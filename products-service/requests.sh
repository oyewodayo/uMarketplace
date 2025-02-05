#!/bin/bash

# Create a new product
echo "Creating a product..."
curl -X POST "http://localhost:3000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iMac",
    "description": "A desktop computer",
    "stock": 100,
    "price": 1600
  }' && echo " - Product created."

# Get a paginated list of products
echo "Fetching products list..."
curl -X GET "http://localhost:3000/products?offset=0&limit=10" && echo " - Products retrieved."

# Update stock for a specific product (PATCH)
echo "Updating product stock (PATCH)..."
curl -X PATCH "http://localhost:3000/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 50
  }' && echo " - Product stock updated."

# Update name for a specific product (PATCH)
echo "Updating product name (PATCH)..."
curl -X PATCH "http://localhost:3000/products/5/name" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro"
  }' && echo " - Product name updated."