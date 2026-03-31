# Source Reconciliation

The original `platform/` source tree and the publication package are not identical.

## Key Packaging Issue

The source HTML pages reference `experiment-config.js` and `platform-utils.js`, but those files are not present in the original `platform/` tree. The publication package resolves this by treating `neurosync/platform_package/` as the authoritative overlay for the runnable shared-script layer.

## Packaging Strategy

The standalone release is built as follows:

1. copy the original `platform/` source tree into `platform_package/repository_root/`
2. overlay the publication-controlled shared scripts from `platform_package/`
3. overlay documentation and archival metadata from `platform_package/`
4. patch public wording where needed for consistency with NEUROSYNC terminology
5. validate the final snapshot and write a release manifest

## Why This Matters

Without this reconciliation step, the source platform tree is not a complete standalone software release. The publication-ready package fixes that gap and should be treated as the release authority for software publication.
