# Claude Sonnet Prompt: Fix Services Dropdown - Make Scrollable

## PROBLEM
Services dropdown on desktop has too many items - you cannot see everything. Need to make it scrollable or handle overflow.

---

## FILES TO MODIFY

1. `/src/components/site/Header.tsx` - MENUS array and Dropdown component
2. `/src/index.css` - Dropdown styles

---

## SOLUTION: MAKE DROPDOWN SCROLLABLE

**Step 1: Read Header.tsx**
- Examine the Dropdown component rendering
- Check how `wide: true` dropdowns are styled
- Look at the MENUS array structure

**Step 2: Add max-height and scroll to dropdown in index.css**

Add or update dropdown CSS:

```css
/* Scrollable dropdown for Services */
.dropdown-menu[data-wide="true"] {
  max-height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

.dropdown-menu[data-wide="true"]::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu[data-wide="true"]::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-menu[data-wide="true"]::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 3px;
}

.dropdown-menu[data-wide="true"]::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--chrome));
}
```

**Step 3: Test on desktop**
- Open Services dropdown
- Verify it scrolls when content exceeds max-height
- Check scrollbar is visible but not obtrusive
- Ensure all service items are accessible

**Step 4: Mobile consideration**
- On mobile, dropdowns already use native `<details>` element
- Ensure scroll doesn't break mobile behavior
- Test on 375px width

---

## ALTERNATIVE SOLUTION: GROUP BY CATEGORIES WITH ACCORDION

If scroll is not preferred, implement category-based accordion:

**In Header.tsx MENUS array**:
```tsx
{
  label: "Services",
  to: "/services",
  wide: true,
  items: [
    { label: "Office & Workspace", header: true },
    { to: "/services/office-transformation", label: "Office transformation", sub: "From $1,599" },
    { to: "/services/home-office-setup", label: "Home office", sub: "From $99" },
    { to: "/services/apartment-home-office-setup", label: "Apartment office", sub: "From $99" },
    { to: "/services/school-computer-room-setup", label: "Computer room", sub: "From $329" },
    { label: "Tech & Equipment", header: true },
    { to: "/services/computer-build-setup", label: "Computer build", sub: "From $119" },
    { to: "/services/dj-studio-setup", label: "DJ & studio", sub: "From $149" },
    // ... other categories
  ]
}
```

**Add CSS for headers**:
```css
.dropdown-header {
  @apply px-4 py-2 text-xs font-bold uppercase tracking-wider text-chrome/70;
  pointer-events: none;
}
```

---

## RECOMMENDED APPROACH

**Use scrollable dropdown** - simpler, less code change, maintains current structure.

1. Add max-height and overflow-y to dropdown CSS
2. Style scrollbar to match site design
3. Test all service items are accessible
4. Push changes

---

## IMPLEMENTATION

1. Read `/src/components/site/Header.tsx` to understand dropdown structure
2. Add scrollable CSS to `/src/index.css` for `[data-wide="true"]` dropdowns
3. Test Services dropdown on desktop (1024px+)
4. Verify scrollbar appears and works
5. Test on mobile (375px) to ensure no regression
6. Commit and push

```bash
git add .
git commit -m "Make services dropdown scrollable to show all items"
git push origin main
```

**Credit-efficient**: Execute in one pass, no back-and-forth needed.
