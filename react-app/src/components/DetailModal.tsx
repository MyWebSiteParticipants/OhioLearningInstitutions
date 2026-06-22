import { useEffect, useMemo, useState } from 'react';
import type { FeatureCollection } from 'geojson';
import type { Institution } from '../types';
import { TYPE_BADGE_COLOR, CONTROL_COLOR } from '../utils/icons';
import { findJurisdiction } from '../utils/geo';
import { loadBoundary } from '../data/boundaries';

interface DetailModalProps {
  institution: Institution | null;
  onClose: () => void;
  onGoToMap: (inst: Institution) => void;
}

export default function DetailModal({ institution, onClose, onGoToMap }: DetailModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lazy-load the three jurisdiction layers once; resolve on demand.
  const [layers, setLayers] = useState<{
    counties: FeatureCollection;
    municipalities: FeatureCollection;
    townships: FeatureCollection;
  } | null>(null);

  useEffect(() => {
    if (!institution || layers) return;
    let alive = true;
    Promise.all([
      loadBoundary('counties'),
      loadBoundary('municipalities'),
      loadBoundary('townships'),
    ])
      .then(([c, m, t]) => {
        if (alive) setLayers({ counties: c, municipalities: m, townships: t });
      })
      .catch(() => {
        /* offline / fetch error — jurisdiction section just won't show */
      });
    return () => {
      alive = false;
    };
  }, [institution, layers]);

  const jurisdiction = useMemo(() => {
    if (!institution || !layers) return null;
    const { lat, lng } = institution;
    const county = findJurisdiction(lat, lng, layers.counties);
    const muni = findJurisdiction(lat, lng, layers.municipalities);
    const twp = findJurisdiction(lat, lng, layers.townships);
    return {
      county: county?.name ?? null,
      place: muni?.name ?? null,
      placeType: muni?.type ?? null,
      township: twp?.name ?? null,
    };
  }, [institution, layers]);

  if (!institution) return null;
  const inst = institution;
  const addr = `${inst.address}, ${inst.city}, ${inst.state} ${inst.zip}`;
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;

  return (
    <div id="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div id="modal">
        <div id="modal-header">
          <div id="modal-title">{inst.name}</div>
          <span
            id="modal-type-badge"
            style={{ background: TYPE_BADGE_COLOR[inst.type] || '#555' }}
          >
            {inst.type}
          </span>
          <button id="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div id="modal-body">
          <div className="modal-row">
            <div className="modal-field">
              <div className="modal-field-label">Address</div>
              <div className="modal-field-value">{inst.address}</div>
            </div>
            <div className="modal-field">
              <div className="modal-field-label">City</div>
              <div className="modal-field-value">
                {inst.city}, {inst.state}
              </div>
            </div>
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <div className="modal-field-label">ZIP Code</div>
              <div className="modal-field-value">{inst.zip}</div>
            </div>
            <div className="modal-field">
              <div className="modal-field-label">Control</div>
              <div
                className="modal-field-value"
                style={{ color: CONTROL_COLOR[inst.control], fontWeight: 700 }}
              >
                {inst.control}
              </div>
            </div>
          </div>
          {(inst.sector || inst.enrollment) && (
            <div className="modal-row">
              {inst.sector && (
                <div className="modal-field">
                  <div className="modal-field-label">Sector</div>
                  <div className="modal-field-value">{inst.sector}</div>
                </div>
              )}
              {inst.enrollment && (
                <div className="modal-field">
                  <div className="modal-field-label">
                    Enrollment {inst.enrYear ? `(${inst.enrYear})` : ''}
                  </div>
                  <div className="modal-field-value">
                    {inst.enrollment.toLocaleString()} students
                  </div>
                </div>
              )}
            </div>
          )}
          {inst.parentUniversity && (
            <div className="modal-row">
              <div className="modal-field">
                <div className="modal-field-label">Parent University</div>
                <div className="modal-field-value">{inst.parentUniversity}</div>
              </div>
            </div>
          )}

          {jurisdiction && (jurisdiction.county || jurisdiction.place || jurisdiction.township) && (
            <div className="modal-row">
              {jurisdiction.county && (
                <div className="modal-field">
                  <div className="modal-field-label">County</div>
                  <div className="modal-field-value">{jurisdiction.county}</div>
                </div>
              )}
              {jurisdiction.place ? (
                <div className="modal-field">
                  <div className="modal-field-label">
                    {jurisdiction.placeType || 'Municipality'}
                  </div>
                  <div className="modal-field-value">{jurisdiction.place}</div>
                </div>
              ) : jurisdiction.township ? (
                <div className="modal-field">
                  <div className="modal-field-label">Township</div>
                  <div className="modal-field-value">{jurisdiction.township}</div>
                </div>
              ) : null}
            </div>
          )}

          <hr className="modal-divider" />
          <div className="modal-actions">
            {inst.website && (
              <a
                href={inst.website}
                target="_blank"
                rel="noopener"
                className="modal-link-btn btn-primary"
              >
                &#127891; Institution Website
              </a>
            )}
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noopener"
              className="modal-link-btn btn-gmaps"
            >
              &#128205; Get Directions
            </a>
            <button
              className="modal-link-btn btn-goto"
              onClick={() => onGoToMap(inst)}
            >
              &#127919; Go To on Map
            </button>
            {inst.cityWebsite && (
              <a
                href={inst.cityWebsite}
                target="_blank"
                rel="noopener"
                className="modal-link-btn btn-city"
              >
                &#127961; City Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
