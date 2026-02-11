# Barbershop

This is a barbershop booking web app built with Next.js.

Customers can book a timeslot by verifying their phone number first.  
They receive a verification code by SMS, confirm it, then select a time and complete the reservation. After booking, they receive a confirmation SMS.

Everything is handled inside Next.js (App Router).  
Frontend and backend logic live in the same project using API routes.

I used:

- MongoDB to store appointments
- Redis for temporary data like verification codes and caching
- An SMS provider to send OTP and confirmation messages

The flow works like this:

1. User enters phone number  
2. A verification code is generated and stored in Redis (with expiration)  
3. Code is sent by SMS  
4. User submits the code  
5. If valid, the appointment is saved in MongoDB  
6. A confirmation SMS is sent  

The main goal was to build a clean booking flow where:
- No reservation is possible without phone verification
- Verification codes expire
- Appointments are properly stored and validated

This project focuses on backend logic, validation, and real-world flow handling rather than UI design.
