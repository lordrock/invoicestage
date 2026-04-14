This version upgrades the static Todo Card into a more interactive and stateful component using vanilla HTML, CSS, and JavaScript.
## Live Demo

hngfrontstage1.vercel.app

## GitHub Repository

https://github.com/lordrock/hngstackfrontend1

## Git Main Roots

https://github.com/lordrock/hngstackfrontend1/tree/main/Desktop/FrontendStack/stackcard/todo-card1a

## Github Repository for both Task

https://github.com/lordrock/hngstackfrontend1b/tree/main/Desktop/FrontendStack/stackcard

### New additions in Stage 1A

- Editable task content through an inline edit form
- Save and cancel editing flows
- Status control with allowed transitions: Pending, In Progress, and Done
- Checkbox and status synchronization
- Expand/collapse behavior for long descriptions
- Richer time handling with overdue state detection
- Explicit overdue indicator
- Visual state changes for Done, In Progress, High Priority, and Overdue tasks
- Priority indicator styling that changes by priority level
- Improved keyboard accessibility and semantic structure

## New Design Decisions

- Used a single JavaScript task object as the source of truth for card state
- Rendered UI updates manually through DOM rendering functions instead of a framework
- Separated view mode and edit mode to keep interactions predictable
- Synced checkbox and status logic to avoid conflicting UI states
- Used a collapsible description pattern only when the content exceeds a defined length
- Paused live time updates while editing to reduce unexpected interface changes

## Known Limitations

- Delete button is present but does not remove the card from the page
- Focus trapping inside edit mode is not implemented
- Tags are static and not editable in the current version
- The project is intentionally limited to a single Todo Card, not a full task manager

## Accessibility Notes

- Uses semantic elements such as article, time, button, form, input, textarea, select, and list
- Expand/collapse control uses a real button and supports keyboard interaction
- Checkbox is a real input [type="checkbox"]
- Edit form fields are associated with visible labels
- Focus returns to the Edit button when edit mode is closed