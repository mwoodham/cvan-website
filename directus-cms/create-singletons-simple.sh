#!/bin/bash

# Directus Configuration
DIRECTUS_URL="http://localhost:8055"
DIRECTUS_TOKEN="ZPCMtnXx0CqXBJOKInjl3v8yrAgE4aVp"

echo "Creating singleton collections..."
echo ""

# 1. Create home_page collection
echo "Creating home_page collection..."
curl -X POST "$DIRECTUS_URL/collections" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "home_page",
    "meta": {
      "singleton": true,
      "icon": "home",
      "note": "Home page hero and content sections"
    },
    "schema": {}
  }'
echo ""
echo "✓ home_page collection created"
echo ""

# 2. Create about_page collection
echo "Creating about_page collection..."
curl -X POST "$DIRECTUS_URL/collections" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "about_page",
    "meta": {
      "singleton": true,
      "icon": "info",
      "note": "About page content"
    },
    "schema": {}
  }'
echo ""
echo "✓ about_page collection created"
echo ""

# 3. Create mentoring_page collection
echo "Creating mentoring_page collection..."
curl -X POST "$DIRECTUS_URL/collections" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "mentoring_page",
    "meta": {
      "singleton": true,
      "icon": "school",
      "note": "Mentoring page content"
    },
    "schema": {}
  }'
echo ""
echo "✓ mentoring_page collection created"
echo ""

# 4. Create event_submission_form collection
echo "Creating event_submission_form collection..."
curl -X POST "$DIRECTUS_URL/collections" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "event_submission_form",
    "meta": {
      "singleton": true,
      "icon": "event",
      "note": "Event submission form content and messages"
    },
    "schema": {}
  }'
echo ""
echo "✓ event_submission_form collection created"
echo ""

# 5. Create opportunity_submission_form collection
echo "Creating opportunity_submission_form collection..."
curl -X POST "$DIRECTUS_URL/collections" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "opportunity_submission_form",
    "meta": {
      "singleton": true,
      "icon": "work",
      "note": "Opportunity submission form content and messages"
    },
    "schema": {}
  }'
echo ""
echo "✓ opportunity_submission_form collection created"
echo ""

echo "All singleton collections created successfully!"
echo ""
echo "Next: You'll need to add fields to each collection through the Directus admin interface at http://localhost:8055/admin"
