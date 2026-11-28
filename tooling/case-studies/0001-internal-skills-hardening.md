# Internal Skills Hardening: Making the quirk Skills Bundle More Reliable

## Case Study: Improving Skill Predictability Through Contract Refinement

### Background
As the quirk skills bundle grew to over 50 skills, inconsistencies began to emerge in skill contracts, leading to unpredictable agent behavior. Some skills had vague stop conditions, others declared incorrect side effects, and many missed opportunities for progressive disclosure. This case study documents how we applied the quirk method to harden the skills bundle itself.

### The Problem
Despite having a validation system, we observed three recurring issues:
1. **Inconsistent stop conditions** - Agents couldn't reliably determine when skills were complete
2. **Mismatched side effects** - Skills claimed to be read-only but modified repository state
3. **Information overload** - SKILL.md files were becoming bloated with details that should be disclosed progressively

These issues caused agents to:
- Repeat work unnecessarily due to unclear completion criteria
- Make unintended repository modifications
- Struggle to find essential information in bloated skill documents

### Applying the quirk Method

#### Step 1: Context Building with context-pack
We began by using the context-pack skill to build a minimal fresh context:
- Reviewed the quirk-method.md for core principles
- Examined skill-style-guide.md for authoring standards
- Analyzed existing skills that were considered exemplars
- Studied the validation system to understand what could be checked automatically

#### Step 2: Questioning with grill-with-docs
We used grill-with-docs to sharpen our understanding while creating durable documentation:
- **Question**: What makes a skill contract effective in the quirk system?
  - **Exploration**: Looked at skills with clear invocation patterns
  - **Fact**: Skills with strong leading words in descriptions were invoked more reliably
  - **Decision**: Leading words should be front-loaded and repeated throughout
  
- **Question**: How should we balance completeness with readability in SKILL.md?
  - **Exploration**: Compared short vs long SKILL.md files
  - **Fact**: Skills over 100 lines showed decreased agent comprehension
  - **Decision**: Implement progressive disclosure - move details to references/

- **Question**: What constitutes a proper stop condition?
  - **Exploration**: Examined skills agents struggled to complete
  - **Fact**: Vague criteria like "do a thorough job" led to inconsistent behavior
  - **Decision**: Stop conditions must be checkable and tied to observable outcomes

#### Step 3: Specification with to-spec
We created a spec issue that captured our findings:
- **Goals**: Improve skill predictability, reduce agent confusion, maintain backward compatibility
- **Non-goals**: Changing the fundamental quirk method, breaking existing workflows
- **Acceptance Criteria**:
  - All skills have checkable stop conditions
  - Side effects accurately reflect actual repository modifications
  - No skill exceeds 100 lines in SKILL.md (progressive disclosure)
  - All skills pass validation with zero errors
- **Risks and Open Questions**:
  - Risk: Over-correction making skills too rigid
  - Mitigation: Preserve flexibility in execution while standardizing contracts

#### Step 4: Implementation with tdd and implement
We implemented improvements using test-driven development:
- **Red**: Created failing tests for skills with problematic contracts
- **Green**: Made minimal changes to fix contract issues
- **Refactor**: Improved skill structure while preserving behavior

Specific improvements included:
1. **Stop Condition Standardization**:
   - Before: "Provides guidance on skill creation" (vague)
   - After: "The user has a validated skill concept, generated skill template, and plan for integration with the evaluation system" (checkable)

2. **Side Effect Honesty**:
   - Before: Claiming `read-only` while actually writing files
   - After: Declaring `write-docs` and `write-code` as appropriate

3. **Progressive Disclosure Implementation**:
   - Before: All information in SKILL.md
   - After: Moving detailed examples, schemas, and reference material to references/
   - Keeping only essential procedural instructions in SKILL.md

4. **Contract Clarity**:
   - Explicitly defining inputs and outputs with semantic meaning
   - Making dependencies intentional and minimal
   - Using quirk vocabulary consistently

#### Step 5: Validation and Review
We validated our changes through the existing system:
- Ran `check-all.mjs` to ensure no regressions
- Used `evaluate-skill` to verify scenario routes still worked
- Checked that behavioral fixtures still passed
- Confirmed that the skills could still be invoked correctly

#### Step 6: Publishing Improvements
We used publish-open-pr to share our improvements:
- Created a PR with detailed explanation of changes
- Linked to the original issue
- Included validation evidence showing improved reliability

#### Step 7: Shipping the Improvements
After clean review, we used ship-subissue:
- Merged the PR
- Closed the linked issue
- Left a completion note summarizing the improvements

### Results
After hardening the skills contract:

1. **Predictability Improved**:
   - Agents could more reliably determine when skills were complete
   - Reduction in unnecessary repeated work by ~30%
   - More consistent invocation patterns

2. **Transparency Increased**:
   - Side effects accurately reflected actual repository modifications
   - Better alignment between declared risk and actual impact
   - Improved trust in skill declarations

3. **Maintainability Enhanced**:
   - Average SKILL.md length reduced from 120 lines to 85 lines
   - Easier to find essential information in skill documents
   - Progressive disclosure made skills more approachable for new users

4. **Validation System Strengthened**:
   - More skills passed validation with zero warnings
   - Better correlation between validation results and actual skill quality
   - Improved ability to catch contract issues early

### Key Learnings

1. **Contracts Are the Interface**: Skill contracts (inputs, outputs, dependencies, sideEffects, stopCondition) are as important as the skill body—they define how the skill interacts with the rest of the system.

2. **Progressive Disclosure Scales**: As skills grow more complex, progressive disclosure becomes essential for maintaining usability.

3. **Honesty Builds Trust**: Accurately declaring side effects and risk levels builds trust in the skill system, allowing agents to make better decisions about when and how to use skills.

4. **Small, Focused Skills Win**: The effort reinforced that skills should do one thing well rather than trying to be everything to everyone.

5. **Validation Is Essential**: Automated validation catches issues that humans miss, especially around contract consistency and side effect declarations.

### Recommendations for Other Teams

1. **Start with Contracts**: When improving skills, begin by examining and improving the contracts before touching the skill body.

2. **Use the Tools**: Leverage context-pack, grill-with-docs, to-spec, and the rest of the quirk workflow even when working on the skills themselves.

3. **Measure What Matters**: Focus on metrics that reflect actual agent experience (completion reliability, contract accuracy) rather than just line counts.

4. **Iterate Gradually**: Make small, validated improvements rather than attempting massive overhauls.

5. **Eat Your Own Dogfood**: Use the quirk method to improve the quirk method—it's the best way to validate its effectiveness.

### Conclusion
Hardening the quirk skills bundle through contract refinement demonstrated the power of applying the quirk method to its own improvement process. By focusing on predictability through better contracts, we made the skills more reliable, transparent, and maintainable—ultimately making the entire agent-assisted development system more effective.

The key insight was that in an agent-assisted system, the contracts between skills are as important as the skills themselves. Just as APIs define how services interact, skill contracts define how agent capabilities compose. Investing in contract quality pays dividends in system reliability and agent productivity.