#!/bin/bash
curl -X POST "http://localhost:9000/cart" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 145,
    "customerId": 6903,
    "qty": 6
  }'
