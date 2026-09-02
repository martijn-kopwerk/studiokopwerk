# Palette's Journal - Critical Learnings

## 2025-09-01 - Copy to Clipboard Visual and Live Region Feedback
**Learning:** Copying content to the clipboard requires both immediate visual feedback (such as updating button text to "Gekopieerd!") and screen reader feedback via `aria-live="polite"` and dynamic `aria-label`, as icon-only status changes are otherwise invisible to assistive technology users.
**Action:** Always pair visual copy confirmation state changes with screen reader announcements using `aria-live` and explicit `aria-label` updates on interactive copy elements.
