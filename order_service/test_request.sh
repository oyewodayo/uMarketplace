#!/bin/bash

# POST request to add an item to the cart
curl -X POST "http://localhost:9000/cart" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 145,
    "customerId": 6903,
    "qty": 6
  }' && echo "Item added to the cart."

# GET request to retrieve the cart details
curl -X GET "http://localhost:9000/cart" && echo "Cart details retrieved."
