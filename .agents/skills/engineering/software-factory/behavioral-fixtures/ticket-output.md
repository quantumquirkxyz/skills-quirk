# Ticket: Define Independent Factory Validation

## Parent
factory-design

## What to build
Add a validator stage that checks worker output against explicit pass criteria without generating code.

## Metadata
- Type: implementation slice
- Area: software factory
- Priority: high

## Acceptance criteria
- Validator has a quality threshold and named pass criteria.
- Foreman routes completed batches to the validator.
- Validator output records pass or escalation.

## Validation
Run the schema check and verify a sample batch cannot be self-reviewed by its code writer.

## Blocked by
- Final validator pass criteria from the factory owner.

## Notes
Keep runtime execution outside this ticket; emit design configuration only.
