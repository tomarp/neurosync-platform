# NEUROSYNC Platform

Static experiment runner for the NEUROSYNC study.

## Purpose

This application presents the participant-facing sequence used during the collected NEUROSYNC study:

1. baseline survey
2. acclimation
3. eyes-open baseline recording
4. verbal-semantic task with 10 Hz background stimulation
5. first post-task survey
6. visuospatial task with 40 Hz background stimulation
7. second post-task survey
8. finish screen

The app is presentation-only. It does not save trial responses or survey results locally. Survey responses are collected through embedded Google Forms and physiological or video recording are handled outside the app.

## Study Framing

The platform supports the NEUROSYNC experiment on multimodal auditory stimulation under chromatic ambient lighting. The browser application should be described as the participant-facing operational runner for the protocol, not as a complete acquisition system.

## Publication Package Structure

- `experiment-config.js`: central study flow, timings, URLs, and stimulus lists
- `platform-utils.js`: shared timer and sequence rendering helpers
- `README.md`: package overview
- `PROTOCOL_ALIGNMENT.md`: mapping between app pages and protocol steps
- `PUBLISHING.md`: software publication pathway
- `DEPLOYMENT.md`: deployment instructions for GitHub Pages and local review
- `SOFTWARE_RELEASE_CHECKLIST.md`: release control checklist
- `SOURCE_RECONCILIATION.md`: explanation of source-tree versus release-tree differences
- `REPOSITORY_LAYOUT.md`: required root structure for the public repository
- `LICENSE`: software license for release distribution
- `CITATION.cff`: citation metadata for a standalone software release
- `.zenodo.json`: archival metadata for a standalone Zenodo software deposit
- `repository_root/`: generated standalone public repository snapshot after build

## Build the Standalone Release

Run:

```bash
python3 neurosync/scripts/build_platform_release.py
```

This creates `repository_root/`, which is the publishable software snapshot. It contains the runnable site, copied media assets, release metadata, a file manifest, and a validation report.

## Local Run

After building the release, run the app from a local static server instead of opening files directly:

```bash
python3 -m http.server 8000 -d repository_root
```

Then open `http://localhost:8000`.

## Notes

- The package resolves a source inconsistency in which the original platform pages reference shared scripts that are missing from the source tree.
- Timing and route definitions should be edited only in `experiment-config.js`.
- The public software repository should contain the contents of `repository_root/` directly at repository root.
