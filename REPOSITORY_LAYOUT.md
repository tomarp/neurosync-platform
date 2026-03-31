# Repository Layout

The publication-ready platform repository should use the root layout produced in `platform_package/repository_root/`.

## Root Files

- HTML pages: `index.html`, `survey1.html`, `acclimation.html`, `baseline.html`, `task1.html`, `survey2_1.html`, `task2.html`, `survey2_2.html`, `finish.html`
- shared scripts: `experiment-config.js`, `platform-utils.js`, `dynamicText.js`
- styling: `styles.css`
- media folders: `auditoryBeats/`, `auditoryText/`, `visuals/`, `visuospatial/`
- publication metadata: `README.md`, `LICENSE`, `CITATION.cff`, `.zenodo.json`, `.nojekyll`
- release controls: `PUBLISHING.md`, `DEPLOYMENT.md`, `SOFTWARE_RELEASE_CHECKLIST.md`, `PROTOCOL_ALIGNMENT.md`, `SOURCE_RECONCILIATION.md`
- build outputs: `RELEASE_MANIFEST.csv`, `VALIDATION_REPORT.md`

## Release Rule

The public repository should contain the contents of `repository_root/` directly at repository root, not nested in another directory.
