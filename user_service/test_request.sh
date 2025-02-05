#!/bin/bash
curl -X POST "http://localhost:9000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "Temidayo",
    "lastname": "Oyewo",
    "username": "oyewodayo",
    "email": "oyewodayo@gmail.com",
    "password": "123456"
  }'
