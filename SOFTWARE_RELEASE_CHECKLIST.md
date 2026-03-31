# Software Release Checklist

## Pre-Build

- Verify `experiment-config.js` timings and routes.
- Verify Google Forms URLs in `experiment-config.js`.
- Verify task audio and image assets are present in the source platform tree.
- Verify wording uses `chromatic ambient lighting`.

## Build

- Run `python3 neurosync/scripts/build_platform_release.py`.
- Check that `repository_root/` is regenerated successfully.
- Check `repository_root/VALIDATION_REPORT.md` reports `PASS`.
- Check `repository_root/RELEASE_MANIFEST.csv` exists.

## Release Repository

- Copy `repository_root/` into the dedicated public repository root.
- Confirm `README.md`, `LICENSE`, `CITATION.cff`, `.zenodo.json`, and `.nojekyll` are present.
- Confirm the public repository default branch serves the platform root cleanly.

## Public Claims Check

- Do not claim local trial-response storage.
- Do not claim browser-side physiological acquisition.
- Do not claim hardware-trigger synchronization.
- Do not attach private participant data to the software repository.

## Archival Check

- Tag the software release.
- Archive the release in Zenodo.
- Record the software DOI.
- Add the DOI back into platform and protocol references.
