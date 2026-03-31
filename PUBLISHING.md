# Publishing

The NEUROSYNC platform should be published as software, not only as a manuscript supplement.

## Recommended Publication Targets

### 1. Repository publication

Publish the NEUROSYNC platform as a dedicated source-code repository using the content generated in `repository_root/`.

Recommended host:

- GitHub

Reason:

- transparent version history
- issue tracking
- release workflow
- direct support for static-site deployment

### 2. Public runnable deployment

Publish the static site through GitHub Pages.

Official GitHub documentation:

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Recommended approach:

1. Run `python3 neurosync/scripts/build_platform_release.py`.
2. Create a dedicated repository for the platform package.
3. Copy the contents of `repository_root/` to the repository root.
4. Enable GitHub Pages from the default branch root or from a dedicated `gh-pages` branch.
5. Keep `.nojekyll` in the published root.

Suggested repository name:

- `neurosync-platform`

### 3. Archival software publication

Archive tagged software releases in Zenodo to obtain a citable software record and DOI.

Zenodo GitHub integration information:

- https://support.zenodo.org/help/en-gb/24-github-integration
- https://support.zenodo.org/help/en-gb/24-github-integration/149-how-to-specify-a-license-for-a-software-record-on-github

Recommended approach:

1. Connect the GitHub repository to Zenodo.
2. Create a release in GitHub.
3. Let Zenodo archive that release.
4. Review the Zenodo metadata generated from `.zenodo.json` and `CITATION.cff`.

## Documentation Checklist Before Release

- run `python3 neurosync/scripts/build_platform_release.py`
- verify `repository_root/VALIDATION_REPORT.md`
- verify all audio and image assets load correctly
- verify route order and timers against `PROTOCOL_ALIGNMENT.md`
- ensure the study wording uses `chromatic ambient lighting`
- review `LICENSE`
- review `CITATION.cff`
- review `.zenodo.json`
- create a tagged release

## What Not To Claim

- Do not claim that this app stores trial-level response logs.
- Do not claim that the platform alone reproduces the full experiment without the external physiology, survey, and video capture systems.
- Do not describe the platform as anything broader than a participant-facing static experiment runner.
