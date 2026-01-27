import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useCity } from '../../hooks/useCity';
import { contactInfo } from '../../data/locations';
import { Button } from '../common/Button';
import styles from './LocationSection.module.css';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const createMarkerIcon = () => {
  return L.divIcon({
    className: styles.customMarker,
    html: `
      <div class="${styles.markerPin}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17.5 8A5.5 5.5 0 1 1 12 2.5 5.5 5.5 0 0 1 17.5 8Z"/>
          <path d="M12 8v.5"/>
          <circle cx="12" cy="8" r="1" fill="currentColor"/>
        </svg>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -45],
  });
};

export function LocationSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { currentCity } = useCity();

  // Calculate map center from all locations
  const centerLat = currentCity.locations.reduce((sum, loc) => sum + loc.coordinates[0], 0) / currentCity.locations.length;
  const centerLng = currentCity.locations.reduce((sum, loc) => sum + loc.coordinates[1], 0) / currentCity.locations.length;

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.eyebrow}>Наши кофейни</span>
          <h2 className={styles.title}>{currentCity.name}</h2>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            className={styles.mapWrapper}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MapContainer
              center={[centerLat, centerLng]}
              zoom={13}
              scrollWheelZoom={false}
              className={styles.map}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {currentCity.locations.map((location, index) => (
                <Marker
                  key={index}
                  position={location.coordinates}
                  icon={createMarkerIcon()}
                >
                  <Popup>
                    <div className={styles.popup}>
                      <strong>Balance Coffee</strong>
                      <span>{location.address}</span>
                      {location.isComingSoon && (
                        <span className={styles.comingSoon}>Скоро открытие</span>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>

          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.addressList}>
              <h3 className={styles.addressTitle}>Адреса в городе</h3>
              {currentCity.locations.map((location, index) => (
                <div key={index} className={styles.addressItem}>
                  <span className={styles.addressNumber}>{index + 1}</span>
                  <div>
                    <span className={styles.addressText}>{location.address}</span>
                    {location.isComingSoon && (
                      <span className={styles.soonBadge}>скоро</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.contact}>
              <div className={styles.contactItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <a href={contactInfo.phoneHref}>{contactInfo.phone}</a>
              </div>
              <div className={styles.contactItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <span>Доставка {contactInfo.deliveryHours.start} — {contactInfo.deliveryHours.end}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button href={contactInfo.phoneHref} external>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                Позвонить
              </Button>
              <Button href={contactInfo.telegram} external variant="secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 5L10 14M21 5L14 21L10 14L3 10L21 5Z"/>
                </svg>
                Telegram
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
