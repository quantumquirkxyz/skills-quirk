# Refactoring flow

Generate a dependency graph before changing a shared Skill. Compare the old
and new versions with `skill-diff-analyzer`, run the testing framework in the
sandbox, and inspect the contribution report for documentation and example
gaps. Keep the change reversible and record the measured execution impact.
