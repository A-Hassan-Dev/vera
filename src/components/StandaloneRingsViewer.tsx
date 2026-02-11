import React from 'react';

/**
 * StandaloneRingsViewer - Displays the standalone three.js rings in an iframe
 * This component embeds the rings.html file which uses the three.js library directly
 */
export default function StandaloneRingsViewer() {
  return (
    <div className="w-full h-full">
      <iframe
        src="/index.html"
        className="w-full h-full border-0"
        title="3D Rings Viewer"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
}
