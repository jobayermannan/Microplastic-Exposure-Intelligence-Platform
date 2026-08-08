# API Contract

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| POST | /auth/register | No | {email, password} | {id, email, token} |
| POST | /auth/login | No | {email, password} | {token} |
| POST | /predict | No | {product_category, location, plastic_type} | {predicted_concentration, risk_level} |
| GET | /search?q= | No | - | {answer, sources: [...]} |
| POST | /research | Yes (JWT) | {product_name, microplastic_type, concentration, detection_method, publication_link, location} | {id, created_at} |
| GET | /research | No | - | [research entries] |
| GET | /health | No | - | {status} |
