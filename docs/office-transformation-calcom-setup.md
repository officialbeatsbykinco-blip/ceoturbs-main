# Cal.com Booking Setup Instructions - Office Transformation Service

## Overview
Create a NEW Cal.com event type specifically for Office Transformation consultations. This should be separate from the existing Brand Boost and Home Office Setup bookings to track conversions accurately for this new service.

---

## Step 1: Create New Event Type

1. **Log in to Cal.com**
   - Go to your Cal.com dashboard
   - Navigate to "Event Types"

2. **Create New Event**
   - Click "Create New Event Type"
   - Select "One-on-One" (individual consultation)

3. **Basic Settings**
   - **Event Name:** `Office Transformation Consultation`
   - **Slug:** `office-transformation-consultation` (auto-generated from name)
   - **Description:** `Free 30-minute consultation to discuss your office transformation needs. We'll cover your space, timeline, equipment, and budget.`
   - **Duration:** `30 minutes` (longer than home office due to project complexity)
   - **Location:** `In Person` (since this is a local Georgia service)

---

## Step 2: Configure Availability

**Time Zone:**
- Set to: `Eastern Time (ET)` 
- This matches your Georgia service area

**Availability:**
- **Minimum booking notice:** `24 hours` (allows for travel planning)
- **Maximum booking notice:** `8 weeks` (for larger projects)
- **Buffer time:** `30 minutes` before and after
- **Limit:** `2 events per day` (allows for site visits)

**Working Hours:**
- Monday - Friday: 9:00 AM - 6:00 PM
- Saturday: 10:00 AM - 4:00 PM
- Sunday: Closed (or adjust based on your preference)

---

## Step 3: Add Booking Questions

Navigate to "Advanced" → "Questions" and add these questions in order:

### Question 1: What type of space needs transformation?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - Office space
  - Warehouse
  - Medical practice
  - School/educational facility
  - Retail space
  - Other (specify)

### Question 2: Approximate square footage?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - Under 1,000 sq ft
  - 1,000-3,000 sq ft
  - 3,000-5,000 sq ft
  - 5,000+ sq ft

### Question 3: How many workstations needed?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - 1-5 workstations
  - 6-10 workstations
  - 11-20 workstations
  - 20+ workstations

### Question 4: Do you need security cameras?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - Yes, need full camera system
  - Yes, need cameras added to existing system
  - No, cameras already installed
  - Not sure - need consultation

### Question 5: What's your timeline?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - ASAP / Emergency
  - Within 2 weeks
  - Within 1 month
  - Flexible / Planning ahead

### Question 6: What's your budget range?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - Under $2,000 (Basic package)
  - $2,000-$4,000 (Standard package)
  - $4,000-$6,000 (Complete package)
  - $6,000+ (Custom project)

### Question 7: What city are you located in?
- **Type:** Multiple Choice
- **Required:** Yes
- **Options:**
  - Atlanta Metro (Atlanta, Buckhead, Sandy Springs, etc.)
  - North Georgia (Gainesville, Dalton, Rome, etc.)
  - East metro (Athens, Covington, Conyers)
  - South metro (Newnan, McDonough, Fayetteville)
  - Other Georgia city

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
- Set to: `https://ceoturbo.com/booked?service=office-transformation`
- This will fire the `book_call` tracking event

**Webhook (Optional but Recommended):**
- URL: `https://ceoturbo.com/api/calcom-webhook`
- Events: `booking.created`, `booking.cancelled`
- This enables real-time tracking and CRM integration

---

## Step 5: Customize Appearance

**Event Page Title:**
- `Book Your Office Transformation Consultation`

**Event Page Description:**
```
Free 30-minute consultation to discuss your office transformation needs. We'll cover your space, equipment, timeline, and budget. Serving the entire state of Georgia.
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
3. **Copy the embed URL** (looks like: `https://cal.com/your-username/office-transformation-consultation`)
4. **Note:** Office transformation uses direct phone/text CTAs, not Cal.com embed, but the event type is needed for tracking consistency

---

## Step 9: Set Up Notifications

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

## Step 10: Configure Team Members (If Applicable)

If you have multiple technicians:

1. **Add team members** to Cal.com
2. **Assign event type** to specific team members
3. **Set round-robin** or priority assignment
4. **Each member sets their own availability**

---

## Step 11: Analytics & Reporting

**Track These Metrics:**
- Booking completion rate
- No-show rate
- Average lead time from booking to consultation
- Conversion rate from consultation to paid project
- Average project value by region

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

1. **Test full booking flow** from website to confirmation
2. **Monitor first few bookings** to ensure everything works
3. **Adjust availability** based on demand
4. **Create ad campaigns** pointing to the service page
5. **Track conversion metrics** from ads to bookings

---

## Ad Campaign Integration

When creating Google/Microsoft/Meta ads:

**Landing Page:** `/services/office-transformation`
**Call to Action:** "Call for Free Quote" or "Text for Quote"
**Tracking:** Phone clicks and text messages are tracked via data-call-location attributes

**Ad Copy Example:**
```
Office Transformation Georgia - From $1,499
Complete office build-out: cameras, internet, 
computers, network, cleaning. One-time pricing.
678-558-4327 | ceoturbo.com/office-transformation
```

---

## Contact Support

If you encounter issues with Cal.com setup:
- Cal.com Documentation: https://cal.com/docs
- Cal.com Discord: https://cal.com/discord
- CEO Turbo tracking: Check `/docs/office-transformation-implementation-prompt.md`

---

## Summary Checklist

- [ ] Create new event type: "Office Transformation Consultation"
- [ ] Set duration to 30 minutes
- [ ] Configure Eastern Time timezone
- [ ] Add all 9 booking questions in order
- [ ] Set availability (24 hours notice, 8 weeks max)
- [ ] Configure redirect to `/booked` page
- [ ] Add phone number to event page
- [ ] Test booking flow
- [ ] Verify tracking fires correctly
- [ ] Get embed URL (for tracking consistency)
- [ ] Set up notifications
- [ ] Connect calendar sync
- [ ] Monitor first bookings
