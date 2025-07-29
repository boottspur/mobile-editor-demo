# 📄 Product Requirements Document (PRD)

## Title: AI-Guided Onboarding & Multichannel First Campaign Flow

### Author: Chris Merchant

### Date: July 29, 2025

### Status: Draft (Demo Phase)

---

## 📽 Executive Summary

This PRD outlines an **AI-assistant-led onboarding experience** designed to accelerate mobile user activation by walking new customers through:

1. Choosing a marketing goal and campaign type
2. Setting up their brand (via URL scraping)
3. Adding contacts (manual, import, or via integration)
4. Creating and sending their first campaign (email, social, SMS, survey, or multichannel)
5. Monitoring real-time performance with contextual AI feedback

This flow frames the app around outcomes, not tools — empowering users to feel like marketers from Day 1, while surfacing feature value contextually to support conversion and long-term retention.

---

## 🌟 Business Goals & Success Metrics

### Goal 1: Increase Mobile-First Campaign Success

* **Problem:** New mobile users drop off before completing their first campaign.
* **Solution:** AI-led onboarding makes the entire flow intuitive and goal-driven.

**Success Metrics:**

* XX% of mobile trialers complete onboarding
* XX%+ complete their first campaign within 24 hours
* Time-to-first-send under XX minutes (median)

---

### Goal 2: Increase List Growth and Contact Quality

* **Problem:** Users often don’t complete contact import, leading to failed sends or dead ends.
* **Solution:** AI helper guides users through contact setup during campaign prep.

**Success Metrics:**

* XX%+ of first-time users complete a contact import (manual, CSV, or integration)
* XX%+ link a third-party integration (Salesforce, etc.) within first 7 days

---

### Goal 3: Improve Monetization and Repeat Engagement

* **Problem:** Users don’t see the full value of premium tools unless they explore deeply.
* **Solution:** AI assistant surfaces advanced options in context (multi-channel, automation, A/B, segmenting, etc.)

**Success Metrics:**

* XX% increase in free-to-paid conversion among users who complete onboarding
* XX% of users create a second campaign within 5 days
* XX% explore automation or reporting within first 14 days

---

## 🤓 Key Feature Set

### 1. AI Assistant–Led Onboarding (First-Time UX)

**Flow:**

* Greeted by AI Assistant (chat-style or card-based)
* “Let’s launch your first campaign together”

  1. Choose marketing goal: *Promote / Announce / Sell / Collect Feedback*
  2. Pick campaign type: *Email / Social / SMS / Survey / Multichannel*
  3. Enter brand URL → scrape logo, colors, fonts (auto-preview style)
  4. Add contacts (type detected):

     * Paste manually
     * Upload CSV
     * Connect integration (Salesforce, etc.)
  5. Auto-draft content with optional voice style or AI tone tuning
  6. Preview → edit blocks (launch editor for email)
  7. Send test → confirm send or schedule
  8. Real-time results page + push notification setup

**Components:**

* `OnboardingAssistant.tsx`
* `CampaignTypeSelector.tsx`
* `BrandScraperWizard.ts`
* `ContactSetupWizard.tsx`
* `AIDraftEngine.ts`
* `ChannelRouter.tsx`

---

### 2. Post-Send Campaign Feedback Loop (Pulse)

**Flow:**

* AI notifies user of performance: “XX people opened your email so far. Nice work!”
* Feed-style view: opens, clicks, engagement by time
* Smart suggestions:

  * “Looks like link B is outperforming link A — want to test it next time?”
  * “5 SMS messages bounced — try cleaning up your contact list?”

**Components:**

* `CampaignPulseScreen.tsx`
* `RealTimeEventTicker.tsx`
* `AIInsightsBanner.tsx`
* `UpgradePromptInline.tsx`

---

## 📍 App Navigation Map

| Section                | Subsections                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| **Dashboard**          | Overview, recent activity, suggested next actions                  |
| **Marketing Channels** | All, Multi-channel, Email, Social Posts, SMS, Automations, Surveys |
| **Contacts**           | Lists, Import/Export, Integrations                                 |
| **Reporting**          | Campaign stats, multichannel analytics, A/B test insights          |
| **My Brand**           | Brand scraper + editing tools (colors, logo, styles)               |
| **Integrations**       | Salesforce, Shopify, Google Contacts, Zapier, etc.                 |

---

## ✨ Smart Defaults by Campaign Type

| Type         | AI Presets                                                        |
| ------------ | ----------------------------------------------------------------- |
| Email        | Subject line, intro text, CTA block, responsive layout            |
| SMS          | Short-form CTA, link tracking, character limit                    |
| Social Post  | Image pull from URL, headline, hashtags                           |
| Survey       | Goal-based templates: feedback, RSVP, NPS                         |
| Multichannel | Bundles any combination above with unified message and scheduling |

---

## 📊 Example User Journey

> *A food truck owner signs up via mobile, pastes their Instagram handle, connects Google Contacts, chooses “Announce an Event,” selects Email + Social, auto-generates a campaign, edits headline, and taps “Send.” Within 10 minutes, they’ve sent a campaign and are watching opens roll in.*

---

## 🔧 Tech Considerations

| Area           | Notes                                                             |
| -------------- | ----------------------------------------------------------------- |
| AI Drafting    | Uses OpenAI or internal LLM tuned with campaign and business data |
| Brand Scraping | DOM scan, favicon/logo pull, CSS variable matching                |
| Contact Import | Supabase for demo, Salesforce/Shopify mock auth flows             |
| Notifications  | Expo push and in-app feed                                         |
| Real-Time Data | Websockets or polling, mocked in demo via Supabase triggers       |

---

## 📊 Success Measurement Plan

| Phase                 | Goals                                                              |
| --------------------- | ------------------------------------------------------------------ |
| **Demo (Phase 1)**    | Simulate full onboarding for 5 campaign types, real-time mock data |
| **Pilot (Phase 2)**   | Enable onboarding for email only, XX% of new users                 |
| **Rollout (Phase 3)** | Expand to all channels, integrate real analytics + push infra      |

---

## 🔐 Risks & Mitigation

| Risk                                | Mitigation                                           |
| ----------------------------------- | ---------------------------------------------------- |
| AI hallucinations or off-brand tone | Use AI only as a starter, never auto-send            |
| Contact import failure              | Validate formats early, retry support                |
| App fatigue                         | Keep flow under 5 minutes with smart defaults        |
| Channel confusion                   | Channel-focused onboarding with guided tips per type |

---

## 🧐 Competitive Advantage

* **AI-as-coach**, not just a tool
* **Cross-channel activation** in one go
* **Real-time feedback loops** to reinforce user value
* \*\*Brand matching vi
