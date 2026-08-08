# SRS — Microplastic Exposure & Environmental Intelligence Platform

## 1. Purpose
A platform that lets users query microplastic risk for a product/location using
an AI-generated answer grounded in real research data, and get an ML-based
prediction of concentration and risk level from input features.

## 2. Users
- **Public user**: searches products/locations, gets AI answer + prediction, no login required.
- **Researcher**: authenticated user who submits new research data entries.

## 3. Functional Requirements
- FR1: User can search a product/location and receive an AI-generated answer with citations (RAG).
- FR2: User can input features (product category, location, plastic type) and receive a prediction (concentration + risk level).
- FR3: Researcher can register/login (JWT).
- FR4: Researcher can submit a research entry (product, microplastic type, concentration, detection method, publication link).
- FR5: New research entries are embedded and stored for future retrieval.

## 4. Non-Functional Requirements
- Response time for /predict under 500ms (model already loaded in memory).
- Response time for /search under 5s (LLM round trip).
- Passwords hashed (bcrypt), JWT-based auth.

## 5. Out of Scope (v1)
- Desktop app is stretch-goal only.
- No admin moderation panel.
- No multi-language support.
