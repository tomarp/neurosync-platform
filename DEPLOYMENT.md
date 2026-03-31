# Deployment

This document describes how to deploy the NEUROSYNC platform as a public static site.

## Target Deployment Modes

- GitHub Pages for a public runnable demo or protocol-linked deployment
- local static server for internal testing and review
- Zenodo archival deposit for versioned software citation

## Canonical Build Artifact

Use `repository_root/` as the standalone release artifact after running:

```bash
python3 neurosync/scripts/build_platform_release.py
```

That folder is the publication-ready repository snapshot. It contains the runnable static site, software metadata, release manifest, and validation report.

## GitHub Pages Deployment

1. Create a dedicated repository, recommended name: `neurosync-platform`.
2. Copy the full content of `repository_root/` to the repository root.
3. Push the repository to GitHub.
4. In repository settings, enable GitHub Pages from the default branch root.
5. Keep `.nojekyll` at repository root.
6. Verify the landing page, task routes, media assets, and embedded forms after deployment.

## Local Verification

Run a static server from `repository_root/`:

```bash
python3 -m http.server 8000 -d repository_root
```

Then open `http://localhost:8000`.

## Release and Archive Sequence

1. Build `repository_root/`.
2. Review `VALIDATION_REPORT.md`.
3. Review `RELEASE_MANIFEST.csv`.
4. Commit the repository root to the dedicated software repository.
5. Tag a release in GitHub.
6. Archive the tagged release in Zenodo.
7. Update the DOI and repository URL in `CITATION.cff` and `.zenodo.json` for the next release cycle.

## Important Constraints

- The platform is a participant-facing static experiment runner.
- Survey responses are collected externally through Google Forms.
- Physiology and video capture occur outside the browser application.
- Do not present the app as a full acquisition or synchronization system.
