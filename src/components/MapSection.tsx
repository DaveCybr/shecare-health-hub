import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  Phone,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mapsService } from "@/lib/api/services";

interface Clinic {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string | null;
  rating?: number | null;
  open_now?: boolean | null;
  distance?: number;
  type?: string;
  website?: string | null;
  opening_hours?: string | null;
}

// Declare Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

const MapsSection = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedRadius, setSelectedRadius] = useState(5000);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationPermission, setLocationPermission] =
    useState<string>("prompt");

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  // Load Leaflet CSS and JS
  useEffect(() => {
    // Check if already loaded
    if (window.L) {
      setMapLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.async = true;
    script.onload = () => {
      console.log("✅ Leaflet loaded");
      setMapLoaded(true);
    };
    script.onerror = () => {
      console.error("❌ Failed to load Leaflet");
      setError("Gagal memuat peta");
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (
      !mapLoaded ||
      !mapRef.current ||
      !userLocation ||
      mapInstanceRef.current
    )
      return;

    console.log("🗺️ Initializing Leaflet map at:", userLocation);

    try {
      // Create map
      const map = window.L.map(mapRef.current).setView(
        [userLocation.lat, userLocation.lng],
        13
      );

      // Add tile layer (OpenStreetMap)
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add user location marker (blue circle)
      const userIcon = window.L.divIcon({
        className: "custom-user-marker",
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: #4285F4;
            border: 4px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      userMarkerRef.current = window.L.marker(
        [userLocation.lat, userLocation.lng],
        {
          icon: userIcon,
          title: "Lokasi Anda",
          zIndexOffset: 1000,
        }
      ).addTo(map);

      console.log("✅ Map initialized");
    } catch (err) {
      console.error("❌ Map initialization error:", err);
      setError("Gagal menginisialisasi peta");
    }
  }, [mapLoaded, userLocation]);

  // Update markers when clinics change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || clinics.length === 0) return;

    console.log("📍 Adding", clinics.length, "markers to map");

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    clinics.forEach((clinic, index) => {
      // Custom marker icon
      const markerIcon = window.L.divIcon({
        className: "custom-clinic-marker",
        html: `
          <div style="position: relative;">
            <svg width="40" height="50" viewBox="0 0 40 50" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
              <path d="M20 0C11.2 0 4 7.2 4 16c0 12 16 34 16 34s16-22 16-34c0-8.8-7.2-16-16-16z" fill="#ec4899"/>
              <circle cx="20" cy="16" r="10" fill="white"/>
              <text x="20" y="21" font-family="Arial" font-size="12" font-weight="bold" fill="#ec4899" text-anchor="middle">${
                index + 1
              }</text>
            </svg>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50],
      });

      const marker = window.L.marker([clinic.lat, clinic.lng], {
        icon: markerIcon,
        title: clinic.name,
      }).addTo(mapInstanceRef.current);

      // Create popup content
      const popupContent = `
        <div style="min-width: 250px; max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px; color: #1f2937;">
            ${clinic.name}
          </h3>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
            ${clinic.address}
          </p>
          
          ${getClinicBadgesHTML(clinic)}
          
          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 12px; font-size: 13px; color: #4b5563;">
            ${
              clinic.distance
                ? `<div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-weight: 500;">📍 Jarak:</span>
                    <span>${formatDistance(clinic.distance)}</span>
                  </div>`
                : ""
            }
            ${
              clinic.phone
                ? `<div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-weight: 500;">📞 Telepon:</span>
                    <a href="tel:${clinic.phone}" style="color: #ec4899; text-decoration: none;">${clinic.phone}</a>
                  </div>`
                : ""
            }
            ${
              clinic.opening_hours
                ? `<div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-weight: 500;">🕐 Jam Buka:</span>
                    <span style="font-size: 12px;">${clinic.opening_hours}</span>
                  </div>`
                : ""
            }
            ${
              clinic.website
                ? `<div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-weight: 500;">🌐 Website:</span>
                    <a href="${clinic.website}" target="_blank" style="color: #ec4899; text-decoration: none;">Kunjungi</a>
                  </div>`
                : ""
            }
          </div>
          
          <a href="https://www.google.com/maps/dir/?api=1&destination=${
            clinic.lat
          },${clinic.lng}" 
             target="_blank" 
             style="display: block; margin-top: 12px; padding: 10px 16px; background: #ec4899; color: white; text-align: center; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
            🧭 Dapatkan Rute
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: "custom-popup",
      });

      // Click event
      marker.on("click", () => {
        setSelectedClinic(clinic);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (clinics.length > 0 && userLocation) {
      const bounds = window.L.latLngBounds([
        [userLocation.lat, userLocation.lng],
        ...clinics.map((c) => [c.lat, c.lng]),
      ]);

      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
      });
    }

    console.log("✅ Markers added successfully");
  }, [clinics, mapLoaded, userLocation]);

  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Browser Anda tidak mendukung geolocation");
      setLoading(false);
      const jemberLocation = { lat: -8.1666, lng: 113.7 };
      setUserLocation(jemberLocation);
      fetchNearbyClinics(
        jemberLocation.lat,
        jemberLocation.lng,
        selectedRadius
      );
      return;
    }

    console.log("📍 Requesting user location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("✅ Location obtained:", position.coords);
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setLocationPermission("granted");
        fetchNearbyClinics(location.lat, location.lng, selectedRadius);
      },
      (error) => {
        console.error("❌ Geolocation error:", error);
        setLocationPermission("denied");

        const jemberLocation = { lat: -8.1666, lng: 113.7 };
        setUserLocation(jemberLocation);
        setError("Menggunakan lokasi default: Jember, Jawa Timur");
        fetchNearbyClinics(
          jemberLocation.lat,
          jemberLocation.lng,
          selectedRadius
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const fetchNearbyClinics = async (
    lat: number,
    lng: number,
    radius: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      console.log("🏥 Fetching clinics:", { lat, lng, radius });

      const response = await mapsService.getNearbyClinic(lat, lng, radius);

      console.log("📥 Response from backend:", response);

      let clinicsData: Clinic[] = [];

      if (
        response?.data?.data?.clinics &&
        Array.isArray(response.data.data.clinics)
      ) {
        clinicsData = response.data.data.clinics;
      } else if (
        response?.data?.clinics &&
        Array.isArray(response.data.clinics)
      ) {
        clinicsData = response.data.clinics;
      } else if (response?.clinics && Array.isArray(response.clinics)) {
        clinicsData = response.clinics;
      } else if (response?.data && Array.isArray(response.data)) {
        clinicsData = response.data;
      } else if (Array.isArray(response)) {
        clinicsData = response;
      }

      console.log("✅ Parsed clinics:", clinicsData.length);

      if (clinicsData.length > 0) {
        setClinics(clinicsData);
        setError(null);
      } else {
        setClinics([]);
        setError(
          "Tidak ada klinik ditemukan dalam radius ini. Coba perbesar radius pencarian."
        );
      }
    } catch (err: any) {
      console.error("❌ Error fetching clinics:", err);
      setError(err.message || "Gagal memuat data klinik");
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleRadiusChange = (newRadius: number) => {
    setSelectedRadius(newRadius);
    if (userLocation) {
      fetchNearbyClinics(userLocation.lat, userLocation.lng, newRadius);
    }
  };

  const handleClinicClick = (clinic: Clinic, index: number) => {
    setSelectedClinic(clinic);

    if (mapInstanceRef.current && mapLoaded) {
      mapInstanceRef.current.setView([clinic.lat, clinic.lng], 16, {
        animate: true,
        duration: 1,
      });

      if (markersRef.current[index]) {
        markersRef.current[index].openPopup();
      }
    }
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return "N/A";
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const getClinicTypeLabel = (type?: string) => {
    const types: Record<string, string> = {
      hospital: "Rumah Sakit",
      clinic: "Klinik",
      doctors: "Praktek Dokter",
      healthcare: "Fasilitas Kesehatan",
    };
    return types[type || ""] || "Fasilitas Kesehatan";
  };

  const getClinicTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      hospital: "bg-red-100 text-red-800",
      clinic: "bg-blue-100 text-blue-800",
      doctors: "bg-green-100 text-green-800",
      healthcare: "bg-purple-100 text-purple-800",
    };
    return colors[type || ""] || "bg-gray-100 text-gray-800";
  };

  const getClinicBadgesHTML = (clinic: Clinic) => {
    const badges = [];

    if (clinic.type) {
      badges.push(
        `<span style="display: inline-block; padding: 4px 8px; background: #dbeafe; color: #1e40af; border-radius: 4px; font-size: 12px; font-weight: 500; margin-right: 6px;">${getClinicTypeLabel(
          clinic.type
        )}</span>`
      );
    }

    if (clinic.distance) {
      badges.push(
        `<span style="display: inline-block; padding: 4px 8px; background: #dcfce7; color: #166534; border-radius: 4px; font-size: 12px; font-weight: 500; margin-right: 6px;">📍 ${formatDistance(
          clinic.distance
        )}</span>`
      );
    }

    return badges.length > 0
      ? `<div style="margin-bottom: 8px;">${badges.join("")}</div>`
      : "";
  };

  return (
    <>
      <section id="lokasi" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Temukan Fasilitas Kesehatan Terdekat
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
              Akses mudah ke klinik dan rumah sakit di sekitar Anda
            </p>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Globe size={16} />
              Data dari OpenStreetMap
            </p>
          </div>

          {/* Radius Selector */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {[2000, 5000, 10000, 15000].map((radius) => (
              <Button
                key={radius}
                variant={selectedRadius === radius ? "default" : "outline"}
                size="sm"
                onClick={() => handleRadiusChange(radius)}
                disabled={loading}
                className={selectedRadius === radius ? "bg-primary" : ""}
              >
                {radius / 1000} km
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={getUserLocation}
              disabled={loading}
              className="text-primary"
            >
              <RefreshCw
                size={16}
                className={`mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Clinics List */}
            <div>
              {locationPermission === "denied" && (
                <Card className="mb-4 border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertCircle
                      className="text-yellow-600 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">
                        Akses Lokasi Ditolak
                      </p>
                      <p className="text-sm text-yellow-700">
                        Menggunakan lokasi default: Jember, Jawa Timur
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {error && (
                <Card className="mb-4 border-red-200 bg-red-50">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertCircle
                      className="text-red-600 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-red-800 font-medium mb-1">
                        Error
                      </p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2
                    className="animate-spin text-primary mb-3"
                    size={40}
                  />
                  <span className="text-muted-foreground">
                    Mencari fasilitas kesehatan...
                  </span>
                </div>
              ) : clinics.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Ditemukan {clinics.length} fasilitas dalam radius{" "}
                    {selectedRadius / 1000} km
                  </div>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {clinics.map((clinic, index) => (
                      <Card
                        key={index}
                        className={`hover:shadow-lg transition-all cursor-pointer ${
                          selectedClinic === clinic
                            ? "ring-2 ring-primary shadow-lg"
                            : ""
                        }`}
                        onClick={() => handleClinicClick(clinic, index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                                {clinic.name}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-start gap-2 mb-2">
                                <MapPin
                                  size={14}
                                  className="flex-shrink-0 mt-0.5"
                                />
                                <span className="line-clamp-2">
                                  {clinic.address}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {clinic.type && (
                              <Badge
                                className={getClinicTypeColor(clinic.type)}
                              >
                                {getClinicTypeLabel(clinic.type)}
                              </Badge>
                            )}
                            {clinic.distance && (
                              <Badge variant="outline">
                                <Navigation size={12} className="mr-1" />
                                {formatDistance(clinic.distance)}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2 mb-3">
                            {clinic.phone && (
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Phone size={14} className="flex-shrink-0" />
                                <a
                                  href={`tel:${clinic.phone}`}
                                  className="text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {clinic.phone}
                                </a>
                              </p>
                            )}
                            {clinic.opening_hours && (
                              <p className="text-sm text-muted-foreground flex items-start gap-2">
                                <Clock
                                  size={14}
                                  className="flex-shrink-0 mt-0.5"
                                />
                                <span className="line-clamp-2">
                                  {clinic.opening_hours}
                                </span>
                              </p>
                            )}
                            {clinic.website && (
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Globe size={14} className="flex-shrink-0" />
                                <a
                                  href={clinic.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline truncate"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Kunjungi Website
                                </a>
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              className="flex-1 bg-primary hover:bg-primary/90"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`,
                                  "_blank"
                                );
                              }}
                            >
                              <Navigation size={14} className="mr-2" />
                              Rute
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClinicClick(clinic, index);
                              }}
                            >
                              <MapPin size={14} className="mr-2" />
                              Peta
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MapPin
                      className="mx-auto mb-4 text-muted-foreground"
                      size={48}
                    />
                    <p className="text-muted-foreground mb-2 font-medium">
                      Tidak ada fasilitas kesehatan ditemukan
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Coba perbesar radius pencarian
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={getUserLocation} variant="outline">
                        <RefreshCw size={16} className="mr-2" />
                        Coba Lagi
                      </Button>
                      <Button
                        onClick={() => handleRadiusChange(15000)}
                        variant="default"
                      >
                        Perbesar Radius
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Leaflet Map */}
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-border h-[600px] sticky top-4">
              {!mapLoaded ? (
                <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                  <Loader2
                    className="animate-spin text-primary mb-4"
                    size={40}
                  />
                  <p className="text-muted-foreground">Memuat peta...</p>
                </div>
              ) : !userLocation ? (
                <div className="flex flex-col items-center justify-center h-full bg-gray-100">
                  <MapPin className="text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground mb-4">
                    Menunggu izin akses lokasi...
                  </p>
                  <Button onClick={getUserLocation} size="sm">
                    Izinkan Akses Lokasi
                  </Button>
                </div>
              ) : (
                <div ref={mapRef} className="w-full h-full" />
              )}
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => {
                if (userLocation) {
                  window.open(
                    `https://www.google.com/maps/search/klinik+kesehatan/@${userLocation.lat},${userLocation.lng},14z`,
                    "_blank"
                  );
                }
              }}
              size="lg"
              className="bg-primary hover:bg-primary/90"
              disabled={!userLocation}
            >
              <MapPin size={20} className="mr-2" />
              Buka di Google Maps
            </Button>
          </div>
        </div>

        <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ec4899;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #db2777;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
      </section>
    </>
  );
};

export default MapsSection;
export const MapSection = MapsSection;
