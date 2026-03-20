# FIX: Disease Comparison - Equal Width Columns with Fixed Divider Position

## PROBLEM

The comparison table shows **unequal column widths**:
- Column with more content becomes wider
- Column with less content becomes narrower
- Divider line position shifts left/right between sections
- Some text gets cut off or overlaps
- Layout looks inconsistent and unprofessional

**Visual issue:**
```
Section 1:
┌───────────────────┬──────┐
│ Long text         │Short │  ← Divider shifted right
└───────────────────┴──────┘

Section 2:
┌──────┬───────────────────┐
│Short │ Long text         │  ← Divider shifted left
└──────┴───────────────────┘
```

**Expected:**
```
All sections:
┌──────────────┬──────────────┐
│ Disease 1    │ Disease 2    │  ← Divider ALWAYS center
├──────────────┼──────────────┤
│ Content      │ Content      │
└──────────────┴──────────────┘
```

---

## SOLUTION

Force **equal 50/50 width split** for all sections, regardless of content length.

---

## STEP 1: Find the Comparison Component

```bash
# Find the file
find src/modules/swine -name "*ompare*.jsx" -o -name "*omparison*.jsx"

# OR
grep -r "Clinical Signs" src/modules/swine --include="*.jsx" -l | grep -i compar
```

Expected file:
- `src/modules/swine/pages/DiseaseComparisonPage.jsx`
- OR `src/pages/swine/CompareDiseasesPage.jsx`

---

## STEP 2: Locate the Grid Layout

Look for the 2-column grid that displays the comparison content.

**Pattern to find:**
```jsx
<div className="grid grid-cols-2 gap-4">
  <div>{/* Disease 1 content */}</div>
  <div>{/* Disease 2 content */}</div>
</div>
```

You'll likely find **multiple** instances - one for each section:
- Clinical Signs
- Transmission
- Diagnosis
- Treatment
- Prevention & Control

---

## STEP 3: Apply Fixed Width Solution

### Fix Option A: Use Tailwind's grid with explicit equal columns

**BEFORE (auto-width - BAD):**
```jsx
<div className="grid grid-cols-2 gap-4">
```

**AFTER (fixed equal width - GOOD):**
```jsx
<div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
```

OR using Tailwind classes:
```jsx
<div className="grid grid-cols-2 gap-4">
  <div className="w-full overflow-hidden">{/* Disease 1 */}</div>
  <div className="w-full overflow-hidden">{/* Disease 2 */}</div>
</div>
```

### Fix Option B: Add explicit width constraints to child columns

**Add to BOTH columns:**
```jsx
<div className="grid grid-cols-2 gap-4">
  <div className="w-1/2 min-w-0 overflow-hidden">
    {/* Disease 1 content */}
  </div>
  <div className="w-1/2 min-w-0 overflow-hidden">
    {/* Disease 2 content */}
  </div>
</div>
```

**Key classes explained:**
- `w-1/2` → Force exactly 50% width
- `min-w-0` → Allow content to shrink below default minimum
- `overflow-hidden` → Prevent content from expanding the column

### Fix Option C: Use flexbox with equal flex-basis

**BEFORE:**
```jsx
<div className="grid grid-cols-2 gap-4">
```

**AFTER:**
```jsx
<div className="flex gap-4">
  <div className="flex-1 min-w-0 overflow-hidden">
    {/* Disease 1 content */}
  </div>
  <div className="flex-1 min-w-0 overflow-hidden">
    {/* Disease 2 content */}
  </div>
</div>
```

**Classes explained:**
- `flex` → Use flexbox instead of grid
- `flex-1` → Each child takes equal space
- `min-w-0` → Critical for allowing text wrapping
- `overflow-hidden` → Prevent overflow

---

## STEP 4: Handle Text Overflow

Since columns are now fixed width, long text might overflow. Apply word wrapping:

**Add to text elements:**
```jsx
<p className="break-words overflow-wrap-anywhere">
  {longText}
</p>
```

**OR for lists:**
```jsx
<ul>
  <li className="break-words">
    {item}
  </li>
</ul>
```

**OR globally on column:**
```jsx
<div className="flex-1 min-w-0 break-words">
  {/* All content here will wrap */}
</div>
```

---

## STEP 5: Apply to ALL Sections

**CRITICAL:** This fix must be applied to **EVERY comparison section**, not just one.

Sections that need fixing:
1. ✅ Clinical Signs
2. ✅ Transmission
3. ✅ Diagnosis
4. ✅ Treatment
5. ✅ Prevention & Control
6. ✅ Any other side-by-side sections

**Quick check:** Search the file for `grid grid-cols-2` or `grid-cols-2` and count occurrences. Apply fix to ALL of them.

---

## RECOMMENDED COMPLETE FIX

Here's the complete pattern to apply consistently:

```jsx
{/* Example: Clinical Signs Section */}
<div className="border-2 border-emerald-600 rounded-lg p-4 bg-emerald-50">
  <h3 className="text-lg font-bold text-emerald-700 mb-3">
    🩺 Clinical Signs
  </h3>
  
  {/* FIXED EQUAL-WIDTH GRID */}
  <div className="flex gap-3">
    {/* Disease 1 Column - ALWAYS 50% */}
    <div className="flex-1 min-w-0 bg-white p-3 rounded border-r-2 border-emerald-300">
      <ul className="space-y-2">
        {disease1.clinicalSigns?.map((sign, i) => (
          <li key={i} className="text-sm break-words">
            • {sign}
          </li>
        ))}
      </ul>
    </div>
    
    {/* Disease 2 Column - ALWAYS 50% */}
    <div className="flex-1 min-w-0 bg-white p-3 rounded">
      <ul className="space-y-2">
        {disease2.clinicalSigns?.map((sign, i) => (
          <li key={i} className="text-sm break-words">
            • {sign}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

{/* Repeat EXACT SAME PATTERN for: */}
{/* - Transmission */}
{/* - Diagnosis */}
{/* - Treatment */}
{/* - Prevention & Control */}
```

**Key points:**
- Use `flex` with `flex-1` for equal widths
- Add `min-w-0` to allow shrinking
- Add `break-words` to wrap long text
- Apply consistently to ALL sections

---

## ALTERNATIVE: Create a Reusable Component

To ensure consistency, extract the comparison layout into a reusable component:

```jsx
// Add this component inside the same file (before the main component)
const ComparisonSection = ({ title, icon, disease1Content, disease2Content }) => (
  <div className="border-2 border-emerald-600 rounded-lg p-4 bg-emerald-50 mb-4">
    <h3 className="text-lg font-bold text-emerald-700 mb-3">
      {icon} {title}
    </h3>
    <div className="flex gap-3">
      <div className="flex-1 min-w-0 bg-white p-3 rounded border-r-2 border-emerald-300 break-words">
        {disease1Content}
      </div>
      <div className="flex-1 min-w-0 bg-white p-3 rounded break-words">
        {disease2Content}
      </div>
    </div>
  </div>
);

// Then use it like this:
<ComparisonSection
  title="Clinical Signs"
  icon="🩺"
  disease1Content={
    <ul className="space-y-2">
      {disease1.clinicalSigns?.map((sign, i) => (
        <li key={i} className="text-sm">• {sign}</li>
      ))}
    </ul>
  }
  disease2Content={
    <ul className="space-y-2">
      {disease2.clinicalSigns?.map((sign, i) => (
        <li key={i} className="text-sm">• {sign}</li>
      ))}
    </ul>
  }
/>

<ComparisonSection
  title="Transmission"
  icon="🦠"
  disease1Content={/* ... */}
  disease2Content={/* ... */}
/>

{/* etc... */}
```

**Benefits:**
- ✅ Guaranteed consistent layout
- ✅ Less code duplication
- ✅ Easier to maintain
- ✅ Single source of truth for styling

---

## TESTING CHECKLIST

After applying the fix, verify:

1. **Visual alignment:**
   - [ ] Divider line is EXACTLY in the center of every section
   - [ ] Divider position does NOT shift between sections
   - [ ] Both columns are visually equal width in all sections

2. **Content display:**
   - [ ] Long text wraps properly (no cut-off)
   - [ ] Short text doesn't make column narrower
   - [ ] Bullet points align correctly
   - [ ] No horizontal scrolling

3. **Responsive behavior:**
   - [ ] Test at 400px width (mobile) - should still be 50/50
   - [ ] Test at 768px width (tablet) - should still be 50/50
   - [ ] Test at 1200px width (desktop) - should still be 50/50

4. **Edge cases:**
   - [ ] Disease with very long clinical signs vs short ones
   - [ ] Disease with 10 bullet points vs 2 bullet points
   - [ ] Empty section (no content) - should still show equal columns

---

## BEFORE / AFTER COMPARISON

**BEFORE (broken):**
```
Clinical Signs:
┌──────────────────────────┬──────┐
│ • Very long clinical sign│Short │  ← Unequal!
│ • Another long sign      │text  │
└──────────────────────────┴──────┘

Transmission:
┌─────┬─────────────────────────┐
│Short│ • Long transmission text│  ← Unequal!
└─────┴─────────────────────────┘
```

**AFTER (fixed):**
```
Clinical Signs:
┌─────────────────┬─────────────────┐
│ • Very long     │ Short text      │  ← Equal 50/50!
│   clinical sign │                 │
│ • Another long  │                 │
│   sign          │                 │
└─────────────────┴─────────────────┘

Transmission:
┌─────────────────┬─────────────────┐
│ Short text      │ • Long          │  ← Equal 50/50!
│                 │   transmission  │
│                 │   text wraps    │
└─────────────────┴─────────────────┘
```

**Key improvement:**
- Divider ALWAYS at 50% mark
- Content wraps within column
- Consistent visual appearance

---

## QUICK FIX SUMMARY

**Find & Replace:**

1. Find all instances of:
```jsx
<div className="grid grid-cols-2 gap-4">
  <div>
  <div>
</div>
```

2. Replace with:
```jsx
<div className="flex gap-4">
  <div className="flex-1 min-w-0 break-words">
  <div className="flex-1 min-w-0 break-words">
</div>
```

3. Verify ALL sections use the same pattern

---

## DO NOT:
- ❌ Apply fix to only some sections (must be ALL)
- ❌ Use different layout methods for different sections
- ❌ Remove `min-w-0` or `break-words` classes
- ❌ Add `max-width` constraints (defeats the equal-width purpose)

## DO:
- ✅ Apply consistently to ALL comparison sections
- ✅ Use flexbox with `flex-1` OR grid with explicit `1fr 1fr`
- ✅ Add `min-w-0` and `break-words` for proper text wrapping
- ✅ Test with diseases that have very different content lengths
- ✅ Verify divider position is centered in ALL sections

---

**Priority:** MEDIUM-HIGH (visual consistency & readability)  
**Complexity:** LOW (CSS/Tailwind class changes only)  
**Files to modify:** 1 (Comparison page component)  
**Estimated time:** 15-20 minutes
