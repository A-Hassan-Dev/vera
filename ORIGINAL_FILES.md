# Original Files Reference

## File Locations

### Original Files (Root Directory)
- `three.js` - Three.js library (now copied to `public/three.js`)
- `three.html` - Original HTML template (replaced by `public/rings.html`)

### New Integrated Files
- `public/three.js` - Three.js library for production use
- `public/rings.html` - Enhanced standalone viewer with two rings
- `src/components/StandaloneRingsViewer.tsx` - React component wrapper

## What Changed

### three.js
- **Original Location**: Root directory
- **New Location**: `public/three.js`
- **Status**: Copied (original preserved)
- **Purpose**: Serves as static asset for the standalone viewer

### three.html
- **Original Location**: Root directory  
- **Enhanced Version**: `public/rings.html`
- **Status**: Original preserved, enhanced version created
- **Improvements**:
  - Added two rings instead of one
  - Enhanced controls (toggle visibility, reset view)
  - Better styling and UI
  - Improved lighting setup
  - Added loading animation
  - Mouse controls for rotation and zoom

## Migration Notes

The original `three.html` file has been enhanced and moved to `public/rings.html` with the following additions:

1. **Two Rings**: Now displays two wedding bands positioned for pair viewing
2. **Interactive Controls**: 
   - Toggle each ring's visibility
   - Reset camera view
   - Mouse drag rotation
   - Mouse wheel zoom
3. **Professional Styling**: Clean UI with modern design
4. **Better Integration**: Can be embedded in the React app via iframe

## Accessing the Viewers

### Standalone Viewer (Enhanced)
```
http://localhost:5173/rings.html
```

### React App with Toggle
```
http://localhost:5173/
```
Then click "Standalone Viewer" button

## Original Files Preserved
Both original files remain in the root directory:
- `three.js` - Unchanged
- `three.html` - Unchanged

You can still access the original `three.html` by opening it directly in a browser, but it won't have the enhanced features of the new `rings.html` version.
