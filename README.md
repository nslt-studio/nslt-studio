# nslt.studio

Custom JavaScript for [nslt.studio](https://nslt.studio) — hosted on Webflow.

## Features

| Module | Description |
|---|---|
| **Scroll reset** | Forces scroll to top on page load (disables browser scroll restoration) |
| **Time & Year** | Displays Paris time (CET) and current year via `[data-time]` / `[data-year]` attributes |
| **Mirror scroll** | Syncs window scroll position to a `#mirror` container |
| **Profile toggle** | Toggles visibility between `#nav-nslt` and `#profile-nslt` based on scroll position |
| **Dynamic padding** | Adjusts `.pb-end` bottom padding to 25 vh |
| **Analog clock** | Smooth radial clock with `.hand.hour`, `.hand.minute`, `.hand.second` |
| **Text scramble** | Scramble-reveal animation on `h1` and `h2` when they enter the viewport |

## Usage

Add this single script tag before `</body>` in your Webflow project settings:

```html
<script src="https://cdn.jsdelivr.net/gh/nslt-studio/nslt-studio@main/main.js"></script>
```

## Webflow attributes

| Attribute / Selector | Purpose |
|---|---|
| `[data-time]` | Receives live Paris time |
| `[data-year]` | Receives `©2025` (auto-updated) |
| `#mirror` | Scroll-synced container |
| `#nav-nslt` | Navigation element (profile toggle) |
| `#profile-nslt` | Profile element (profile toggle) |
| `.pb-end` | Elements with dynamic bottom padding |
| `.clock` | Analog clock container |
| `.hand.hour / .minute / .second` | Clock hands |
| `h1, h2` | Scramble text animation targets |
| `.page-wrapper` | Faded in after scroll reset |

## License

Private — All rights reserved.
