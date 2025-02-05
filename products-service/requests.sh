
curl -X POST "http://localhost:3000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iMac",
    "description": "A desktop computer",
    "stock": 100,
    "price": 1600
}' && echo "Item added to the cart."

