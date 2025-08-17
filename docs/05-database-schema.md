# Database Schema Documentation

## Database Overview

- **Database Type**: MongoDB (NoSQL Document Database)
- **ODM**: Mongoose
- **Connection**: Environment variable `mongoURL`

## Collections

### 1. Login Collection

**Collection Name**: `logins`
**Purpose**: Store user authentication credentials

```javascript
const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
});
```

**Field Details:**

- `email`: User's email address (String, Required)
- `pass`: User's password (String, Required)

**Indexes**: Automatic MongoDB `_id` index

**Sample Document:**

```json
{
  "_id": "ObjectId('...')",
  "email": "user@example.com",
  "pass": "userpassword",
  "__v": 0
}
```

### 2. BuyNow Collection

**Collection Name**: `buynows`
**Purpose**: Store car purchase requests

```javascript
const buynowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  country: {
    type: String,
    required: true,
    enum: ["India", "United States", "Japan", "Greece"],
  },
  selectcar: {
    type: String,
    required: true,
    enum: [
      "titan_strike",
      "cyclone_x1",
      "nebula_glide",
      "pheonix_pulse",
      "viper_wave",
      "electra_fury",
      "aurora_spire",
      "turbo_blitz",
      "supra",
      "raptor_x",
      "velocity_gt",
    ],
  },
  phone: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
});
```

**Field Details:**

- `name`: Customer's full name (String, Required)
- `email`: Customer's email address (String, Required)
- `country`: Customer's country (Enum, Required)
- `selectcar`: Selected car model (Enum, Required)
- `phone`: Customer's phone number (String, Required)
- `state`: Customer's state/province (String, Required)
- `address`: Customer's full address (String, Required)

**Enum Values:**

- **Countries**: India, United States, Japan, Greece
- **Car Models**: titan_strike, cyclone_x1, nebula_glide, pheonix_pulse, viper_wave, electra_fury, aurora_spire, turbo_blitz, supra, raptor_x, velocity_gt

**Sample Document:**

```json
{
  "_id": "ObjectId('...')",
  "name": "John Doe",
  "email": "john@example.com",
  "country": "United States",
  "selectcar": "supra",
  "phone": "+1234567890",
  "state": "California",
  "address": "123 Main Street, Los Angeles, CA 90210",
  "__v": 0
}
```

### 3. Booking Collection

**Collection Name**: `bookings`
**Purpose**: Store service appointment bookings

```javascript
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  selectaservice: {
    type: String,
    required: true,
    enum: [
      "Diagnostic Test",
      "Engine Servicing",
      "Tire Replacement",
      "Vacuum Cleaning",
    ],
  },
  date: { type: String, required: true },
  specialrequest: { type: String, required: true },
});
```

**Field Details:**

- `name`: Customer's full name (String, Required)
- `email`: Customer's email address (String, Required)
- `selectaservice`: Selected service type (Enum, Required)
- `date`: Appointment date (String, Required)
- `specialrequest`: Special service requests (String, Required)

**Enum Values:**

- **Services**: Diagnostic Test, Engine Servicing, Tire Replacement, Vacuum Cleaning

**Sample Document:**

```json
{
  "_id": "ObjectId('...')",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "selectaservice": "Engine Servicing",
  "date": "2024-12-25",
  "specialrequest": "Please check transmission fluid",
  "__v": 0
}
```

### 4. GetAQuote Collection

**Collection Name**: `getaquotes`
**Purpose**: Store custom service quote requests

```javascript
const getaquoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  quantity: { type: Number, required: true },
  budget: {
    type: String,
    enum: ["$1000-$5000", "$5000-$10,000", "$10,000+"],
    required: true,
  },
  timeline: { type: String, required: true },
  comments: { type: String },
});
```

**Field Details:**

- `name`: Customer's full name (String, Required)
- `email`: Customer's email address (String, Required)
- `phone`: Customer's phone number (String, Required)
- `service`: Description of requested service (String, Required)
- `quantity`: Number of services/items (Number, Required)
- `budget`: Budget range (Enum, Required)
- `timeline`: Expected completion timeline (String, Required)
- `comments`: Additional comments (String, Optional)

**Enum Values:**

- **Budget Ranges**: $1000-$5000, $5000-$10,000, $10,000+

**Sample Document:**

```json
{
  "_id": "ObjectId('...')",
  "name": "Bob Johnson",
  "email": "bob@example.com",
  "phone": "+1987654321",
  "service": "Custom Engine Tuning",
  "quantity": 1,
  "budget": "$5000-$10,000",
  "timeline": "2 weeks",
  "comments": "Need performance upgrade for track use",
  "__v": 0
}
```

## Database Connection

### Connection Configuration

```javascript
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose
  .connect(process.env.mongoURL)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("Connection failed");
  });
```

### Environment Variables

- `mongoURL`: MongoDB connection string (stored in `.env` file)

## Data Validation

### Mongoose Validation Features

- **Required Fields**: All schemas use `required: true` for mandatory fields
- **Enum Validation**: Predefined values for dropdown selections
- **Type Validation**: String, Number type enforcement
- **Automatic Validation**: Mongoose validates before saving

### Validation Error Handling

```javascript
try {
  await Collection.create(data);
  // Success response
} catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}
```

## Indexing Strategy

### Current Indexes

- **Automatic**: MongoDB creates `_id` index for all collections
- **Email Fields**: Consider adding indexes for email fields for faster queries

### Recommended Indexes

```javascript
// For faster email lookups
db.logins.createIndex({ email: 1 });
db.buynows.createIndex({ email: 1 });
db.bookings.createIndex({ email: 1 });
db.getaquotes.createIndex({ email: 1 });

// For date-based queries on bookings
db.bookings.createIndex({ date: 1 });
```

## Data Relationships

### Current Design

- **No Foreign Keys**: Each collection is independent
- **Denormalized**: User data is duplicated across collections
- **No Joins**: Simple document-based queries

### Potential Relationships

- Link purchases, bookings, and quotes to user accounts
- Create user profile collection with references
- Implement order history tracking

## Backup and Recovery

### Recommended Backup Strategy

- **Regular Backups**: Daily automated backups
- **Point-in-Time Recovery**: MongoDB Atlas automatic backups
- **Export Scripts**: Regular data exports for disaster recovery

### Data Retention

- Consider implementing data retention policies
- Archive old bookings and quotes
- Maintain user data according to privacy regulations
