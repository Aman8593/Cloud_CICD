# API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the API uses form-based authentication without token-based security. All endpoints are publicly accessible.

## Endpoints

### 1. Home Page

**GET /**

- **Description**: Serves the main landing page
- **Response**: HTML page (index.html)
- **Status Codes**:
  - 200: Success

### 2. User Login

**POST /login**

- **Description**: Authenticates user credentials
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword"
  }
  ```
- **Response**:
  - Success: Redirect to `/buynow.html`
  - Failure: Error message
- **Status Codes**:
  - 302: Redirect on success
  - 200: Error message on failure

**Example Request:**

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=user@example.com&password=password123"
```

### 3. User Registration

**POST /register**

- **Description**: Creates new user account
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "newpassword"
  }
  ```
- **Response**: Redirect to `/buynow.html`
- **Status Codes**:
  - 302: Redirect on success
  - 500: Internal server error

**Example Request:**

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=newuser@example.com&password=newpass123"
```

### 4. Car Purchase

**POST /buynow**

- **Description**: Processes car purchase request
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "country": "India",
    "selectcar": "supra",
    "phone": "+1234567890",
    "state": "California",
    "address": "123 Main St, City"
  }
  ```
- **Validation Rules**:
  - `country`: Must be one of ["India", "United States", "Japan", "Greece"]
  - `selectcar`: Must be one of the available car models
  - All fields are required
- **Response**: Success alert with redirect to home
- **Status Codes**:
  - 200: Success with JavaScript alert
  - 500: Internal server error

**Available Car Models:**

- titan_strike
- cyclone_x1
- nebula_glide
- pheonix_pulse
- viper_wave
- electra_fury
- aurora_spire
- turbo_blitz
- supra
- raptor_x
- velocity_gt

### 5. Service Booking

**POST /booking**

- **Description**: Books automotive service appointment
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "selectaservice": "Engine Servicing",
    "date": "2024-12-25",
    "specialrequest": "Please check transmission"
  }
  ```
- **Validation Rules**:
  - `selectaservice`: Must be one of ["Diagnostic Test", "Engine Servicing", "Tire Replacement", "Vacuum Cleaning"]
  - All fields are required
- **Response**: Success alert with redirect to home
- **Status Codes**:
  - 200: Success with JavaScript alert
  - 500: Internal server error

### 6. Quote Request

**POST /getaquote**

- **Description**: Submits custom service quote request
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```json
  {
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "phone": "+1987654321",
    "service": "Custom Engine Tuning",
    "quantity": 1,
    "budget": "$5000-$10,000",
    "timeline": "2 weeks",
    "comments": "Need performance upgrade"
  }
  ```
- **Validation Rules**:
  - `budget`: Must be one of ["$1000-$5000", "$5000-$10,000", "$10,000+"]
  - `quantity`: Must be a number
  - `comments`: Optional field
- **Response**: Custom HTML success page with auto-redirect
- **Status Codes**:
  - 200: Success with custom HTML response
  - 500: Internal server error

## Error Handling

### Standard Error Response

```json
{
  "error": "Error message description",
  "status": 500
}
```

### Common Error Scenarios

1. **Database Connection Failure**: Returns 500 status
2. **Validation Errors**: Returns error message
3. **Missing Required Fields**: Mongoose validation error
4. **Invalid Enum Values**: Schema validation error

## Response Formats

### Success Responses

- **Login/Register**: HTTP 302 redirect
- **Purchase/Booking**: JavaScript alert with redirect
- **Quote Request**: Custom HTML page with auto-redirect

### Error Responses

- **Text/HTML**: Error message string
- **HTTP Status**: 500 for server errors

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use.

## CORS Policy

No CORS headers are currently configured. All requests must originate from the same domain.

## Data Persistence

All form submissions are stored in MongoDB collections:

- Login data → `logins` collection
- Purchase data → `buynows` collection
- Booking data → `bookings` collection
- Quote data → `getaquotes` collection

## Security Considerations

- No authentication tokens
- No input sanitization beyond Mongoose validation
- No HTTPS enforcement
- No password hashing implemented
- Consider implementing proper security measures for production
