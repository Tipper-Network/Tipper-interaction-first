"use client";

import { useState, useCallback } from "react";

export interface IGeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  altitude?: number;
  altitudeAccuracy?: number;
}

export interface UseGeolocationReturn {
  location: IGeoLocation | null;
  isLoading: boolean;
  error: string | null;
  getCurrentPosition: () => Promise<void>;
  setLocation: (location: IGeoLocation) => void;
  clearLocation: () => void;
  forceFreshLocation: () => Promise<void>;
  checkPermissions: () => Promise<PermissionState | null>;
}

/**
 * React hook for managing geolocation state and operations
 * @returns UseGeolocationReturn object with location state and methods
 */
export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocationState] = useState<IGeoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Gets the current geolocation from the browser
   */
  const getCurrentPosition = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser.");
      }

      // Try to get high accuracy location with multiple attempts
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 3;

          const tryGetPosition = () => {
            attempts++;
            console.log(
              `🔵 [Geolocation] Attempt ${attempts}/${maxAttempts} - Forcing fresh GPS reading`
            );

            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const accuracy = pos.coords.accuracy;
                console.log(`🔵 [Geolocation] Success! Accuracy: ${accuracy}m`);

                // If accuracy is good enough (< 50m) or we've tried enough times, accept it
                if (accuracy < 50 || attempts >= maxAttempts) {
                  resolve(pos);
                } else {
                  console.log(
                    `🔵 [Geolocation] Accuracy ${accuracy}m too low, retrying...`
                  );
                  setTimeout(tryGetPosition, 1000); // Wait 1 second before retry
                }
              },
              (error) => {
                // Provide more specific error messages based on error code
                switch (error.code) {
                  case error.PERMISSION_DENIED:
                    reject(
                      new Error(
                        "Location access denied. Please enable location permissions in your browser settings."
                      )
                    );
                    break;
                  case error.POSITION_UNAVAILABLE:
                    reject(
                      new Error(
                        "Location information is unavailable. Please try again."
                      )
                    );
                    break;
                  case error.TIMEOUT:
                    reject(
                      new Error("Location request timed out. Please try again.")
                    );
                    break;
                  default:
                    reject(new Error(`Location error: ${error.message}`));
                }
              },
              {
                enableHighAccuracy: true,
                timeout: 15000, // 15 seconds
                maximumAge: 0, // Force fresh GPS reading - no cached data
              }
            );
          };

          tryGetPosition();
        }
      );

      const { latitude, longitude, accuracy, altitude, altitudeAccuracy } =
        position.coords;
      const timestamp = position.timestamp;

      // Calculate how old the location data is
      const dataAge = Date.now() - timestamp;
      const isFreshData = dataAge < 10000; // Less than 10 seconds old

      console.log(`🔵 [Geolocation] Location obtained:`, {
        accuracy: `${accuracy}m`,
        dataAge: `${Math.round(dataAge / 1000)}s old`,
        isFresh: isFreshData ? "✅ Fresh GPS" : "⚠️ Cached/Stale",
        coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      });

      const newLocation: IGeoLocation = {
        latitude,
        longitude,
        accuracy,
        timestamp,
        ...(altitude !== null && { altitude }),
        ...(altitudeAccuracy !== null && { altitudeAccuracy }),
      };

      setLocationState(newLocation);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get location";
      setError(errorMessage);
      console.warn("Geolocation failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Manually sets the location
   */
  const setLocation = useCallback((newLocation: IGeoLocation) => {
    setLocationState(newLocation);
    setError(null);
  }, []);

  /**
   * Clears the current location
   */
  const clearLocation = useCallback(() => {
    setLocationState(null);
    setError(null);
  }, []);

  /**
   * Forces a fresh GPS reading by clearing cache and getting new location
   */
  const forceFreshLocation = useCallback(async (): Promise<void> => {
    console.log("🔵 [Geolocation] Forcing fresh GPS reading - clearing cache");
    clearLocation(); // Clear any cached location
    await getCurrentPosition(); // Get completely fresh location
  }, [clearLocation, getCurrentPosition]);

  /**
   * Checks the current geolocation permission status
   */
  const checkPermissions =
    useCallback(async (): Promise<PermissionState | null> => {
      try {
        if (!navigator.permissions) {
          return null; // Permissions API not supported
        }

        const permission = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });
        return permission.state;
      } catch (error) {
        console.warn("Failed to check geolocation permissions:", error);
        return null;
      }
    }, []);

  return {
    location,
    isLoading,
    error,
    getCurrentPosition,
    setLocation,
    clearLocation,
    forceFreshLocation,
    checkPermissions,
  };
}

// Legacy exports for backward compatibility (can be removed later)
export function getCurrentPosition(): Promise<IGeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy } =
          position.coords;
        const timestamp = position.timestamp;
        const loc: IGeoLocation = {
          latitude,
          longitude,
          accuracy,
          timestamp,
          ...(altitude !== null && { altitude }),
          ...(altitudeAccuracy !== null && { altitudeAccuracy }),
        };
        resolve(loc);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function setLocation(location: IGeoLocation) {
  // This function is now deprecated, use the hook instead
  console.warn(
    "setLocation function is deprecated, use useGeolocation hook instead"
  );
}

export function getLocation(): IGeoLocation | null {
  // This function is now deprecated, use the hook instead
  console.warn(
    "getLocation function is deprecated, use useGeolocation hook instead"
  );
  return null;
}
