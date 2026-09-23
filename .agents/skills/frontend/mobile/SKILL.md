---
name: mobile
category: frontend
maturity: stable
version: 2
description: Shape mobile projects around device constraints, platform seams, offline behavior, and push notifications — with explicit performance and resilience boundaries for React Native, Expo, and Capacitor.
capabilities:
  - design mobile architecture (React Native, Expo, Capacitor, native)
  - plan offline-first sync, local storage, and conflict resolution
  - design push notifications, deep linking, and app lifecycle
  - evaluate platform-specific UX and performance trade-offs
outputs:
  - Mobile architecture document (platform choice, offline model, sync, notifications, platform UX)
sideEffects: []
dependencies: []
stopCondition: Mobile design complete; offline and notification behavior explicit; platform trade-offs named.
risk: low
trustTier: 1
maxIterations: 6
---

# Mobile

Use this skill when the product needs to respect device constraints, offline behavior, platform-specific UX, or push notifications. It should keep the seam explicit so the app can remain reliable across different device conditions.

## Contract

- Input: mobile brief, device constraints, platform targets, and interaction context.
- Output: mobile architecture covering platform choice, offline model, sync, notifications, deep linking, and platform UX.
- Scope: design the mobile shape, not the full implementation.
- Rule: account for small screens, interruptions, connectivity loss, and battery constraints.
- Rule: make offline behavior explicit when it matters.
- Rule: keep platform-specific quirks visible rather than hidden behind generic advice.

## Process

### 1. Choose the platform strategy

- **Native:** Swift/SwiftUI (iOS), Kotlin/Jetpack Compose (Android); maximum performance and platform access.
- **Cross-platform:** React Native (Expo or bare), Flutter, Capacitor/Cordova.
- **Hybrid:** native shell with web views for specific screens; shared business logic.
- **Expo managed workflow:** OTA updates, EAS Build/Submit, Expo Go; fastest iteration.

**Completion criterion:** platform strategy named with rationale.

### 2. Design the app architecture

- **Navigation:** stack, tab, drawer; deep linking scheme; universal links / app links.
- **State management:** local state, global state (Redux, Zustand, Jotai, Recoil), server state (React Query, SWR).
- **Data layer:** API client, caching, offline queue, database (SQLite, Realm, WatermelonDB).
- **Module boundaries:** feature modules, shared components, platform-specific code.

**Completion criterion:** architecture diagram or description saved.

### 3. Offline-first design

- **Local-first:** data stored locally; sync when online; conflict resolution strategy.
- **Sync model:** pull-based, push-based, or bidirectional; sync frequency; conflict resolution (last-write-wins, CRDT, manual merge).
- **Storage:** AsyncStorage, SQLite, encrypted storage; migration strategy.
- **Network detection:** connectivity change handlers; graceful degradation.

**Completion criterion:** offline model and sync strategy named.

### 4. Push notifications

- **Providers:** FCM (Firebase Cloud Messaging), APNs (Apple Push Notification service), Expo Notifications.
- **Notification types:** transactional, marketing, silent/data notifications; permissions.
- **Deep linking:** notification tap → app screen; payload schema; handling app states (foreground, background, closed).
- **Badge and sound:** platform-specific conventions; accessibility.

**Completion criterion:** notification strategy and deep linking schema named.

### 5. Platform-specific UX and performance

- **iOS:** Human Interface Guidelines, SF Symbols, safe areas, dynamic type, VoiceOver.
- **Android:** Material Design, Material You, adaptive icons, back gesture, TalkBack.
- **Performance:** cold start time, memory usage, battery consumption, list recycling, image caching.
- **Accessibility:** screen reader support, dynamic type, high contrast, reduced motion.

**Completion criterion:** platform UX and performance targets named.

### 6. Build, deploy, and update

- **CI/CD:** EAS Build, Fastlane, GitHub Actions; code signing, provisioning profiles.
- **App stores:** App Store Connect, Google Play Console; metadata, screenshots, compliance.
- **OTA updates:** Expo Updates, CodePush; rollback strategy; A/B testing.
- **Crash reporting:** Sentry, Firebase Crashlytics; symbol upload; alerting.

**Completion criterion:** build and deploy strategy named.

### 7. Security and compliance

- **Data protection:** encrypted storage, keychain/keystore, certificate pinning.
- **Authentication:** biometrics (Face ID, Touch ID), secure token storage, session management.
- **Compliance:** GDPR, CCPA, HIPAA if applicable; data retention, deletion.

**Completion criterion:** security controls named.

## Completion criteria

- the platform strategy is named
- the app architecture is described
- the offline-first model and sync strategy are explicit
- push notifications and deep linking are designed
- platform UX and performance targets are named
- build, deploy, and update strategy is named
- security controls are explicit

## References

- `../../frontend/nextjs/SKILL.md` — Next.js mobile considerations
- `../../backend/backend-architecture/SKILL.md` — API design for mobile
- `../../qa/qa-security-testing/SKILL.md` — mobile security testing
