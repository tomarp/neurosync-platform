# NEUROSYNC Platform

NEUROSYNC Platform is the browser-based participant runner used for the NEUROSYNC study.

## What It Does

The platform presents the session flow used during the study:

1. baseline survey
2. acclimation
3. baseline recording
4. task block 1 with 10 Hz background stimulation
5. post-task survey 1
6. task block 2 with 40 Hz background stimulation
7. post-task survey 2
8. completion screen

The platform is presentation-only. It does not save task responses or survey results locally.

## Contents

- HTML stage pages and shared styles
- shared runtime scripts in `experiment-config.js` and `platform-utils.js`
- auditory and visuospatial task assets
- visual assets used by the public interface
- `LICENSE`, `CITATION.cff`, and `.zenodo.json`

## Local Preview

Serve the repository from a local static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Citation

If you reuse or reference this software, use the repository citation metadata in `CITATION.cff`.
