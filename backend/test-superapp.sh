#!/bin/bash

# Demo user emails
USER1="alice@example.com"
USER2="bob@example.com"

echo "=== SIGNUP USERS ==="
USER1_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/signup \
-H "Content-Type: application/json" \
-d "{\"email\":\"$USER1\",\"password\":\"password123\"}")

USER2_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/signup \
-H "Content-Type: application/json" \
-d "{\"email\":\"$USER2\",\"password\":\"password123\"}")

USER1_ID=$(echo $USER1_RESPONSE | jq -r '.user.id')
USER2_ID=$(echo $USER2_RESPONSE | jq -r '.user.id')

echo "User1 ID: $USER1_ID"
echo "User2 ID: $USER2_ID"

echo "=== CHECK WALLET BALANCES ==="
curl -s http://localhost:4000/api/v1/wallets/$USER1_ID/balance | jq
curl -s http://localhost:4000/api/v1/wallets/$USER2_ID/balance | jq

echo "=== SEND MONEY ==="
curl -s -X POST http://localhost:4000/api/v1/wallets/$USER1_ID/send \
-H "Content-Type: application/json" \
-d "{\"to\":\"$USER2\",\"amount\":50}" | jq

echo "=== CREATE LISTING ==="
LISTING_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/listings \
-H "Content-Type: application/json" \
-d "{\"title\":\"iPhone 15\",\"description\":\"Brand new\",\"price\":1200}")

LISTING_ID=$(echo $LISTING_RESPONSE | jq -r '.listing.id')
echo "Created Listing ID: $LISTING_ID"

echo "=== GET LISTINGS ==="
curl -s http://localhost:4000/api/v1/listings | jq

echo "=== CREATE CHAT ==="
CHAT_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/chats \
-H "Content-Type: application/json" \
-d "{\"participants\":[\"$USER1_ID\",\"$USER2_ID\"]}")

CHAT_ID=$(echo $CHAT_RESPONSE | jq -r '.chat.id')
echo "Created Chat ID: $CHAT_ID"

echo "=== SEND MESSAGE ==="
curl -s -X POST http://localhost:4000/api/v1/chats/$CHAT_ID/messages \
-H "Content-Type: application/json" \
-d "{\"senderId\":\"$USER1_ID\",\"body\":\"Hello Bob!\"}" | jq

echo "=== GET MESSAGES ==="
curl -s http://localhost:4000/api/v1/chats/$CHAT_ID/messages | jq
