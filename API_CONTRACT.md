# REST API Contract 

**Base URL:** `http://localhost:5000/api/v1` (Local) 
**Auth:** Single JWT (24-hour expiry). Header: `Authorization: Bearer <token>`
**Content-Type:** `application/json`

---

## 1. Authentication

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new user (Driver/Officer) | Public |
| `POST` | `/auth/login` | Login, returns 24h JWT | Public |
| `POST` | `/auth/logout` | Client-side discard token | JWT |
| `GET` | `/auth/me` | Get current user profile | JWT |
| `PUT` | `/auth/change-password`| Change password | JWT |

**`POST /auth/login`**
* **Req:** `{"email": "...", "password": "..."}`
* **Res (200):** `{"success": true, "data": {"token": "eyJ...", "expiresIn": 86400, "user": {...}}}`

---

## 2. Fine Categories

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/fine-categories` | List active categories (`?active=true`) | Public |
| `GET` | `/fine-categories/:id` | Get single category | Public |
| `POST` | `/fine-categories` | Create category | ADMIN |
| `PUT` | `/fine-categories/:id` | Update category | ADMIN |
| `DELETE`| `/fine-categories/:id` | Deactivate category | ADMIN |

**`GET /fine-categories`**
* **Res (200):** `{"success": true, "data": [{"categoryId": "...", "code": "SP-01", "name": "Speeding...", "amount": 1500, "isActive": true}]}`

---

## 3. Fines

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/fines` | Issue new traffic fine | OFFICER |
| `GET` | `/fines/lookup` | Public lookup (`?referenceNo=&categoryCode=`) | Public |
| `GET` | `/fines/:id` | Get fine by ID | JWT |
| `GET` | `/fines` | List all fines (paginated) | ADMIN |
| `GET` | `/fines/my` | Driver's fines | DRIVER |
| `GET` | `/fines/officer/issued`| Officer's issued fines | OFFICER |
| `PATCH`| `/fines/:id/cancel` | Cancel unpaid fine | ADMIN/OFFICER|

**`POST /fines`** (Issue Fine)
* **Req:** `{"vehicleNo": "CAB-1234", "categoryId": "...", "districtId": "...", "location": {"address": "..."}}`
* **Res (201):** `{"success": true, "data": {"fineId": "...", "referenceNo": "TF-20260513-000123", "status": "PENDING", "dueDate": "..."}}`

**`GET /fines/lookup`** (Before Payment)
* **Req:** Query `?referenceNo=TF-20260513-000123&categoryCode=SP-01`
* **Res (200):** `{"success": true, "data": {"fineId": "...", "amount": 1500, "status": "PENDING", "district": "Colombo", ...}}`

---

## 4. Payments (Mock Gateway)

*Note: Real payment gateways removed. This mock endpoint strictly accepts payment details, marks fine as PAID, and triggers SMS synchronously.*

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/payments/mock-confirm` | Pay fine (Always succeeds) | Public/DRIVER |
| `GET` | `/payments/:paymentId` | Get receipt | JWT |
| `GET` | `/payments/fine/:fineId` | Get payment by fine | JWT |
| `GET` | `/payments` | List all payments | ADMIN |

**`POST /payments/mock-confirm`**
* **Req:** `{"fineId": "...", "referenceNo": "...", "categoryCode": "...", "payerName": "...", "payerPhone": "...", "paymentMethod": "CARD", "cardNumber": "1234"}`
* **Res (200):** `{"success": true, "data": {"paymentId": "...", "receiptNo": "RCP-...", "status": "SUCCESS", "amount": 1500, "smsSent": true}}`

---

## 5. Notifications

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/notifications/officer/history`| SMS log for officer | OFFICER |
| `POST` | `/notifications/sms/resend/:id` | Manually resend SMS | ADMIN/OFFICER |
| `GET` | `/notifications/admin/summary`| SMS delivery stats | ADMIN |

---

## 6. Analytics

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/analytics/summary` | National KPIs (`?from=&to=`) | ADMIN |
| `GET` | `/analytics/by-district` | District totals | ADMIN |
| `GET` | `/analytics/by-category` | Category totals | ADMIN |
| `GET` | `/analytics/trend` | Trend line (`?granularity=daily\|monthly`) | ADMIN |

**`GET /analytics/summary`**
* **Res (200):** `{"success": true, "data": {"totalFinesIssued": 12540, "totalRevenueLKR": 18750000, "collectionRate": 78.4}}`

---

## 7. Districts

*Note: Read-only. Frontend should hardcode these 25 districts.*

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/districts` | List 25 districts | Public |
| `GET` | `/districts/:id` | Get single district | Public |

---

## 8. Users

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | List users | ADMIN |
| `GET` | `/users/:id` | Get user profile | ADMIN |
| `PUT` | `/users/:id` | Update details | ADMIN/Self |
| `PATCH`| `/users/:id/status` | Activate/Deactivate (`isActive`) | ADMIN |
| `GET` | `/users/officers` | List officers | ADMIN |

**`PATCH /users/:id/status`**
* **Req:** `{"isActive": false}`
* **Res (200):** `{"success": true, "data": {"userId": "...", "isActive": false}}`