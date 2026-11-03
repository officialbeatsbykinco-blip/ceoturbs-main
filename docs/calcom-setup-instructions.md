# Cal.com Booking Setup Instructions - Home Office Setup Service

## Overview
Create a NEW Cal.com event type specifically for Home Office Setup consultations. This should be separate from the existing Brand Boost booking to track conversions accurately for this new service.

---

## Step 1: Create New Event Type

1. **Log in to Cal.com**
   - Go to your Cal.com dashboard
   - Navigate to "Event Types"

2. **Create New Event**
   - Click "Create New Event Type"
   - Select "One-on-One" (individual consultation)

3. **Basic Settings**
   - **Event Name:** `Home Office Setup Consultation`
   - **Slug:** `home-office-setup` (auto-generated from name)
   - **Description:** `Free 15-minute consultation to discuss your home office or business setup needs. We'll cover your space, equipment, timeline, and budget.`
   - **Duration:** `15 minutes`
   - **Location:** `In Person` (since this is a local service)

---

## Step 2: Configure Availability

**Time Zone:**
- Set to: `Eastern Time (ET)` 
- This matches your Atlanta service area

**Availability:**
- **Minimum booking notice:** `4 hours`
- **Maximum booking notice:** `4 weeks`
- **Buffer time:** `15 minutes` before and after
- **Limit:** `1 event per day` (to allow for travel time between jobs)

**Working Hours:**
- Monday - Friday: 9:00 AM - 6:00 PM
- Saturday: 10:00 AM - 4:00 PM
- Sunday: Closed (or adjust based on your preference)

---

## Step 3: Add Booking Questions

Navigate to "Advanced" → "Questions" and add these questions in order:

### Question 1: What type of setup do you need?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - Basic computer setup (single device)
  - Full home office setup (furniture + tech)
  - Business office setup (multiple workstations)
  - School computer lab setup
  - Not sure - need consultation

### Question 2: How many devices need setup?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - 1 device
  - 2-3 devices
  - 4-10 devices
  - 10+ devices

### Question 3: What's your location?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - Atlanta (proper)
  - Decatur area
  - North Atlanta (Sandy Springs, Buckhead, etc.)
  - East Atlanta (Stone Mountain, etc.)
  - Gwinnett County (Duluth, Lawrenceville, etc.)
  - Cobb County (Marietta, Kennesaw, etc.)
  - Other (specify)

### Question 4: Do you already have the equipment?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - Yes, I have everything
  - No, I need recommendations
  - Partially - need to purchase some items

### Question 5: What's your timeline?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - ASAP / Emergency
  - This week
  - Within 2 weeks
  - Flexible / Planning ahead

### Question 6: What's your budget range?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - Under $150
  - $150-$300
  - $300-$500
  - $500+ (larger projects)

### Question 7: Any special requirements?
- **Type:** Multiple Choice
- **Required:** No
- **Options:**
  - Senior accessibility needs
  - Disability accommodations
  - Mac/iPhone setup needed
  - Specific software requirements
  - Cable management priority
  - Other (describe)

### Question 8: Your phone number
- **Type:** Phone Number
- **Required:** Yes
- **Label:** `Phone number for consultation`

### Question 9: Your email
- **Type:** Email
- **Required:** Yes
- **Label:** `Email for confirmation`

---

## Step 4: Configure Redirect & Webhooks

**After Booking Redirect:**
- Set to: `https://ceoturbo.com/booked?service=home-office-setup`
- This will fire the `book_call` tracking event

**Webhook (Optional but Recommended):**
- URL: `https://ceoturbo.com/api/calcom-webhook`
- Events: `booking.created`, `booking.cancelled`
- This enables real-time tracking and CRM integration

---

## Step 5: Customize Appearance

**Event Page Title:**
- `Book Your Home Office Setup Consultation`

**Event Page Description:**
```
Free 15-minute consultation to discuss your home office or business setup needs. We'll cover your space, equipment, timeline, and budget. Serving Atlanta metro area within 50-mile radius.
```

**Button Text:**
- `Book Free Consultation`

**Success Message:**
```
Your consultation is booked! We'll call you at the scheduled time at 678-558-4327. If you need to reschedule, use the link in your confirmation email.
```

---

## Step 6: Add Phone Number Display

**In the event description or confirmation page, add:**
```
📞 Direct Line: 678-558-4327
Need immediate help? Call us directly.
```

---

## Step 7: Test the Booking Flow

1. **Test Booking:**
   - Book a test consultation yourself
   - Verify all questions appear correctly
   - Check confirmation email is sent
   - Verify redirect to `/booked` page works

2. **Test Tracking:**
   - Open browser DevTools → Network tab
   - Complete a test booking
   - Verify `book_call` event fires in dataLayer
   - Check GA4 Realtime reports
   - Check Meta Events Manager

3. **Test Mobile:**
   - Test booking on mobile device
   - Verify phone number is tap-to-call
   - Check form is mobile-friendly

---

## Step 8: Get Embed URL

Once the event is created:

1. **Navigate to the event**
2. **Click "Embed"**
3. **Copy the embed URL** (looks like: `https://cal.com/your-username/home-office-setup`)
4. **Add to website** - The existing booking component will use this URL

---

## Step 9: Integration with Website

**Update Booking Component:**
The website's existing booking system will automatically use the new event type. You may need to:

1. **Update the booking URL** in the service page component
2. **Add the event slug** to the booking configuration
3. **Test the embed** on the `/services/home-office-setup` page

**Code Integration:**
```tsx
// In the service page or booking component
const bookingUrl = "https://cal.com/your-username/home-office-setup";
```

---

## Step 10: Set Up Notifications

**Email Notifications:**
- **To you:** Enable immediate email notification for new bookings
- **To customer:** Enable confirmation email (default)
- **Reminder:** Enable 24-hour reminder email

**SMS Notifications (Optional):**
- Enable SMS reminders if you have SMS credits
- Send reminder 2 hours before consultation

**Calendar Integration:**
- Connect to Google Calendar
- Connect to Outlook/Office 365
- This prevents double-booking

---

## Step 11: Configure Team Members (If Applicable)

If you have multiple technicians:

1. **Add team members** to Cal.com
2. **Assign event type** to specific team members
3. **Set round-robin** or priority assignment
4. **Each member sets their own availability**

---

## Step 12: Analytics & Reporting

**Track These Metrics:**
- Booking completion rate
- No-show rate
- Average lead time from booking to consultation
- Conversion rate from consultation to paid job

**Cal.com Analytics:**
- Built-in dashboard shows booking trends
- Export data for custom analysis
- Integrate with Google Analytics via webhook

---

## Troubleshooting

**Issue: Booking not redirecting correctly**
- Check the redirect URL is set correctly
- Verify the `/booked` page exists on your site
- Test in incognito mode to rule out cache issues

**Issue: Tracking not firing**
- Verify webhook URL is correct
- Check browser console for errors
- Test booking with DevTools Network tab open
- Verify dataLayer pushes are happening

**Issue: Questions not appearing**
- Ensure all questions are marked as "Enabled"
- Check question order (drag to reorder)
- Test in preview mode before publishing

**Issue: Double bookings**
- Check buffer time is set
- Verify calendar sync is working
- Ensure team member availability is correct

---

## Next Steps After Setup

1. **Update website booking component** with new Cal.com URL
2. **Test full booking flow** from website to confirmation
3. **Monitor first few bookings** to ensure everything works
4. **Adjust availability** based on demand
5. **Create ad campaigns** pointing to the booking page
6. **Track conversion metrics** from ads to bookings

---

## Ad Campaign Integration

When creating Google/Microsoft/Meta ads:

**Landing Page:** `/services/home-office-setup`
**Call to Action:** "Book Free Consultation"
**Tracking:** The booking will automatically fire `book_call` event

**Ad Copy Example:**
```
Home Office Setup Atlanta - From $89
Professional desk assembly, computer setup, 
and network configuration. Book free consultation.
678-558-4327 | ceoturbo.com/home-office-setup
```

---

## Contact Support

If you encounter issues with Cal.com setup:
- Cal.com Documentation: https://cal.com/docs
- Cal.com Discord: https://cal.com/discord
- CEO Turbo tracking: Check `/docs/home-office-setup-implementation-guide.md`

---

## Summary Checklist

- [ ] Create new event type: "Home Office Setup Consultation"
- [ ] Set duration to 15 minutes
- [ ] Configure Eastern Time timezone
- [ ] Add all 7 booking questions in order
- [ ] Set availability (4 hours notice, 4 weeks max)
- [ ] Configure redirect to `/booked` page
- [ ] Add phone number to event page
- [ ] Test booking flow
- [ ] Verify tracking fires correctly
- [ ] Get embed URL
- [ ] Integrate with website
- [ ] Set up notifications
- [ ] Connect calendar sync
- [ ] Monitor first bookings
