# 🏋️‍♂️ Seven Gym

## Gym Management Web Platform

A full-featured fitness and training platform built with modern technologies, providing tailored experiences for **Members**, **Trainers**, **Class Managers**, and **Admins**. This system includes dynamic scheduling, session booking, tier management, invoicing, community interaction, and content management.

---

## 📚 Overview

This web application is designed to streamline and automate operations for a modern gym or fitness organization. It supports multiple user roles, each with their own layouts, tools, and controls, ensuring a customized and efficient experience for all participants.

---

## 🔑 Key Roles & Layouts

The application is divided into four primary layout sections:

| Role               | Layout Name    | Description                                               |
| ------------------ | -------------- | --------------------------------------------------------- |
| Public Visitors    | Public Layout  | General pages like Home, Gallery, Trainers, Classes, etc. |
| Registered Users   | Member Layout  | Workout planning, profile control, trainer/class booking  |
| Certified Trainers | Trainer Layout | Schedule control, session tracking, student management    |
| Admin Staff        | Admin Layout   | Full platform control: users, content, payments, reports  |

---

## 🔗 Project Links

| Type                     | Link                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| 🖥️ **Frontend (Live)**   | [https://seven-gym-1885e.web.app/](https://seven-gym-1885e.web.app/)                                 |
| 🧠 **Frontend (GitHub)** | [https://github.com/sazzadul1205/Seven-Gym-Client](https://github.com/sazzadul1205/Seven-Gym-Client) |
| 💻 **Backend (GitHub)**  | [https://github.com/sazzadul1205/Seven-Gym-Server](https://github.com/sazzadul1205/Seven-Gym-Server) |

---

## ⚙️ Technologies Used

- **Frontend**: React, React Router, React Query, TailwindCSS, TipTap
- **State Management**: React Context, React Query
- **Auth & Security**: JWT, Role-based Access Control
- **Backend (assumed)**: Node.js / Express (API endpoints)
- **Payments**: Stripe
- **Other**: SweetAlert2, Axios, Day.js, UUID, Image Cropper

---

## 🔐 Demo Access

To explore full functionality for all user roles, use the following credentials:

### ▶️ Member Access

- Log in Your Self ( if nun sign Up )

### ▶️ Trainer Access

- **Email:** `trainer2@gmail.com`
- **Password:** `Trainer2`

### ▶️ Class Manager Access

- **Email:** `manager@gmail.com`
- **Password:** `Manager1205`

### ▶️ Admin Access

- **Email:** `admin@gmail.com`
- **Password:** `Admin1205`

> 🔒 _These accounts include access to all working features for testing and demonstration purposes._

---

## 🧭 Directory Structure (High-Level)

```
/src
│
├── layouts/
│   ├── PublicLayout/
│   ├── MemberLayout/
│   ├── TrainerLayout/
│   └── AdminLayout/
│
├── pages/
├── components/
├── hooks/
├── services/       // Axios API logic
├── utils/          // Time, validation, formatting
├── assets/         // Images, icons
└── App.jsx
```

---

## 📄 Layout Descriptions

> ✅ [Jump to Public Layout »](#-public-layout)
> ✅ [Jump to Member Layout »](#-member-layout)
> ✅ [Jump to Trainer Layout »](#-trainer-layout)
> ✅ [Jump to Admin Layout »](#-admin-layout)

---

## 📁 Public Layout

The **Public Layout** includes all user-facing pages that are accessible without login. These routes are essential for providing information, showcasing services, and engaging users before they create an account. Below is a detailed explanation of each route:

---

### 🏠 1.1 Home

The **Home page** serves as the landing page. It provides a snapshot of the platform's core features such as:

- Hero section with key CTAs (e.g., "Join Now", "View Classes")
- Brief introduction to gym services and values
- Quick links to Classes, Trainers, and Community
- Testimonials and partner logos (if applicable)

---

### 🖼 1.2 Gallery

The **Gallery page** showcases:

- High-resolution images of gym facilities, training sessions, events, and client transformations.
- Categorized image sections (e.g., Equipment, Classes, Events)
- Modal or lightbox for image preview

---

### 🧑‍🏫 1.3 Trainer

The **Trainer Listing page** displays all active trainers. Features include:

- Trainer cards with photo, name, and specialties
- Filters based on expertise, rating, and availability
- Links to detailed trainer profiles

---

### 📄 1.4 Trainer Details

This page shows a detailed profile of a selected trainer:

- Biography, certifications, and awards
- Training focus and class types
- Schedule availability and session pricing
- "Book Now" button linked to the booking page

---

### 📅 1.5 Trainer Booking

The **Trainer Booking page** allows users to book sessions:

- Choose session type (solo, group, etc.)
- Select date and time from availability
- Display price, duration, and trainer info
- Confirm and proceed to checkout (Stripe or free session logic)

---

### 🧘 1.6 Classes

The **Classes page** lists all active fitness classes:

- Categories (Yoga, HIIT, Strength, etc.)
- Duration, difficulty level, and trainers involved
- Tags for goals (Weight Loss, Endurance, etc.)

---

### 📋 1.7 Classes Details

This page gives in-depth information about a selected class:

- Class description and objectives
- Benefits and fitness goals
- Schedule, trainers, capacity, and pricing
- Book class or join waitlist

---

### 👥 1.8 Community

The **Community page** is a social feature:

- View posts by members and trainers
- Like, comment, and share functionalities
- Modal view for detailed post and comment thread
- Encourages interaction and motivation within members

---

### 🎯 1.9 Our Mission

The **Our Mission page** outlines the platform's purpose:

- Core values and vision
- Long-term goals for fitness and wellness impact
- Highlights of unique offerings and philosophy

---

### 🌟 1.10 Testimonials

Real user feedback and stories:

- Carousel or grid of client testimonials
- Ratings and personal transformation quotes
- Encourages trust and credibility

---

### 🏢 1.11 About Us

Details about the company or gym:

- Founding story, team introduction
- Company timeline or achievements
- Media mentions, awards, and social impact

---

### 📝 1.12 Feedback

User feedback form for suggestions or issues:

- Simple form with input fields (Name, Email, Message)
- Submissions stored or sent to admin email
- Helps in continuous improvement

---

### 📜 1.13 Terms of Service

Legal page outlining user rights and responsibilities:

- Terms of use, liabilities, and disclaimers
- Payment, refund, and cancellation policies
- Privacy and data usage

Here's the detailed explanation for the `Member Layout` section of your `README.md`. It’s structured for clarity, completeness, and future-proofing:

---

## 🔐 Member Layout

The **Member Layout** includes authenticated user features. This layout is only accessible after user login and serves as the main hub for managing personal info, sessions, classes, payments, and more.

---

### 👤 2.1 User Profile

Displays the logged-in user's profile with:

- Personal details (name, age, gender, email, etc.)
- Profile photo
- Membership tier and status
- Quick links to upgrade tier or manage settings

---

### 🏆 2.2 Tier Upgrade

Allows users to upgrade their membership tier:

- View available tiers (Free, Premium, Elite, etc.)
- Tier benefits comparison table
- Upgrade via Stripe or eligible vouchers
- Invoices and payment status stored for transparency

---

### 🗓️ 2.3 Schedule Planner

User-centric weekly planner:

- Add, view, and manage personal workout or class schedules
- Drag-and-drop sessions to reorganize
- Visual calendar (day/week/month views)
- Syncs with booked sessions and availability

---

### ⚙️ 2.4 Settings

Centralized control for user preferences and data.

#### 📝 2.4.1 User Information Settings

- Edit name, email, gender, date of birth, etc.
- Update profile picture
- Change password or enable 2FA

#### 🏅 2.4.2 User Award Settings

- Manage fitness achievements
- Add custom awards or badges
- Upload certifications (if any)

#### 🏋️ 2.4.3 User Workout Settings

- Preferred workout types (cardio, weights, yoga, etc.)
- Workout intensity levels and fitness goals
- Save favorite workouts

#### 🗓️ 2.4.4 User Schedule Settings

- Default time preferences (e.g., mornings only)
- Block unavailable days
- Sync preferences with trainer availability

#### 💬 2.4.5 User Testimonials

- Submit personal testimonial for public display
- View, edit, or delete own testimonials

#### 💳 2.4.6 Tier Upgrade Payment Invoices

- View all payment invoices for tier upgrades
- Includes date, amount, tier, and payment method

#### 💸 2.4.7 Tier Upgrade Refund Invoices

- Track refunded tier upgrades
- View reasons, dates, and refund methods

#### 🧾 2.4.8 Sessions Payed Invoices

- List of paid trainer sessions
- Downloadable invoice PDFs

#### 🔁 2.4.9 Sessions Refunded Invoices

- Refunded trainer sessions with reason and refund status

#### 💰 2.4.10 Class Payment Invoices

- Paid class enrollments (group classes, workshops, etc.)

#### 💵 2.4.11 Class Refunded Invoices

- Refunded class records with date and method

---

### 🧑‍🏫 2.5 My Trainer Management

Manage all trainer-related interactions and sessions.

#### 📌 2.5.1 Active Sessions

- Ongoing or upcoming confirmed sessions
- Includes time, trainer name, session type, and join info

#### 📅 2.5.2 Booking Sessions

- Booked but pending sessions (awaiting approval or payment)
- Cancel/edit before confirmation

#### 🕘 2.5.3 Sessions History

- All completed sessions
- Filter by trainer, date, or type
- Feedback submission option

#### ⭐ 2.5.4 Trainers Review

- Rate and review trainers post-session
- Edit or delete previous reviews

#### 🧾 2.5.5 Sessions Invoices

- Consolidated invoice records of all trainer-related sessions
- Payment status, refund logs

#### 📢 2.5.6 Trainer Announcement

- Trainer-specific updates (schedule changes, session reminders, etc.)
- Real-time notifications or archived announcements

---

### 🧘 2.6 User Class Management

- View enrolled classes
- Join live/virtual classes
- Cancel or reschedule
- Access to class recordings or materials (if any)

---

### 📝 2.7 User Form (Application for Trainers, Class Manager)

A submission form for users wanting to:

- Apply as a Trainer
- Become a Class Manager
- Includes validation, document upload, and admin approval flow

---

Here’s a detailed explanation for the `Trainer Layout` section of your `README.md`. This layout is designed specifically for users with a trainer role and includes tools to manage sessions, clients, schedules, and announcements.

---

## 🧑‍🏫 Trainer Layout

The **Trainer Layout** provides all tools and controls necessary for trainers to manage their sessions, clients, schedules, and personal profile. Only authenticated users with a `trainer` role have access to this layout.

---

### 📊 3.1 Trainer Dashboard

- Overview of trainer-specific stats:

  - Total sessions booked
  - Upcoming sessions
  - Session income and refunds
  - Active students and feedback

- Quick access cards for managing schedules, bookings, and announcements

---

### 🧾 3.2 Trainer Profile Control

- View and edit trainer bio, profile photo, expertise, certifications, awards, and specialties
- Set training preferences (e.g., class types, fitness goals, equipment used)
- Set visibility status (public/private)

---

### 📅 3.3 Trainer Schedule Control

- Create and manage weekly trainer availability
- Add or update sessions (type, time, pricing, participant limit)
- Time conflict validation and visual schedule builder
- Auto-sync with public trainer detail view and booking availability

---

### 📥 3.4 Trainer Booking Request

- Handle booking requests from members:

  - Accept or reject with custom reasons
  - View session details before action

- Booking status filter (Pending, Accepted, Cancelled, Expired)

---

### 👥 3.5 Trainer Schedule Participants

- View the list of participants for each confirmed session
- Check user details (name, tier, attendance)
- Manually mark attendance or cancel participation

---

### 🕓 3.6 Sessions History

- Track all completed trainer-led sessions
- Filter by class type, date, or participants
- Add notes for future reference
- Mark sessions as completed if manually managed

---

### 📚 3.7 Student History

- Individual user session history with the trainer
- Notes from previous sessions
- Performance tracking and feedback logs
- Useful for personalized training adjustments

---

### 💬 3.8 Trainer Testimonials

- View testimonials given to the trainer by members
- Manage visibility (show/hide specific ones)
- Export or use for profile promotion

---

### 🧾 3.9 Trainer Logs

- Internal tracker of all trainer activities:

  - Schedule updates
  - Booking decisions (who accepted/rejected what)
  - Session cancellations or changes

- Useful for admin audits or personal record keeping

---

### 📢 3.10 Trainer Announcement Board

- Broadcast announcements to students:

  - Session updates
  - Temporary unavailability
  - New class or promotion

- Supports rich text (with TipTap) and image attachments
- Visibility based on enrolled students or public

---

Here’s the detailed explanation for the `Class Manager Layout` section, properly structured for your `README.md`. It follows the same practical and thorough documentation approach for team or developer use:

---

## 🧑‍💼 Class Manager Layout

The **Class Manager Layout** is tailored for users with the `class manager` role. It provides full control over managing classes, handling participant flow, updating class details, and maintaining their profile.

---

### 📊 4.1 Class Management Dashboard

- Overview of class-related stats:

  - Total active classes
  - Pending participant requests
  - Currently running sessions
  - Completed class summaries

- Quick action buttons to add, edit, or manage class activities

---

### 📋 4.2 Class Details Management

- Add or update class information:

  - Title, description, objectives, benefits
  - Pricing, schedule, trainers, class type
  - Fitness goals, difficulty level, and refund policy

- Set visibility (public/hidden) and session capacity

---

### 📥 4.3 Class Participants Request

- Manage incoming requests from users to join a class
- Accept or reject participation based on eligibility or limits
- View applicant details (tier, history, goals)

---

### ✅ 4.4 Class Participants Accepted

- List of all users whose requests have been approved
- Session-wise grouping (by date or class batch)
- Option to cancel acceptance with reason

---

### 🕘 4.5 Class Participants Request (Duplicate Entry Notice)

⚠️ **Note:** This section appears to be a duplicate of **4.3**. Consider removing or merging for clarity unless this serves a different sub-purpose (e.g., re-requested users or tier-based).

---

### 🏁 4.6 Class Participants Completed

- Record of users who completed the full class/session cycle
- Includes:

  - Attendance logs
  - Trainer/manager feedback
  - Certificate/award distribution (if any)

---

### 👥 4.7 Class Participants

- Central list of **all** participants for each class:

  - Includes accepted, pending, completed, and dropped

- Filter by class name, status, or date
- Useful for class overview and reporting

---

### ⚙️ 4.8 Profile Settings

- Edit class manager’s personal profile

  - Name, contact, profile photo
  - Role-specific settings (notifications, preferred class types)

- Change password and manage 2FA

---

### ✅ Recommendation

**Cleanup Suggestion:**
Merge `4.3` and `4.5` into a single entry titled **"Class Join Requests"** unless they serve uniquely different flows.

---

Here is a comprehensive and corrected explanation for the `Admin Layout` section of your `README.md`, formatted for clarity and accuracy. Duplicate numbering and typos (like `Recept`) are fixed, and the structure is organized in a developer/documentation-friendly format.

---

## 🛠️ Admin Layout

The **Admin Layout** grants full platform control to administrators. It includes tools for user and content management, financial oversight, session and class tracking, and live site content editing.

---

### 📊 4.1 Dashboard

- Quick summary of platform health and KPIs:

  - Total users, trainers, managers
  - Bookings, sessions, revenue, refund metrics
  - Real-time graph views (monthly trends, session flow)

- Alert cards for pending approvals or flagged content

---

### 👥 4.2 All Users

- View, search, filter, and manage all registered members
- Promote to trainer/manager, reset accounts, deactivate or ban users
- Export user lists for reports or audits

---

### 🧑‍🏫 4.3 All Trainers

- View and manage all registered trainers
- Review performance, feedback scores, and active sessions
- Activate/deactivate profiles or review trainer applications

---

### 🧑‍💼 4.4 All Managers

- View all class managers
- Assign or remove class manager privileges
- Track managed classes, performance, and responsibilities

---

### 💸 4.5 Tier Upgrade Invoices

Tracks and visualizes financial activity related to user **membership upgrades**.

#### 📈 Graphs

- Revenue trends for Tier Upgrades over time

#### 4.5.1 Active Invoices

- Pending tier upgrade invoices (awaiting payment)

#### 4.5.2 Completed Invoices

- Successfully processed tier upgrade payments

#### 4.5.3 All Paid Invoices

- Full list of all successful tier upgrade transactions

#### 4.5.4 Refunded Invoices

- Refunded tier payments with dates and reasons

---

### 💳 4.6 Trainer Session Invoices

Handles all billing related to trainer sessions.

#### 📈 Graph

- Graphical insights: income from trainer sessions, refunds, and net gain

#### 4.6.1 Active Invoices

- Sessions with pending payments

#### 4.6.2 Completed Invoices

- Fully paid and completed session invoices

#### 4.6.3 All Paid Invoices

- Historical record of all trainer session payments

#### 4.6.4 Refunded Invoices

- Trainer sessions that resulted in refunds

---

### 📅 4.7 Trainer Session Booking

Tracks the lifecycle of trainer session bookings.

#### 📈 Graph

- Booking trends, session acceptance rate, cancellation impact

#### 4.7.1 Booking Request

- Incoming user requests for trainer sessions (pending action)

#### 4.7.2 Accepted Booking

- Approved bookings awaiting or in progress

#### 4.7.3 Canceled Booking

- Bookings canceled by trainers, users, or auto-expired

#### 4.7.4 Completed Booking

- Successfully completed training sessions

#### 4.7.5 Booking History

- Full history log of all trainer bookings

---

### 📘 4.8 Class Booking

All financial and user interactions related to **classes**.

#### 📈 Graph

- Class activity and revenue/refund visualization

#### 4.8.1 Class Booking Request

- Pending class join requests from users

#### 4.8.2 Class Accepted Booking

- Approved class participants (confirmed)

#### 4.8.3 Class Completed Booking

- Bookings that were successfully completed

#### 4.8.4 Class Rejected Booking

- Declined booking requests with status and reasons

#### 4.8.5 Class Paid Receipts

- Invoices for all completed class payments

#### 4.8.6 Class Refunded Receipts

- Refunded class invoices with reason tracking

---

### 🗓️ 4.9 Trainer Schedules

- View, edit, or delete schedules set by trainers
- Resolve time conflicts and enforce schedule limits
- Filter by trainer, date, session type

---

### 🏠 4.10 Home Page View

Admin-controlled customization of the home/landing page content.

#### 4.10.1 View Section

- Determine which homepage sections are visible

#### 4.10.2 Banner Section

- Set main banner images, text, and CTA buttons

#### 4.10.3 Welcome Section

- Control welcome messaging or introductory copy

#### 4.10.4 Services Section

- List services or programs offered by the gym/platform

#### 4.10.5 Promotion Section

- Advertise discounts, campaigns, or seasonal offers

#### 4.10.6 Features Section

- Highlight platform features or unique selling points (USPs)

---

### 🖼 4.11 Gallery Page Management

- Upload new media to the gallery
- Categorize and sort images/videos
- Control visibility and captions

---

### 🌟 4.12 Testimonials

- Approve, edit, or delete user-submitted testimonials
- Highlight featured testimonials on homepage or trainer pages

---

### 💬 4.13 Community Posts

- Moderate posts submitted by users and trainers
- Flag, delete, or ban repeat offenders
- View post analytics (likes/comments)

---

### 🗣️ 4.14 Feedbacks

- View user-submitted feedback from all areas of the platform
- Assign to support staff or resolve internally
- Track response times and resolutions

---

### 📄 4.15 Extra Page Managements

Control static or semi-static informational pages.

#### 4.15.1 Our Mission Page Management

- Update the organization’s mission and goals

#### 4.15.2 About Us Page Management

- Edit company story, team info, and core values

#### 4.15.3 Terms of Services Page Management

- Manage the site's legal agreements:

  - User rights
  - Platform responsibilities
  - Payment/refund terms
  - Privacy policies

---

Let me know if you need:

- A folder/component structure to match these sections
- Route mapping (URLs) for internal dev use
- Role-based access control logic suggestions for each layout section
