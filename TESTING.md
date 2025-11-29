# Testing Key Wizard Extension

## How to Test

### 1. Load the Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the `dist` folder: `/home/ansh/Works/anshulsahni/key-wizard/dist`
5. The extension should appear in your extensions list

### 2. Test on Google Search
1. Go to `https://www.google.com`
2. Search for something (e.g., "test search")
3. Wait for search results to load
4. **Open the browser console** (F12 or Right-click → Inspect → Console tab)
5. You should see: `Key Wizard: Initializing...` and `Key Wizard: Found X search results`

### 3. Use Keyboard Navigation
- Press **`j`** or **`ArrowDown`** → Move to next result (should highlight in blue)
- Press **`k`** or **`ArrowUp`** → Move to previous result
- Press **`Enter`** → Visit the highlighted result

### 4. Troubleshooting

**If nothing happens:**
1. Check the browser console for errors
2. Make sure you're on a Google search results page (URL should contain `/search`)
3. Reload the extension: Go to `chrome://extensions/` → Click the reload icon on Key Wizard
4. Reload the Google search page (F5)
5. Check console for: `Key Wizard: Found X search results` - if it says 0, the selectors might need updating

**If keys don't work:**
- Make sure you're NOT typing in the search box (click somewhere else on the page first)
- Check that the extension is enabled in `chrome://extensions/`
- Try pressing `j` or `k` directly (not while typing)

## Default Key Bindings

| Action | Keys |
|--------|------|
| Next Result | `j`, `ArrowDown` |
| Previous Result | `k`, `ArrowUp` |
| Activate Link | `Enter` |

