/**
 * Google Map Component
 * Global reusable map component for Anmol Wholesale / Restaurant Pack warehouse location
 *
 * Single source of truth for map embed URL
 * Update the mapEmbedUrl constant to change the map globally
 */

import { cn } from "@/lib/utils";

// SINGLE SOURCE: Update this URL to change the map across the entire site
// Location: Fagerstagatan 13, 163 53 Spånga, Sweden (Anmol Wholesale / Anmol Sweets & Restaurant)
const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2031.3466456102306!2d17.8822457!3d59.3939289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9f2556107889%3A0x12d9a2d2203c1fa4!2sAnmol%20Sweets%20%26%20Restaurant!5e0!3m2!1sen!2s!4v1768008207130!5m2!1sen!2s";

interface GoogleMapProps {
  className?: string;
  height?: string;
  title?: string;
  showBorder?: boolean;
}

export function GoogleMap({
  className,
  height = "450px",
  title = "Anmol Wholesale - Spånga, Stockholm",
  showBorder = true
}: GoogleMapProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", showBorder && "rounded-lg border", className)}>
      <iframe
        src={MAP_EMBED_URL}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className="w-full"
      />
    </div>
  );
}

/**
 * Compact version for sidebars
 */
export function GoogleMapCompact({ className }: { className?: string }) {
  return (
    <GoogleMap
      height="250px"
      className={className}
      title="Warehouse Location Map"
    />
  );
}

/**
 * Full-width version for main sections
 */
export function GoogleMapFull({ className }: { className?: string }) {
  return (
    <GoogleMap
      height="500px"
      className={className}
      title="Visit Our Warehouse - Anmol Wholesale"
    />
  );
}
