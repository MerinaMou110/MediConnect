
# 🏥 MediConnect – Backend API for a Smart Healthcare System

**MediConnect** is a Django-based RESTful backend system designed to streamline communication between patients and doctors. It offers core healthcare features like appointment booking, prescription management, and secure user authentication — all via clean and scalable APIs.

> Built with Django REST Framework, secured using JWT, and ready for production with Docker.


## 📌 Project Highlights

- **Role-Based System**: Separate logic for patients, doctors, and admins
- **Secure Authentication**: JWT-based login and access control
- **Appointment Management**: Patients can book/cancel; doctors can view/manage
- **Prescription Module**: Doctors can create prescriptions; patients can view them
- **Medical Records**: Easy access to health history and reports
- **Email Notifications**: For appointment confirmations and updates (via Celery & Redis)
- **Admin Panel**: Django admin for managing users, records, and system data
- **Dockerized**: Easy deployment with PostgreSQL, Redis, Celery, and Gunicorn


## ⚙️ Technologies Used

- **Python**, **Django**, **Django REST Framework**
- **JWT Authentication** (`SimpleJWT`)
- **PostgreSQL** as primary database
- **Celery** + **Redis** for asynchronous tasks
- **Docker & Docker Compose** for containerized development
- **Gunicorn** as WSGI server in production



## 🔐 Authentication

- Uses JWT (JSON Web Tokens) for secure login/logout
- Custom permissions for patients, doctors, and admin access
- Token refresh system included


## 🔗 **API Endpoints Overview**

### 📦 **Authentication & User Management** (`/api/user/`)
| Method | Endpoint                                  | Description                                 | Access     |
|--------|-------------------------------------------|---------------------------------------------|------------|
| POST   | `/api/user/register/`                     | Register new user                           | Public     |
| POST   | `/api/user/login/`                        | Login user and get JWT token                | Public     |
| POST   | `/api/user/send-reset-password-email/`    | Send password reset link to email           | Public     |
| POST   | `/api/user/reset-password/<uid>/<token>/` | Reset password using token                  | Public     |
| GET    | `/api/user/activate/<uid>/<token>/`       | Activate user account                       | Public     |
| GET    | `/api/user/profile/`                      | Get current user profile                    | Authenticated |
| POST   | `/api/user/changepassword/`               | Change current user's password              | Authenticated |
| GET    | `/api/user/user-list/`                    | List all users (admin only)                 | Admin      |
| POST   | `/api/user/admin/approve/`                | Admin approves pending users                | Admin      |
---

### 📅 **Appointments** (`/api/appointment/`)
| Method | Endpoint                                      | Description                                     | Access     |
|--------|-----------------------------------------------|-------------------------------------------------|------------|
| POST   | `/api/appointment/book-appointment/`          | Book an appointment (patient only)             | Authenticated |
| GET    | `/api/appointment/my-appointments/`           | View my appointments                           | Authenticated |
| POST   | `/api/appointment/<int:pk>/complete/`         | Mark an appointment as completed (doctor/admin)| Doctor/Admin |
---

### 👨‍⚕️ **Doctors** (`/api/`)
| Method | Endpoint                                                      | Description                                     | Access     |
|--------|---------------------------------------------------------------|-------------------------------------------------|------------|
| GET    | `/api/doctors/`                                               | List all doctors                                | Public     |
| GET    | `/api/doctors/<int:pk>/`                                      | Get detail of a doctor                          | Public     |
| GET    | `/api/doctors/<int:doctor_id>/available-times/`              | List available times for a doctor               | Public     |
| GET    | `/api/doctors/reviews/`                                       | List all doctor reviews                         | Public     |
| POST   | `/api/doctors/reviews/create/`                                | Create a review (authenticated patient)         | Authenticated |
| GET/POST| `/api/doctors/specializations/`                              | List/Create specializations (admin)             | Admin      |
| GET/POST| `/api/doctors/designations/`                                 | List/Create designations (admin)                | Admin      |
| GET/PUT| `/api/doctors/specializations/<int:pk>/`                      | Retrieve/Update/Delete specialization           | Admin      |
| GET/PUT| `/api/doctors/designations/<int:pk>/`                         | Retrieve/Update/Delete designation              | Admin      |
| GET/PUT| `/api/doctors/profile/`                                       | Doctor update own profile                       | Doctor     |
| GET    | `/api/doctors/me/available-times/list/`                       | List available time slots (doctor)              | Doctor     |
| POST   | `/api/doctors/me/available-times/`                            | Create available time slots (doctor)            | Doctor     |
| PUT    | `/api/doctors/me/available-times/<int:pk>/`                   | Update available time slots                     | Doctor     |
---


### 🧑‍⚕️ **Patients** (`/api/`)
| Method | Endpoint                                | Description                            | Access     |
|--------|-----------------------------------------|----------------------------------------|------------|
| GET    | `/api/patients/`                        | List all patients (admin/doctor)       | Admin/Doctor |
| GET    | `/api/patients/<int:pk>/`               | Get specific patient details           | Admin/Doctor |
| GET    | `/api/patient/profile/`                 | Get current patient profile            | Patient    |
---

### 📋 **Electronic Medical Records (EMR)** (`/api/`)
| Method | Endpoint                              | Description                                  | Access     |
|--------|---------------------------------------|----------------------------------------------|------------|
| GET/POST | `/api/emr/`                         | List or create EMR (doctor only)             | Doctor     |
| GET    | `/api/emr/<int:pk>/`                  | Retrieve specific EMR                        | Doctor/Patient |
| GET    | `/api/emr/<int:pk>/pdf/`              | Download EMR as PDF                          | Authenticated |
---

You can explore the full API through Django's browsable API or use the Postman collection provided in the repo.



## 🚀 How to Run Locally (with Docker)

```bash
git clone https://github.com/yourusername/mediconnect.git
cd mediconnect
cp .env.example .env
docker-compose up --build
```

- Visit the app: `http://localhost:8000/`
- Admin Panel: `http://localhost:8000/admin/`

---

## 🧪 Sample Test Users

| Role    | Email                | Password     |
|---------|----------------------|--------------|
| Admin   | admin@example.com    | admin123     |
| Doctor  | doctor@example.com   | doctor123    |
| Patient | patient@example.com  | patient123   |

---

## 🔄 Future Improvements

- Payment integration (e.g., Stripe or SSLCommerz)
- Real-time chat between patient and doctor (WebSocket/Django Channels)
- Frontend in React or Next.js (optional)

---

## 🧑‍💻 Author

Built with ❤️ by **Merina Rahaman Mou**

[LinkedIn](https://www.linkedin.com/in/merina-rahaman-mou/) • [Portfolio](https://merinarahaman.netlify.app/)

