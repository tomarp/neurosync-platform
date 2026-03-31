# Protocol Alignment

This document maps the NEUROSYNC platform implementation to the experimental protocol so that the software package and the protocol package remain synchronized.

## Session Flow

| Stage | File | Participant-facing purpose | Timing |
| --- | --- | --- | --- |
| 1 | `index.html` | welcome and operator start | manual |
| 2 | `survey1.html` | baseline survey intro | 10 s |
| 3 | `survey1.html` | embedded baseline survey form | 120 s |
| 4 | `acclimation.html` | acclimation and instruction display | 150 s |
| 5 | `baseline.html` | eyes-open baseline recording | 300 s |
| 6 | `task1.html` | verbal-semantic task intro | manual |
| 7 | `task1.html` | 10 audio trials with 10 Hz background stimulation | 10 x 60 s |
| 8 | `survey2_1.html` | post-task survey 1 intro | 10 s |
| 9 | `survey2_1.html` | embedded post-task survey 1 form | 240 s |
| 10 | `task2.html` | visuospatial task intro | manual |
| 11 | `task2.html` | 10 image trials with 40 Hz background stimulation | 10 x 60 s |
| 12 | `survey2_2.html` | post-task survey 2 intro | 10 s |
| 13 | `survey2_2.html` | embedded post-task survey 2 form | 240 s |
| 14 | `finish.html` | session close and operator handoff | manual |

## Alignment Rules

- The platform app is the authority for participant-facing order.
- `experiment-config.js` is the software authority for timings, routes, forms, and stimulus lists.
- The protocol should describe the environmental manipulation as `chromatic ambient lighting`.
- Survey stage names in downstream datasets should be:
  - `baseline`
  - `post_task1`
  - `post_task2`
- The app does not store trial responses. Any behavioral interpretation must come from external survey, physiology, or video records.

## Important Caveat

The original scientific draft in `metadata/protocol.md` describes acclimation as 5 minutes, but the actual deployed participant-facing implementation runs a 150-second acclimation timer. The publication-ready protocol should document the implemented timing and preserve the discrepancy as source history.
